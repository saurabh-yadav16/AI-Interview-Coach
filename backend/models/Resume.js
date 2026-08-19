const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    fileType: { type: String, required: true },
    extractedText: { type: String, default: '' },
    atsScore: { type: Number, default: 0 },
    personalInfo: {
      name: String,
      email: String,
      phone: String,
      location: String,
    },
    skills: [{ type: String }],
    projects: [
      {
        title: String,
        description: String,
        technologies: [{ type: String }],
      },
    ],
    education: [
      {
        degree: String,
        institution: String,
        year: String,
      },
    ],
    experience: [
      {
        company: String,
        role: String,
        duration: String,
        description: String,
      },
    ],
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    suggestions: [{ type: String }],
    missingKeywords: [{ type: String }],
    summary: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);
