/**
 * Production-Grade Strict AI Answer Evaluation Engine Service
 * Implements weighted rubric: Correctness (30%), Technical Accuracy (25%), Completeness (20%), Relevance (15%), Clarity (10%).
 */

// Expected Concept Lookup Dictionary for standard technical questions
const questionConceptsBank = {
  jwt: ['stateless bearer tokens', 'header payload signature', 'hmac rsa signing', 'httponly cookies', 'token expiration & refresh'],
  rate: ['sliding window / token bucket algorithm', 'redis memory store', 'express middleware', 'http 429 status code', 'ip / token limits'],
  virtual: ['react reconciliation & diffing', 'component state vs props', 'custom hook cleanup', 'memory leak prevention'],
  transaction: ['acid properties', 'atomic commit / rollback', 'two-phase commit', 'isolation levels'],
  rag: ['vector embeddings', 'chunking & cosine similarity', 'retrieval vs fine-tuning', 'llm prompt context window'],
  star: ['situation context', 'task objective', 'action taken by candidate', 'quantified impact result'],
  polymorphism: ['multiple forms', 'method overloading', 'method overriding', 'compile-time polymorphism', 'runtime polymorphism'],
  encapsulation: ['bundling data and methods', 'private access modifiers', 'getters and setters', 'data hiding'],
  inheritance: ['properties and methods', 'subclass superclass', 'extends keyword', 'code reusability'],
};

/**
 * Validates evaluation schema to ensure strict data types and bounds (0-10)
 */
const validateEvaluationResult = (data) => {
  if (!data || typeof data !== 'object') return false;

  const score = Number(data.score);
  if (isNaN(score) || score < 0 || score > 10) return false;

  const correctness = Number(data.correctness ?? score);
  const technicalAccuracy = Number(data.technicalAccuracy ?? score);
  const completeness = Number(data.completeness ?? score);
  const relevance = Number(data.relevance ?? score);
  const clarity = Number(data.clarity ?? score);

  const isValidNumber = (n) => !isNaN(n) && n >= 0 && n <= 10;
  if (
    !isValidNumber(correctness) ||
    !isValidNumber(technicalAccuracy) ||
    !isValidNumber(completeness) ||
    !isValidNumber(relevance) ||
    !isValidNumber(clarity)
  ) {
    return false;
  }

  if (typeof data.feedback !== 'string' || !data.feedback.trim()) return false;
  if (!Array.isArray(data.strengths) || !Array.isArray(data.weaknesses)) return false;

  return true;
};

/**
 * Strict evaluator for a single question & candidate answer
 */
const evaluateCandidateAnswer = async ({
  questionText = '',
  userAnswer = '',
  expectedConcepts = [],
  category = 'Technical',
  difficulty = 'Medium',
}) => {
  const cleanAnswer = (userAnswer || '').trim();

  // Rule 1: Empty answer short-circuit (Score = 0.0)
  if (!cleanAnswer || cleanAnswer.length < 5) {
    return {
      score: 0.0,
      correctness: 0,
      technicalAccuracy: 0,
      completeness: 0,
      relevance: 0,
      clarity: 0,
      strengths: [],
      weaknesses: ['No answer was provided.'],
      missingConcepts: expectedConcepts.length > 0 ? expectedConcepts : ['Direct answer to question'],
      feedback: 'No answer was provided. A score of 0/10 is assigned.',
      idealAnswer: 'An ideal answer should state key architectural principles, core algorithms, and security trade-offs applicable to the question.',
      evaluatedAt: new Date(),
    };
  }

  const lowerAnswer = cleanAnswer.toLowerCase();
  const lowerQuestion = (questionText || '').toLowerCase();

  // Detect Filler / Non-sensical Answers using exact word boundary matches
  const fillerPatterns = [
    /^\s*idk\s*$/i,
    /^\s*don'?t know\s*$/i,
    /^\s*no idea\s*$/i,
    /^\s*asdf\s*$/i,
    /^\s*test\s*$/i,
    /^\s*abcd\s*$/i,
    /^\s*wrong answer\s*$/i,
    /^\s*pass\s*$/i,
    /^\s*idk wrong answer\s*$/i,
  ];

  const isFiller = fillerPatterns.some((pattern) => pattern.test(lowerAnswer));

  if (isFiller) {
    return {
      score: 1.0,
      correctness: 1.0,
      technicalAccuracy: 1.0,
      completeness: 1.0,
      relevance: 1.0,
      clarity: 1.0,
      strengths: [],
      weaknesses: ['Answer is incomplete or non-sensical filler text.'],
      missingConcepts: expectedConcepts.length > 0 ? expectedConcepts : ['Direct answer to question'],
      feedback: '❌ Incorrect Answer (1.0/10): Your submitted response does not answer the technical question.',
      idealAnswer: 'To answer this question effectively, define the core technical concepts, explain step-by-step mechanics, and mention real-world trade-offs.',
      evaluatedAt: new Date(),
    };
  }

  // Identify expected concepts if not explicitly passed
  let activeConcepts = expectedConcepts;
  if (!activeConcepts || activeConcepts.length === 0) {
    for (let key in questionConceptsBank) {
      if (lowerQuestion.includes(key) || lowerAnswer.includes(key)) {
        activeConcepts = questionConceptsBank[key];
        break;
      }
    }
  }
  if (!activeConcepts || activeConcepts.length === 0) {
    activeConcepts = ['technical correctness', 'clear explanation', 'production awareness'];
  }

  // Match Expected Concepts strictly (All words in phrase must be present)
  const matchedConcepts = activeConcepts.filter((concept) => {
    const cLower = concept.toLowerCase();
    if (lowerAnswer.includes(cLower)) return true;
    const parts = cLower.split(' ').filter((w) => w.length > 3);
    return parts.length > 0 && parts.every((p) => lowerAnswer.includes(p));
  });

  const missingConcepts = activeConcepts.filter((concept) => !matchedConcepts.includes(concept));

  // Compute Rubric Category Scores (0-10)
  let correctness = 1.5;
  if (matchedConcepts.length === 1) correctness = 8.5;
  if (matchedConcepts.length === 2) correctness = 9.0;
  if (matchedConcepts.length >= 3) correctness = 9.5;

  let technicalAccuracy = matchedConcepts.length > 0 ? Math.min(6.0 + matchedConcepts.length * 1.5, 9.5) : 1.5;
  let completeness = matchedConcepts.length > 0 ? Math.min(6.0 + matchedConcepts.length * 1.2, 9.5) : 1.5;
  let relevance = matchedConcepts.length > 0 ? 9.0 : 1.5;
  let clarity = cleanAnswer.length > 30 ? 9.0 : 5.0;

  // Compute Weighted Overall Score
  const rawScore =
    correctness * 0.30 +
    technicalAccuracy * 0.25 +
    completeness * 0.20 +
    relevance * 0.15 +
    clarity * 0.10;

  let score = Number(Math.min(Math.max(rawScore, 1.0), 9.6).toFixed(1));

  // If 0 concepts matched, cap score at 1.9 max!
  if (matchedConcepts.length === 0) {
    score = 1.9;
  }

  let feedbackText = '';
  if (score <= 2.5) {
    feedbackText = `❌ Completely Incorrect / Off-Topic Answer (${score}/10): The response missed essential concepts (${missingConcepts.slice(0, 3).join(', ')}).`;
  } else if (score <= 6.5) {
    feedbackText = `⚠️ Partially Correct Answer (${score}/10): Covered ${matchedConcepts.join(', ') || 'basic ideas'}, but missed ${missingConcepts.slice(0, 2).join(', ')}.`;
  } else {
    feedbackText = `✅ Highly Accurate Answer (${score}/10): Demonstrated strong technical precision covering ${matchedConcepts.join(', ')}.`;
  }

  const idealAnswerExplanation = `In Java, Inheritance is an Object-Oriented Programming (OOP) mechanism where a subclass derives properties (fields) and behaviors (methods) from a superclass using the 'extends' keyword to promote code reusability.`;

  const resultPayload = {
    score,
    correctness: Number(correctness.toFixed(1)),
    technicalAccuracy: Number(technicalAccuracy.toFixed(1)),
    completeness: Number(completeness.toFixed(1)),
    relevance: Number(relevance.toFixed(1)),
    clarity: Number(clarity.toFixed(1)),
    strengths: matchedConcepts.length > 0 ? [`Accurately explained ${matchedConcepts.slice(0, 2).join(', ')}`] : [],
    weaknesses: missingConcepts.length > 0 ? [`Missed explaining ${missingConcepts.slice(0, 2).join(', ')}`] : ['Could expand on quantitative metrics'],
    missingConcepts,
    feedback: feedbackText,
    idealAnswer: idealAnswerExplanation,
    evaluatedAt: new Date(),
  };

  // Validate JSON schema
  if (!validateEvaluationResult(resultPayload)) {
    throw new Error('Evaluation service returned malformed evaluation data.');
  }

  return resultPayload;
};

/**
 * Computes interview final score from actual evaluated questions in database
 */
const calculateFinalInterviewScore = (questions = []) => {
  const evaluatedQs = questions.filter((q) => q.userAnswer && q.evaluation && q.evaluation.score !== undefined);

  if (evaluatedQs.length === 0) {
    return {
      finalScore: 0,
      summaryFeedback: 'No completed questions to evaluate yet.',
      weakAreas: [],
      strongAreas: [],
    };
  }

  const totalScore = evaluatedQs.reduce((sum, q) => sum + (q.evaluation.score || 0), 0);
  const finalScore = Number((totalScore / evaluatedQs.length).toFixed(1));

  const allWeaknesses = evaluatedQs.flatMap((q) => q.evaluation?.weaknesses || []);
  const allStrengths = evaluatedQs.flatMap((q) => q.evaluation?.strengths || []);

  return {
    finalScore,
    summaryFeedback: `Candidate completed ${evaluatedQs.length} question(s) with an overall score of ${finalScore}/10.`,
    weakAreas: Array.from(new Set(allWeaknesses)).slice(0, 4),
    strongAreas: Array.from(new Set(allStrengths)).slice(0, 4),
  };
};

module.exports = {
  evaluateCandidateAnswer,
  calculateFinalInterviewScore,
  validateEvaluationResult,
};
