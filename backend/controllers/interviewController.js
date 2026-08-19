const Interview = require('../models/Interview');
const Resume = require('../models/Resume');
const { evaluateCandidateAnswer, calculateFinalInterviewScore } = require('../services/aiEvaluationService');
const { generateUniqueNextQuestion } = require('../services/questionGeneratorService');

// In-memory store for dev mode fallback
const memoryInterviews = new Map();

// @desc    Start a new AI Mock Interview Session
// @route   POST /api/interviews/start
// @access  Private
const startInterview = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id || 'usr_demo';

    if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid request body provided' });
    }

    const {
      role,
      company = 'General Tech',
      interviewType = 'Technical',
      difficulty = 'Medium',
      totalQuestionsCount = 5,
      resumeId,
    } = req.body;

    if (!role || typeof role !== 'string' || !role.trim()) {
      return res.status(400).json({ success: false, message: 'Target role title is required to generate interview questions' });
    }

    const isDbConnected = Interview.db && Interview.db.readyState === 1;
    let resumeData = null;

    if (isDbConnected && resumeId) {
      resumeData = await Resume.findById(resumeId);
    } else if (resumeId) {
      resumeData = { _id: resumeId, hasResume: true };
    }

    // Generate Guaranteed Unique First Question (Order #1) Tailored to Role & Resume
    const initialQ = generateUniqueNextQuestion({
      role: role.trim(),
      company,
      interviewType,
      difficulty,
      askedQuestions: [],
      targetOrder: 1,
      resumeData,
    });

    const interviewData = {
      userId,
      resumeId: resumeId || null,
      role: role.trim(),
      company,
      interviewType,
      difficulty,
      totalQuestionsCount: Number(totalQuestionsCount) || 5,
      currentQuestionIndex: 0,
      askedQuestionIds: [initialQ.questionId],
      status: 'in_progress',
      questions: [
        {
          questionId: initialQ.questionId,
          order: 1,
          category: initialQ.category,
          questionText: initialQ.questionText,
          expectedConcepts: initialQ.expectedConcepts,
          difficulty: initialQ.difficulty,
          userAnswer: '',
          evaluation: null,
        },
      ],
      finalScore: 0,
      summaryFeedback: '',
      weakAreas: [],
      strongAreas: [],
    };

    if (isDbConnected) {
      const newInterview = await Interview.create(interviewData);
      return res.status(201).json({
        success: true,
        message: 'Interview session created successfully',
        interview: newInterview,
      });
    } else {
      const mockId = 'int_' + Date.now();
      const mockInterview = {
        _id: mockId,
        id: mockId,
        createdAt: new Date().toISOString(),
        ...interviewData,
      };

      memoryInterviews.set(mockId, mockInterview);

      return res.status(201).json({
        success: true,
        message: 'Interview session created successfully (Development Mode)',
        interview: mockInterview,
      });
    }
  } catch (error) {
    console.error('Start interview error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error starting interview session',
    });
  }
};

// @desc    Submit answer & generate guaranteed unique next question
// @route   POST /api/interviews/:id/answer
// @access  Private
const submitAnswer = async (req, res) => {
  try {
    const { questionId, questionIndex, userAnswer } = req.body;
    const userId = (req.user?._id || req.user?.id || '').toString();
    const isDbConnected = Interview.db && Interview.db.readyState === 1;

    let interview = null;

    if (isDbConnected) {
      interview = await Interview.findById(req.params.id);
    } else {
      interview = memoryInterviews.get(req.params.id);
    }

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview session not found' });
    }

    // Ownership Verification
    const sessionOwnerId = (interview.userId._id || interview.userId).toString();
    if (sessionOwnerId !== userId && userId !== 'usr_demo') {
      return res.status(403).json({ success: false, message: 'Forbidden: You do not own this interview session.' });
    }

    let idx = Number(questionIndex);
    if (isNaN(idx) || idx < 0) {
      idx = interview.currentQuestionIndex;
    }

    const currentQ = interview.questions[idx];
    if (!currentQ) {
      return res.status(400).json({ success: false, message: `Question at index ${idx} not found in session.` });
    }

    const cleanAnswer = (userAnswer || '').trim();
    currentQ.userAnswer = cleanAnswer;
    currentQ.submittedAt = new Date();

    let evalResult = null;
    try {
      evalResult = await evaluateCandidateAnswer({
        questionText: currentQ.questionText,
        userAnswer: cleanAnswer,
        expectedConcepts: currentQ.expectedConcepts || [],
        category: currentQ.category,
        difficulty: interview.difficulty,
      });
    } catch (evalErr) {
      console.error('AI Evaluation Service Failure:', evalErr.message);
      return res.status(503).json({
        success: false,
        message: 'Evaluation service temporarily unavailable. Please try again.',
      });
    }

    currentQ.evaluation = evalResult;

    const nextIndex = idx + 1;

    if (nextIndex >= interview.totalQuestionsCount) {
      interview.status = 'completed';
      interview.currentQuestionIndex = nextIndex;

      const finalSummary = calculateFinalInterviewScore(interview.questions);
      interview.finalScore = finalSummary.finalScore;
      interview.summaryFeedback = finalSummary.summaryFeedback;
      interview.weakAreas = finalSummary.weakAreas;
      interview.strongAreas = finalSummary.strongAreas;

      if (isDbConnected) {
        await interview.save();
      } else {
        memoryInterviews.set(req.params.id, interview);
      }

      return res.json({
        success: true,
        isCompleted: true,
        message: 'Interview completed and evaluated strictly',
        interview,
      });
    }

    if (!interview.questions[nextIndex]) {
      const nextQPayload = generateUniqueNextQuestion({
        role: interview.role,
        company: interview.company,
        interviewType: interview.interviewType,
        difficulty: interview.difficulty,
        askedQuestions: interview.questions,
        targetOrder: nextIndex + 1,
      });

      interview.questions.push({
        questionId: nextQPayload.questionId,
        order: nextIndex + 1,
        category: nextQPayload.category,
        questionText: nextQPayload.questionText,
        expectedConcepts: nextQPayload.expectedConcepts,
        difficulty: nextQPayload.difficulty,
        userAnswer: '',
        evaluation: null,
      });

      if (!interview.askedQuestionIds.includes(nextQPayload.questionId)) {
        interview.askedQuestionIds.push(nextQPayload.questionId);
      }
    }

    interview.currentQuestionIndex = nextIndex;

    if (isDbConnected) {
      await interview.save();
    } else {
      memoryInterviews.set(req.params.id, interview);
    }

    return res.json({
      success: true,
      isCompleted: false,
      nextQuestionIndex: nextIndex,
      nextQuestion: interview.questions[nextIndex],
      currentEvaluation: evalResult,
      interview,
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get next un-asked unique question or active session question
// @route   POST /api/interviews/:id/next-question
// @access  Private
const getNextQuestion = async (req, res) => {
  try {
    const userId = (req.user?._id || req.user?.id || '').toString();
    const isDbConnected = Interview.db && Interview.db.readyState === 1;

    let interview = null;
    if (isDbConnected) {
      interview = await Interview.findById(req.params.id);
    } else {
      interview = memoryInterviews.get(req.params.id);
    }

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview session not found' });
    }

    const sessionOwnerId = (interview.userId._id || interview.userId).toString();
    if (sessionOwnerId !== userId && userId !== 'usr_demo') {
      return res.status(403).json({ success: false, message: 'Forbidden: You do not own this interview session.' });
    }

    if (interview.status === 'completed' || interview.currentQuestionIndex >= interview.totalQuestionsCount) {
      return res.json({
        success: true,
        isCompleted: true,
        message: 'Interview session is already completed',
        interview,
      });
    }

    const currentIdx = interview.currentQuestionIndex;
    let activeQuestion = interview.questions[currentIdx];

    if (!activeQuestion) {
      const nextQPayload = generateUniqueNextQuestion({
        role: interview.role,
        company: interview.company,
        interviewType: interview.interviewType,
        difficulty: interview.difficulty,
        askedQuestions: interview.questions,
        targetOrder: currentIdx + 1,
      });

      activeQuestion = {
        questionId: nextQPayload.questionId,
        order: currentIdx + 1,
        category: nextQPayload.category,
        questionText: nextQPayload.questionText,
        expectedConcepts: nextQPayload.expectedConcepts,
        difficulty: nextQPayload.difficulty,
        userAnswer: '',
        evaluation: null,
      };

      interview.questions.push(activeQuestion);
      if (!interview.askedQuestionIds.includes(nextQPayload.questionId)) {
        interview.askedQuestionIds.push(nextQPayload.questionId);
      }

      if (isDbConnected) {
        await interview.save();
      } else {
        memoryInterviews.set(req.params.id, interview);
      }
    }

    return res.json({
      success: true,
      isCompleted: false,
      currentQuestionIndex: currentIdx,
      question: activeQuestion,
      interview,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Evaluate full interview session from database records
// @route   POST /api/interviews/:id/evaluate
// @access  Private
const evaluateInterview = async (req, res) => {
  try {
    const userId = (req.user?._id || req.user?.id || '').toString();
    const isDbConnected = Interview.db && Interview.db.readyState === 1;

    let interview = null;
    if (isDbConnected) {
      interview = await Interview.findById(req.params.id);
    } else {
      interview = memoryInterviews.get(req.params.id);
    }

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview session not found' });
    }

    const sessionOwnerId = (interview.userId._id || interview.userId).toString();
    if (sessionOwnerId !== userId && userId !== 'usr_demo') {
      return res.status(403).json({ success: false, message: 'Forbidden: You do not own this interview session.' });
    }

    for (let q of interview.questions) {
      if (q.userAnswer && (!q.evaluation || q.evaluation.score === undefined)) {
        try {
          q.evaluation = await evaluateCandidateAnswer({
            questionText: q.questionText,
            userAnswer: q.userAnswer,
            expectedConcepts: q.expectedConcepts || [],
            category: q.category,
            difficulty: interview.difficulty,
          });
        } catch (err) {
          console.error('Evaluation error during session summary:', err.message);
        }
      }
    }

    const finalSummary = calculateFinalInterviewScore(interview.questions);
    interview.finalScore = finalSummary.finalScore;
    interview.summaryFeedback = finalSummary.summaryFeedback;
    interview.weakAreas = finalSummary.weakAreas;
    interview.strongAreas = finalSummary.strongAreas;
    interview.status = 'completed';

    if (isDbConnected) {
      await interview.save();
    } else {
      memoryInterviews.set(req.params.id, interview);
    }

    return res.json({
      success: true,
      message: 'Interview session evaluated successfully',
      interview,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single interview session with ownership check
// @route   GET /api/interviews/:id
// @access  Private
const getInterviewById = async (req, res) => {
  try {
    const userId = (req.user?._id || req.user?.id || '').toString();
    const isDbConnected = Interview.db && Interview.db.readyState === 1;

    let interview = null;
    if (isDbConnected) {
      interview = await Interview.findById(req.params.id);
    } else {
      interview = memoryInterviews.get(req.params.id);
    }

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview session not found' });
    }

    const sessionOwnerId = (interview.userId._id || interview.userId).toString();
    if (sessionOwnerId !== userId && userId !== 'usr_demo') {
      return res.status(403).json({ success: false, message: 'Forbidden: You do not own this interview session.' });
    }

    return res.json({ success: true, interview });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get candidate interview history from database ONLY
// @route   GET /api/interviews/history
// @access  Private
const getInterviewHistory = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const isDbConnected = Interview.db && Interview.db.readyState === 1;

    if (isDbConnected) {
      const history = await Interview.find({ userId }).sort({ createdAt: -1 });
      return res.json({ success: true, count: history.length, history });
    } else {
      const userHistory = Array.from(memoryInterviews.values()).filter(
        (i) => (i.userId._id || i.userId).toString() === userId.toString()
      );
      return res.json({ success: true, count: userHistory.length, history: userHistory });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  memoryInterviews,
  startInterview,
  submitAnswer,
  getNextQuestion,
  evaluateInterview,
  getInterviewById,
  getInterviewHistory,
};
