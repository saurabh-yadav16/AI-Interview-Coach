const express = require('express');
const router = express.Router();
const {
  uploadResume,
  analyzeResume,
  getUserResumes,
  getResumeById,
  deleteResume,
} = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Multer error handling wrapper
const handleUpload = (req, res, next) => {
  upload.single('resume')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size limit exceeded. Maximum file size allowed is 10MB.',
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload error. Please upload a valid PDF or Word document.',
      });
    }
    next();
  });
};

router.post('/upload', protect, handleUpload, uploadResume);
router.post('/:id/analyze', protect, analyzeResume);
router.get('/', protect, getUserResumes);
router.get('/:id', protect, getResumeById);
router.delete('/:id', protect, deleteResume);

module.exports = router;
