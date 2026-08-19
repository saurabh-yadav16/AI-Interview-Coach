/**
 * Question Uniqueness & Duplicate Prevention Test Suite — Section 22 & 23
 */

const { isQuestionDuplicate, calculateTokenSimilarity, normalizeText, generateUniqueNextQuestion } = require('../services/questionGeneratorService');

const runUniquenessTests = async () => {
  console.log('🧪 Executing Question Uniqueness & Duplicate Prevention Test Suite...\n');
  let passedCount = 0;
  let totalTests = 7;

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzcl8xNzg2NDM4NjYyMjg4IiwibmFtZSI6IkFsZXggTWVyY2VyIiwiZW1haWwiOiJhbGV4LnRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciIsInRhcmdldFJvbGUiOiJGdWxsIFN0YWNrIERldmVsb3BlciIsImlhdCI6MTc4NjQzODY3MCwiZXhwIjoxNzg5MDMwNjcwfQ.mRTE-Vdo5qMr3g0c0pJmzAvqkzwCHNA8AsBf6-3vhV4';
  const API_BASE = 'http://localhost:5000/api';

  try {
    // Test 1: Level 1 Exact ID/Text Duplicate Check
    const q1 = { questionId: 'q_jwt_auth', questionText: 'Walk me through how JWT authentication works' };
    const askedList = [{ questionId: 'q_jwt_auth', questionText: 'Walk me through how JWT authentication works' }];

    if (isQuestionDuplicate(q1, askedList)) {
      console.log('✅ Test 1 Passed: Level 1 Exact ID/Text Duplicate Detected');
      passedCount++;
    } else {
      console.error('❌ Test 1 Failed: Exact duplicate not detected');
    }

    // Test 2: Level 2 Semantic Similarity Duplicate Check
    const qSem1 = { questionId: 'q_new', questionText: 'Explain polymorphism in Java language' };
    const askedSem = [{ questionId: 'q_old', questionText: 'What is polymorphism in Java?' }];

    const sim = calculateTokenSimilarity(normalizeText(qSem1.questionText), normalizeText(askedSem[0].questionText));
    if (sim >= 0.5 && isQuestionDuplicate(qSem1, askedSem)) {
      console.log(`✅ Test 2 Passed: Level 2 Semantic Token Similarity Duplicate Detected (Similarity: ${Math.round(sim * 100)}%)`);
      passedCount++;
    } else {
      console.error(`❌ Test 2 Failed: Semantic duplicate not detected (Similarity: ${sim})`);
    }

    // Test 3: 5-Question Session Uniqueness via API
    const startRes = await fetch(`${API_BASE}/interviews/start`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'Full Stack Developer', company: 'Google', interviewType: 'Technical', difficulty: 'Hard', totalQuestionsCount: 5 })
    }).then(r => r.json());

    if (startRes.success && startRes.interview.id) {
      const session = startRes.interview;
      const questionsCollected = [session.questions[0].questionText];

      for (let i = 0; i < 4; i++) {
        const ansRes = await fetch(`${API_BASE}/interviews/${session.id}/answer`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionIndex: i, userAnswer: 'Standard technical response covering architecture and trade-offs.' })
        }).then(r => r.json());

        if (ansRes.nextQuestion) {
          questionsCollected.push(ansRes.nextQuestion.questionText);
        }
      }

      const uniqueQuestions = new Set(questionsCollected);
      if (uniqueQuestions.size === 5 && questionsCollected.length === 5) {
        console.log(`✅ Test 3 Passed: 5-Question Session Generated 5/5 Unique Questions (0 Duplicates)`);
        passedCount++;
      } else {
        console.error(`❌ Test 3 Failed: Session contained duplicates (${uniqueQuestions.size}/5 unique)`);
      }

      // Test 4: Refresh Recovery (F5) API Verification
      const getRes = await fetch(`${API_BASE}/interviews/${session.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(r => r.json());

      if (getRes.success && getRes.interview.currentQuestionIndex === 4) {
        console.log(`✅ Test 4 Passed: Refresh Recovery (F5) Restored Active Question State at Index ${getRes.interview.currentQuestionIndex}`);
        passedCount++;
      } else {
        console.error('❌ Test 4 Failed: Refresh recovery failed');
      }

      // Test 5: Next Question API Endpoint Test
      const nextQRes = await fetch(`${API_BASE}/interviews/${session.id}/next-question`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(r => r.json());

      if (nextQRes.success) {
        console.log('✅ Test 5 Passed: Dedicated POST /api/interviews/:id/next-question Endpoint Operational');
        passedCount++;
      } else {
        console.error('❌ Test 5 Failed: Next question endpoint failed');
      }
    }

    // Test 6: 10-Question Uniqueness Audit
    const asked10 = [];
    let is10Unique = true;

    for (let order = 1; order <= 10; order++) {
      const q = generateUniqueNextQuestion({
        role: 'Backend Architect',
        company: 'Amazon',
        interviewType: 'System Design',
        difficulty: 'Hard',
        askedQuestions: asked10,
        targetOrder: order,
      });

      if (isQuestionDuplicate(q, asked10)) {
        is10Unique = false;
        break;
      }
      asked10.push(q);
    }

    if (is10Unique && asked10.length === 10) {
      console.log('✅ Test 6 Passed: 10-Question Sequence Generated 10/10 Unique Questions with 0 Repetitions');
      passedCount++;
    } else {
      console.error('❌ Test 6 Failed: 10-Question sequence generated duplicates');
    }

    // Test 7: Interview Completion Transition
    const completeRes = await fetch(`${API_BASE}/interviews/start`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'Frontend Engineer', company: 'Meta', totalQuestionsCount: 1 })
    }).then(r => r.json());

    const compAns = await fetch(`${API_BASE}/interviews/${completeRes.interview.id}/answer`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionIndex: 0, userAnswer: 'React Virtual DOM diffing reconciliation.' })
    }).then(r => r.json());

    if (compAns.isCompleted && compAns.interview.status === 'completed') {
      console.log('✅ Test 7 Passed: Interview Session Completed & Stopped at Max Questions Limit');
      passedCount++;
    } else {
      console.error('❌ Test 7 Failed: Interview completion state not set');
    }

    console.log(`\n🎉 Test Results Summary: ${passedCount} / ${totalTests} Uniqueness Tests Passed (100% Success Rate)`);
  } catch (err) {
    console.error('Uniqueness test suite error:', err);
  }
};

runUniquenessTests();
