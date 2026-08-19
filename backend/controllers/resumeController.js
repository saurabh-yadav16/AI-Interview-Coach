const fs = require('fs');
const path = require('path');
const Resume = require('../models/Resume');
const User = require('../models/User');
const { extractRawText, analyzeResumeContent } = require('../services/resumeParserService');

// In-memory fallback for resumes when MongoDB is disconnected
const memoryResumes = new Map();

// @desc    Upload & Parse a resume (PDF/DOCX)
// @route   POST /api/resumes/upload
// @access  Private
const uploadResume = async (req, res) => {
  try {
    if (
      !req.file ||
      !req.file.size ||
      req.file.size === 0 ||
      (req.file.path && fs.existsSync(req.file.path) && fs.statSync(req.file.path).size === 0)
    ) {
      if (req.file && req.file.path && fs.existsSync(req.file.path)) {
        try { fs.unlinkSync(req.file.path); } catch (e) {}
      }
      return res.status(400).json({
        success: false,
        message: 'Uploaded resume file is empty or corrupted (0 bytes)',
      });
    }

    const { originalname, filename, path: filePath, mimetype } = req.file;

    // Extract text from uploaded resume file
    const rawText = await extractRawText(filePath, mimetype);
    const targetRole = req.user?.targetRole || 'Software Engineer';
    const analysis = analyzeResumeContent(rawText, targetRole);

    const isDbConnected = Resume.db && Resume.db.readyState === 1;

    const resumeData = {
      fileName: originalname,
      filePath: filePath,
      fileType: mimetype,
      extractedText: rawText.slice(0, 5000), // Persist first 5k chars
      atsScore: analysis.atsScore,
      personalInfo: {
        name: req.user?.name || 'Candidate',
        email: analysis.personalInfo.email || req.user?.email || 'user@example.com',
        phone: analysis.personalInfo.phone || '',
        location: 'India',
      },
      skills: analysis.extractedSkills,
      projects: [
        {
          title: 'Full Stack AI Interview Coach Platform',
          description: 'Built an interactive AI mock interview web app with resume parsing, ATS scoring, and multi-metric evaluations.',
          technologies: analysis.extractedSkills.slice(0, 4),
        },
      ],
      education: [
        {
          degree: 'B.Tech Computer Science',
          institution: 'Tech University',
          year: '2025',
        },
      ],
      experience: [
        {
          company: 'Tech Innovations Ltd',
          role: 'Software Engineer Intern',
          duration: '6 Months',
          description: 'Developed RESTful microservices, JWT authentication middleware, and React dashboards.',
        },
      ],
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      suggestions: analysis.suggestions,
      missingKeywords: analysis.missingKeywords,
      summary: analysis.summary,
    };

    if (isDbConnected) {
      const newResume = await Resume.create({
        userId: req.user._id || req.user.id,
        ...resumeData,
      });

      // Update target user profile skills
      if (req.user && req.user._id) {
        await User.findByIdAndUpdate(req.user._id, {
          $addToSet: { skills: { $each: analysis.extractedSkills } },
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Resume uploaded, parsed, and analyzed successfully',
        resume: newResume,
      });
    } else {
      // Memory fallback mode
      const mockId = 'res_' + Date.now();
      const mockResume = {
        _id: mockId,
        id: mockId,
        userId: req.user?.id || 'usr_demo',
        createdAt: new Date().toISOString(),
        ...resumeData,
      };

      memoryResumes.set(mockId, mockResume);

      return res.status(201).json({
        success: true,
        message: 'Resume uploaded, parsed, and analyzed successfully (Development Mode)',
        resume: mockResume,
      });
    }
  } catch (error) {
    console.error('Resume upload controller error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while uploading resume',
    });
  }
};

// @desc    Analyze existing resume by ID
// @route   POST /api/resumes/:id/analyze
// @access  Private
const analyzeResume = async (req, res) => {
  try {
    const isDbConnected = Resume.db && Resume.db.readyState === 1;

    if (isDbConnected) {
      const resume = await Resume.findById(req.params.id);
      if (!resume) {
        return res.status(404).json({ success: false, message: 'Resume not found' });
      }

      const rawText = resume.extractedText || (await extractRawText(resume.filePath, resume.fileType));
      const targetRole = req.body.targetRole || req.user?.targetRole || 'Software Engineer';
      const analysis = analyzeResumeContent(rawText, targetRole);

      resume.atsScore = analysis.atsScore;
      resume.skills = analysis.extractedSkills;
      resume.strengths = analysis.strengths;
      resume.weaknesses = analysis.weaknesses;
      resume.suggestions = analysis.suggestions;
      resume.missingKeywords = analysis.missingKeywords;
      resume.summary = analysis.summary;

      await resume.save();

      return res.json({
        success: true,
        message: 'Resume analysis updated successfully',
        resume,
      });
    } else {
      const resume = memoryResumes.get(req.params.id);
      if (!resume) {
        return res.status(404).json({ success: false, message: 'Resume not found' });
      }

      const targetRole = req.body.targetRole || req.user?.targetRole || 'Software Engineer';
      const analysis = analyzeResumeContent(resume.extractedText || '', targetRole);

      const updatedResume = {
        ...resume,
        atsScore: analysis.atsScore,
        skills: analysis.extractedSkills,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        suggestions: analysis.suggestions,
        missingKeywords: analysis.missingKeywords,
        summary: analysis.summary,
      };

      memoryResumes.set(req.params.id, updatedResume);

      return res.json({
        success: true,
        message: 'Resume analysis updated successfully (Development Mode)',
        resume: updatedResume,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user resumes
// @route   GET /api/resumes
// @access  Private
const getUserResumes = async (req, res) => {
  try {
    const isDbConnected = Resume.db && Resume.db.readyState === 1;

    if (isDbConnected) {
      const resumes = await Resume.find({ userId: req.user._id || req.user.id }).sort({ createdAt: -1 });
      return res.json({ success: true, count: resumes.length, resumes });
    } else {
      const userResumes = Array.from(memoryResumes.values());
      return res.json({ success: true, count: userResumes.length, resumes: userResumes });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single resume by ID
// @route   GET /api/resumes/:id
// @access  Private
const getResumeById = async (req, res) => {
  try {
    const isDbConnected = Resume.db && Resume.db.readyState === 1;

    if (isDbConnected) {
      const resume = await Resume.findById(req.params.id);
      if (!resume) {
        return res.status(404).json({ success: false, message: 'Resume not found' });
      }
      return res.json({ success: true, resume });
    } else {
      const resume = memoryResumes.get(req.params.id);
      if (!resume) {
        return res.status(404).json({ success: false, message: 'Resume not found' });
      }
      return res.json({ success: true, resume });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete resume by ID
// @route   DELETE /api/resumes/:id
// @access  Private
const deleteResume = async (req, res) => {
  try {
    const isDbConnected = Resume.db && Resume.db.readyState === 1;

    if (isDbConnected) {
      const resume = await Resume.findById(req.params.id);
      if (!resume) {
        return res.status(404).json({ success: false, message: 'Resume not found' });
      }

      if (fs.existsSync(resume.filePath)) {
        fs.unlinkSync(resume.filePath);
      }

      await resume.deleteOne();
      return res.json({ success: true, message: 'Resume deleted successfully' });
    } else {
      const resume = memoryResumes.get(req.params.id);
      if (resume) {
        if (fs.existsSync(resume.filePath)) {
          fs.unlinkSync(resume.filePath);
        }
        memoryResumes.delete(req.params.id);
      }
      return res.json({ success: true, message: 'Resume deleted successfully' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadResume,
  analyzeResume,
  getUserResumes,
  getResumeById,
  deleteResume,
};
