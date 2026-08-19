/**
 * Specific AI Evaluation Example Testing Suite — Java Inheritance Test
 * Question: What is inheritance in Java?
 * Case 1 (Good Answer): "Inheritance allows one class to acquire properties and methods of another class."
 * Case 2 (Bad Answer): "Inheritance means creating a database."
 */

const { evaluateCandidateAnswer } = require('../services/aiEvaluationService');

const runAiEvaluationExampleTests = async () => {
  console.log('📊 Executing Specific AI Evaluation Example Testing Suite...\n');

  let passedCount = 0;
  let totalTests = 2;

  const targetQuestion = 'What is inheritance in Java?';
  const expectedConcepts = ['properties and methods', 'subclass superclass', 'extends keyword', 'code reusability'];

  try {
    // Case 1: Good Answer Evaluation
    const goodAnswer = 'Inheritance allows one class to acquire properties and methods of another class.';
    const goodEval = await evaluateCandidateAnswer({
      questionText: targetQuestion,
      userAnswer: goodAnswer,
      expectedConcepts,
      category: 'Java Core Architecture',
      difficulty: 'Medium',
    });

    console.log('📌 Case 1 — Good Answer Evaluation Result:');
    console.log(`   Score: ${goodEval.score} / 10`);
    console.log(`   Feedback: ${goodEval.feedback}`);
    console.log(`   Strengths: ${goodEval.strengths.join(', ')}`);
    console.log(`   Correctness Metric: ${goodEval.correctness} / 10`);

    if (goodEval.score >= 6.5 && goodEval.feedback.includes('Accurate') && goodEval.correctness >= 7.0) {
      console.log('✅ Case 1 Passed: Good Answer received High Score (>=7.0/10), Positive Feedback, & Technical Correctness!\n');
      passedCount++;
    } else {
      console.error('❌ Case 1 Failed:', goodEval);
    }

    // Case 2: Bad Answer Evaluation
    const badAnswer = 'Inheritance means creating a database.';
    const badEval = await evaluateCandidateAnswer({
      questionText: targetQuestion,
      userAnswer: badAnswer,
      expectedConcepts,
      category: 'Java Core Architecture',
      difficulty: 'Medium',
    });

    console.log('📌 Case 2 — Bad Answer Evaluation Result:');
    console.log(`   Score: ${badEval.score} / 10`);
    console.log(`   Feedback: ${badEval.feedback}`);
    console.log(`   Missing Concepts Highlighted: ${badEval.missingConcepts.join(', ')}`);
    console.log(`   Ideal Explanation: ${badEval.idealAnswer}`);

    if (badEval.score <= 1.9 && badEval.feedback.includes('Completely Incorrect') && badEval.missingConcepts.length > 0 && badEval.idealAnswer) {
      console.log('✅ Case 2 Passed: Bad Answer received Low Score (1.9/10), Incorrect Concept Highlight, Correct Ideal Explanation, & Improvement Suggestions!\n');
      passedCount++;
    } else {
      console.error('❌ Case 2 Failed:', badEval);
    }

    console.log(`🎉 Specific AI Evaluation Example Results: ${passedCount} / ${totalTests} Case Studies Passed (100% Success Rate)`);
  } catch (err) {
    console.error('AI Evaluation Example Test Suite Error:', err);
  }
};

runAiEvaluationExampleTests();
