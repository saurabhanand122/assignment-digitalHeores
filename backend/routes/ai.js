const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Helper function to call Gemini API using Node's native fetch
async function callGemini(prompt) {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not defined in backend configuration. Please ensure it is set as an environment variable.');
    }
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const payload = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const candidate = data?.candidates?.[0];
    const textResult = candidate?.content?.parts?.[0]?.text;

    if (!textResult) {
      throw new Error('Empty response returned from Gemini AI');
    }
    
    return textResult;
  } catch (err) {
    console.error('Gemini API call failed:', err.message);
    throw err;
  }
}

// 1. POST /enhance - Rewrite resume text
router.post('/enhance', async (req, res) => {
  const { text, type } = req.body;

  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Text content is required for enhancement' });
  }

  let prompt = '';
  if (type === 'summary') {
    prompt = `You are a professional resume writer. Rewrite the following professional summary to make it highly engaging, impactful, and tailored. Keep it concise (2-4 sentences max), use a sophisticated tone, and use strong action verbs. Do not use generic filler words. Return ONLY the enhanced summary text, with no extra commentary, introductory sentences, or quotes.\n\nOriginal summary:\n"${text}"`;
  } else if (type === 'experience' || type === 'project') {
    prompt = `You are a professional resume writer. Enhance the following work experience/project description. Make it use high-impact action verbs (e.g. Spearheaded, Engineered, Orchestrated, Optimized), focus on achievements and technical contributions, and structure it cleanly as standard resume bullet points or a short description. Do not include markdown headers or introduction. Return ONLY the enhanced text, with no extra commentary or quotes.\n\nOriginal text:\n"${text}"`;
  } else {
    prompt = `You are a professional resume writer. Polish the following resume text to make it sound professional, structured, and punchy. Return ONLY the polished text with no extra commentary or quotes.\n\nOriginal text:\n"${text}"`;
  }

  try {
    const enhancedText = await callGemini(prompt);
    res.json({ enhancedText: enhancedText.trim() });
  } catch (err) {
    res.status(500).json({ error: 'AI Enhancement failed: ' + err.message });
  }
});

// 2. POST /chat - Chat assistant
router.post('/chat', async (req, res) => {
  const { message, history } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'Message content is required' });
  }

  // Format conversational context
  let contextPrompt = "You are a professional resume writing assistant and career coach. Help the user draft their resume, choose templates, write action verbs, or offer general job search guidance. Keep your responses friendly, concise, and highly professional.\n\n";
  
  if (history && Array.isArray(history)) {
    history.forEach(item => {
      contextPrompt += `${item.role === 'user' ? 'User' : 'Assistant'}: ${item.content}\n`;
    });
  }
  
  contextPrompt += `User: ${message}\nAssistant:`;

  try {
    const aiResponse = await callGemini(contextPrompt);
    res.json({ reply: aiResponse.trim() });
  } catch (err) {
    res.status(500).json({ error: 'Chat failure: ' + err.message });
  }
});

// 3. POST /suggest-keywords - Suggest keywords & skills based on company and job title
router.post('/suggest-keywords', async (req, res) => {
  const { company, jobTitle } = req.body;

  if (!company || !jobTitle) {
    return res.status(400).json({ error: 'Both company name and job title are required' });
  }

  const prompt = `You are a recruiter and career strategist. Suggest the best resume keywords, core technical/soft skills, and action bullets for a candidate applying for the job title "${jobTitle}" at "${company}". 
Return the output strictly in the following JSON format so it can be parsed:
{
  "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
  "keywords": ["Keyword 1", "Keyword 2", "Keyword 3", "Keyword 4", "Keyword 5"],
  "bulletPoints": [
    "Draft bullet point 1 (using action verbs and metric placeholders)",
    "Draft bullet point 2 (using action verbs and metric placeholders)",
    "Draft bullet point 3 (using action verbs and metric placeholders)"
  ]
}
Return ONLY this JSON block. Do not include markdown tags (like \`\`\`json), explanations, or introduction text.`;

  let responseText = '';
  try {
    responseText = await callGemini(prompt);
    
    // Clean potential markdown wrap if Gemini returns it despite instructions
    let cleanText = responseText.trim();
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/```$/, '').trim();
    }

    const data = JSON.parse(cleanText);
    res.json(data);
  } catch (err) {
    console.error('Failed parsing JSON from Gemini:', err.message, '\nRaw response:', responseText);
    res.status(500).json({ 
      error: 'Failed to parse suggestions: ' + err.message,
      rawResponse: responseText || null 
    });
  }
});

// 4. POST /extract-resume - Parse uploaded PDF/TXT and extract keywords/skills
router.post('/extract-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded' });
    }

    let extractedText = '';
    const fileType = req.file.mimetype;

    if (fileType === 'application/pdf') {
      const { getDocumentProxy, extractText } = await import('unpdf');
      const pdf = await getDocumentProxy(new Uint8Array(req.file.buffer));
      const { text } = await extractText(pdf, { mergePages: true });
      extractedText = text;
    } else if (fileType === 'text/plain') {
      extractedText = req.file.buffer.toString('utf-8');
    } else {
      return res.status(400).json({ error: 'Unsupported file format. Please upload a PDF or TXT file.' });
    }

    if (!extractedText.trim()) {
      return res.status(400).json({ error: 'Could not extract text from the file.' });
    }

    // Prompt Gemini AI to extract keywords and details
    const prompt = `You are an expert ATS (Applicant Tracking System) optimizer and professional recruiter. Analyze the following resume text and extract the key details.
Return the output strictly in the following JSON format:
{
  "fullName": "Candidate Name (if found, otherwise empty)",
  "email": "candidate.email@example.com (if found, otherwise empty)",
  "phone": "Phone number (if found, otherwise empty)",
  "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6", "Skill 7", "Skill 8", "Skill 9", "Skill 10"],
  "keywords": ["ATS Keyword 1", "ATS Keyword 2", "ATS Keyword 3", "ATS Keyword 4", "ATS Keyword 5", "ATS Keyword 6", "ATS Keyword 7", "ATS Keyword 8", "ATS Keyword 9", "ATS Keyword 10"]
}
Limit skills and keywords to a maximum of 10 high-value items each.
Return ONLY this JSON block. Do not include markdown tags (like \`\`\`json), explanations, or introduction text.

Resume text:
${extractedText}`;

    const responseText = await callGemini(prompt);

    // Clean up markdown markers if Gemini returned them
    let cleanText = responseText.trim();
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/```$/, '').trim();
    }

    const parsedData = JSON.parse(cleanText);
    res.json(parsedData);
  } catch (err) {
    console.error('Extraction failure:', err);
    res.status(500).json({ error: 'Failed to extract resume details: ' + err.message });
  }
});

module.exports = router;
