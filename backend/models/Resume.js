const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: true,
    default: 'Untitled Resume'
  },
  template: {
    type: String,
    required: true,
    default: 'slide' // 'slide', 'modern', 'minimal'
  },
  colorTheme: {
    type: String,
    default: 'default' // 'default', 'terracotta', 'emerald', 'indigo'
  },
  personal: {
    fullName: { type: String, default: '' },
    title: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    summary: { type: String, default: '' }
  },
  experience: [
    {
      role: { type: String, default: '' },
      company: { type: String, default: '' },
      location: { type: String, default: '' },
      startDate: { type: String, default: '' },
      endDate: { type: String, default: '' },
      description: { type: String, default: '' }
    }
  ],
  education: [
    {
      degree: { type: String, default: '' },
      school: { type: String, default: '' },
      location: { type: String, default: '' },
      gradDate: { type: String, default: '' },
      score: { type: String, default: '' }
    }
  ],
  skills: [
    {
      name: { type: String, default: '' },
      level: { type: Number, default: 3 }
    }
  ],
  projects: [
    {
      title: { type: String, default: '' },
      role: { type: String, default: '' },
      technologies: { type: String, default: '' },
      description: { type: String, default: '' },
      link: { type: String, default: '' }
    }
  ],
  certifications: [
    {
      title: { type: String, default: '' },
      issuer: { type: String, default: '' },
      date: { type: String, default: '' }
    }
  ],
  links: [
    {
      label: { type: String, default: '' },
      url: { type: String, default: '' },
      iconType: { type: String, default: 'smiley' } // 'smiley', 'video', 'menu'
    }
  ],
  fontSizeScale: {
    type: Number,
    default: 14
  },
  spacingScale: {
    type: Number,
    default: 1.5
  }
}, { timestamps: true });

module.exports = mongoose.model('Resume', ResumeSchema);
