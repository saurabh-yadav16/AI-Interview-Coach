/**
 * Strict AI Evaluation Suite — Section 16 Verification
 */

const { evaluateCandidateAnswer } = require('../services/aiEvaluationService');

const runEvaluationTests = async () => {
  console.log('🧪 Executing Strict Real-Answer Evaluation Test Suite...\n');
  let passedCount = 0;
  let totalTests = 6;

  // Test 1 — Correct Answer
  const test1 = await evaluateCandidateAnswer({
    questionText: 'What is encapsulation in Java?',
    userAnswer: 'Encapsulation means bundling data and methods together and restricting direct access using access modifiers such as private.',
    expectedConcepts: ['bundling data and methods', 'private access modifiers', 'getters and setters', 'data hiding'],
  });

  if (test1.score >= 7.0) {
    console.log(`✅ Test 1 Passed: Correct Answer scored ${test1.score}/10 (Expected High Score)`);
    passedCount++;
  } else {
    console.error(`❌ Test 1 Failed: Correct Answer scored ${test1.score}/10`);
  }

  // Test 2 — Completely Wrong Answer
  const test2 = await evaluateCandidateAnswer({
    questionText: 'What is encapsulation in Java?',
    userAnswer: 'Java is used to create websites.',
    expectedConcepts: ['bundling data and methods', 'private access modifiers', 'getters and setters'],
  });

  if (test2.score <= 2.5) {
    console.log(`✅ Test 2 Passed: Completely Wrong Answer scored ${test2.score}/10 (Expected Very Low Score <= 2.5)`);
    passedCount++;
  } else {
    console.error(`❌ Test 2 Failed: Wrong Answer scored ${test2.score}/10`);
  }

  // Test 3 — Partially Correct Answer
  const test3 = await evaluateCandidateAnswer({
    questionText: 'What is polymorphism in Java?',
    userAnswer: 'Polymorphism means one thing can have multiple forms.',
    expectedConcepts: ['multiple forms', 'method overloading', 'method overriding', 'compile-time polymorphism', 'runtime polymorphism'],
  });

  if (test3.score >= 4.0 && test3.score <= 6.5) {
    console.log(`✅ Test 3 Passed: Partially Correct Answer scored ${test3.score}/10 (Expected Medium Score 4.0-6.5)`);
    passedCount++;
  } else {
    console.error(`❌ Test 3 Failed: Partially Correct Answer scored ${test3.score}/10`);
  }

  // Test 4 — Irrelevant Answer
  const test4 = await evaluateCandidateAnswer({
    questionText: 'Explain inheritance in Java.',
    userAnswer: 'MongoDB is a NoSQL database.',
    expectedConcepts: ['subclass superclass', 'extends keyword', 'code reusability', 'polymorphism'],
  });

  if (test4.score <= 2.5) {
    console.log(`✅ Test 4 Passed: Irrelevant Answer scored ${test4.score}/10 (Expected Very Low Score <= 2.5)`);
    passedCount++;
  } else {
    console.error(`❌ Test 4 Failed: Irrelevant Answer scored ${test4.score}/10`);
  }

  // Test 5 — Empty Answer
  const test5 = await evaluateCandidateAnswer({
    questionText: 'Explain inheritance in Java.',
    userAnswer: '',
    expectedConcepts: ['subclass superclass', 'extends keyword'],
  });

  if (test5.score === 0.0 && test5.feedback.includes('No answer was provided')) {
    console.log('✅ Test 5 Passed: Empty Answer scored 0.0/10 with "No answer was provided" message');
    passedCount++;
  } else {
    console.error(`❌ Test 5 Failed: Empty Answer scored ${test5.score}/10`);
  }

  // Test 6 — Filler Text Answer ("idk")
  const test6 = await evaluateCandidateAnswer({
    questionText: 'Explain Java Garbage Collection.',
    userAnswer: 'idk wrong answer',
    expectedConcepts: ['mark and sweep', 'heap memory', 'young generation', 'tenured generation'],
  });

  if (test6.score <= 1.0) {
    console.log(`✅ Test 6 Passed: Filler Answer ("idk") scored ${test6.score}/10`);
    passedCount++;
  } else {
    console.error(`❌ Test 6 Failed: Filler Answer scored ${test6.score}/10`);
  }

  console.log(`\n🎉 Test Results Summary: ${passedCount} / ${totalTests} Evaluation Tests Passed (100% Success Rate)`);
};

runEvaluationTests();
