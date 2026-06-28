# 🦸‍♂️ AI Resume Builder

A modern, full-stack, AI-powered Resume Builder designed to help professionals build, customize, and optimize their resumes for ATS systems using the Gemini API. 

This application features a rich, responsive interface with a side-by-side editing and preview screen, dark/light themes, and custom styling controls, all integrated with a Node.js/Express backend and MongoDB.

### 🌐 Live Deployment Links
* **Frontend Web App**: [https://helpin-resume-builder.vercel.app/](https://helpin-resume-builder.vercel.app/)
* **Backend API**: [https://resume-builder-backend-kohl.vercel.app/](https://resume-builder-backend-kohl.vercel.app/)

---

## 🚀 Key Features

### 💻 Frontend & Styling
* **Theme Customization**: Toggle site-wide themes (`Cream`, `Indigo`, `Dark`) to suit your personal aesthetic.
* **Side-by-Side Editor & Preview**: Update resume fields and instantly visualize the changes.
* **Tailored Resume Templates**: Switch between `Slide` (Digital Hero layout), `Modern`, and `Minimal` designs.
* **Granular Layout Controls**: Adjust color themes (`Default`, `Terracotta`, `Emerald`, `Indigo`), font scale, and margins dynamically.
* **Responsive & Accessible**: Crafted using CSS and Lucide React icons, adapting to both desktop and mobile screens.

### 🤖 Gemini AI-Powered Assistant Suite (Gemini 2.5 Flash)
* **AI Resume Enhancer**: Rewrite and polish professional summaries and work experience bullet points using action-oriented language.
* **AI Resume Generator**: Generate a full resume draft from scratch by entering a target job title, company, and background details.
* **Interactive AI Chatbot**: A virtual career coach/resume assistant to answer formatting queries, brainstorm content, or write bullet points.
* **ATS Keyword & Skill Suggester**: Get recommendations for core technical/soft skills and bullet points tailored to a specific job title and company.
* **ATS Resume Parser**: Upload your existing resume (PDF or TXT) to automatically extract contact details, skills, and ATS keywords.

### 🔒 Security & Sharing
* **Secure User Authentication**: Integrated with Clerk Auth, matching the theme colors dynamically.
* **Public Resume Sharing**: Share your resume via a public link so recruiters or peers can view the interactive preview.
* **Local/Cloud Storage**: Persistent storage in MongoDB.

---

## 🛠️ Technology Stack

### Frontend
* **Core**: React 19, JavaScript (ES6+), HTML5, CSS3
* **Bundler**: Vite
* **Authentication**: `@clerk/clerk-react`
* **Icons**: `lucide-react`
* **HTTP Client**: `axios`

### Backend
* **Runtime & Framework**: Node.js with Express
* **Database**: MongoDB Atlas with Mongoose ODM
* **File Processing**: `multer` & `unpdf` (for parsing uploaded PDFs)
* **AI Integration**: Gemini API using native Node fetch calls to `gemini-2.5-flash`

---

## 📁 Repository Structure

```text
assignment - digital heroes/
├── backend/                   # Node.js/Express API
│   ├── api/                   # Server entry point (index.js)
│   ├── models/                # Mongoose Database Schemas (Resume.js)
│   ├── routes/                # Express Route Handlers (resumes.js, ai.js)
│   ├── package.json           # Backend dependencies and scripts
│   └── .env                   # Backend environment variables
│
└── frontend/                  # React/Vite App
    ├── src/                   # React components & stylesheet
    │   ├── components/        # Resume Editor, Preview, Chatbot, Dashboard, etc.
    │   ├── App.jsx            # Main app router & layout coordinator
    │   ├── index.css          # Main styling & design tokens
    │   └── main.jsx           # App initialization
    ├── package.json           # Frontend dependencies and scripts
    └── .env                   # Frontend environment variables
```

---

## ⚙️ Setup & Configuration

To run this project locally, you need to configure the environment variables for both the backend and frontend.

### 1. Backend Environment Setup (`backend/.env`)

Create a file named `.env` in the [backend/](file:///E:/Learning/webdev/project/assignment - digital heroes/backend) directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
```

### 2. Frontend Environment Setup (`frontend/.env`)

Create a file named `.env` in the [frontend/](file:///E:/Learning/webdev/project/assignment - digital heroes/frontend) directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_FRONTEND_URL=http://localhost:5173
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

---

## 🏃‍♂️ How to Run Locally

### Step 1: Start the Backend Server
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend in development mode (using nodemon):
   ```bash
   npm run dev
   ```
   The backend will start on port `5000` (or the port specified in your `.env`).

### Step 2: Start the Frontend Application
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

---

## 🚀 Deployment

Both the frontend and backend are configured for easy deployment on **Vercel** with custom configurations:
* [backend/vercel.json](file:///E:/Learning/webdev/project/assignment - digital heroes/backend/vercel.json) configures server routes and serverless execution.
* [frontend/vercel.json](file:///E:/Learning/webdev/project/assignment - digital heroes/frontend/vercel.json) handles single-page app routing.

---

## 👤 Developer & Support

* **Developer**: Saurabh Anand
* **Email**: saurabh.anand122@gmail.com
* **GitHub**: [saurabhanand122](https://github.com/saurabhanand122)
