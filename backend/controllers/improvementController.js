const Interview = require('../models/Interview');
const Resume = require('../models/Resume');

// Memory fallback store for candidate improvement plan
let memoryPlan = {
  overallProgress: 57,
  completedTasksCount: 8,
  totalTasksCount: 14,
  weakAreas: [
    { topic: 'SQL JOINs & Indexing', score: 48, status: 'Needs Practice' },
    { topic: 'React Hooks & State Management', score: 54, status: 'In Progress' },
    { topic: 'System Design Architecture', score: 58, status: 'In Progress' },
    { topic: 'STAR Behavioral Communication', score: 62, status: 'Mastered 70%' },
  ],
  days: [
    {
      dayNumber: 1,
      title: 'System Design & High-Traffic Architecture',
      focusArea: 'Caching, Rate Limiting & Load Balancing',
      status: 'Completed',
      tasks: [
        { text: 'Study Token Bucket vs Sliding Window Rate Limiting algorithms', isCompleted: true },
        { text: 'Review Redis Cache invalidation strategies (LRU, LFU, TTL)', isCompleted: true },
      ],
    },
    {
      dayNumber: 2,
      title: 'Database Query Optimization & Indexing',
      focusArea: 'SQL B-Trees, Compound Indexes & Execution Plans',
      status: 'In Progress',
      tasks: [
        { text: 'Analyze SQL EXPLAIN queries and B-Tree index lookups', isCompleted: true },
        { text: 'Practice 3 complex SQL JOIN and aggregation problems', isCompleted: false },
      ],
    },
    {
      dayNumber: 3,
      title: 'React.js State Management & Custom Hooks',
      focusArea: 'useCallback, useMemo, Context API & Memory Leak Fixes',
      status: 'In Progress',
      tasks: [
        { text: 'Refactor prop-drilling components to React Context / Redux Toolkit', isCompleted: true },
        { text: 'Build a custom useDebounce & useFetch hook from scratch', isCompleted: false },
      ],
    },
    {
      dayNumber: 4,
      title: 'REST API Security & JWT Authentication',
      focusArea: 'Access Tokens, Refresh Tokens & HttpOnly Cookies',
      status: 'Pending',
      tasks: [
        { text: 'Review JWT dual-token refresh pattern & CSRF/XSS prevention', isCompleted: true },
        { text: 'Implement Express rate-limiting middleware in test project', isCompleted: false },
      ],
    },
    {
      dayNumber: 5,
      title: 'STAR Method Behavioral Storytelling',
      focusArea: 'Situation, Task, Action & Quantified Result Framing',
      status: 'Pending',
      tasks: [
        { text: 'Write down 3 STAR stories highlighting technical leadership and conflict resolution', isCompleted: true },
        { text: 'Practice speaking stories out loud keeping response time under 2 minutes', isCompleted: false },
      ],
    },
    {
      dayNumber: 6,
      title: 'Code Refactoring & Edge Case Handling',
      focusArea: 'Error Handling, Input Sanitization & Unit Testing',
      status: 'Pending',
      tasks: [
        { text: 'Write Jest / Vitest unit tests covering 90%+ code coverage for API handlers', isCompleted: true },
        { text: 'Review async/await try-catch error boundary handling', isCompleted: false },
      ],
    },
    {
      dayNumber: 7,
      title: 'Full Mock Re-Interview Simulation',
      focusArea: 'Comprehensive Evaluation & Weakness Re-Testing',
      status: 'Pending',
      tasks: [
        { text: 'Launch a 10-Question Full Stack AI Mock Interview session', isCompleted: false },
        { text: 'Verify ATS score and technical dimension improvement above 9.0/10', isCompleted: false },
      ],
    },
  ],
};

// @desc    Get candidate 7-day personalized improvement plan
// @route   GET /api/improvement-plan
// @access  Private
const getImprovementPlan = async (req, res) => {
  try {
    return res.json({
      success: true,
      improvementPlan: memoryPlan,
    });
  } catch (error) {
    console.error('Get improvement plan error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle practice task completion status
// @route   PUT /api/improvement-plan/toggle-task
// @access  Private
const toggleImprovementTask = async (req, res) => {
  try {
    const { dayNumber, taskIndex } = req.body;

    const dayObj = memoryPlan.days.find((d) => d.dayNumber === Number(dayNumber));
    if (dayObj && dayObj.tasks[taskIndex] !== undefined) {
      dayObj.tasks[taskIndex].isCompleted = !dayObj.tasks[taskIndex].isCompleted;

      // Recalculate overall progress
      let total = 0;
      let completed = 0;

      memoryPlan.days.forEach((d) => {
        d.tasks.forEach((t) => {
          total++;
          if (t.isCompleted) completed++;
        });
      });

      memoryPlan.totalTasksCount = total;
      memoryPlan.completedTasksCount = completed;
      memoryPlan.overallProgress = Math.round((completed / Math.max(total, 1)) * 100);
    }

    return res.json({
      success: true,
      message: 'Task progress updated successfully',
      improvementPlan: memoryPlan,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getImprovementPlan,
  toggleImprovementTask,
};
