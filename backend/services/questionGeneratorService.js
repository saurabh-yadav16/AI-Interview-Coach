/**
 * Production-Grade Unique Question Generation & Role/Resume Tailoring Service
 * Supports Role-based filtering (Java, React, Backend, Full Stack), Resume-based questions,
 * Level 1 Exact ID & Text Matching, and Level 2 Semantic Token Matching.
 */

// Role-specific Question Bank
const roleQuestionBank = {
  java: [
    {
      questionId: 'q_java_jvm_gc',
      topic: 'JVM Garbage Collection',
      category: 'Java Core Architecture',
      questionText: 'Explain how JVM Garbage Collection works in Java. Compare G1GC vs ZGC and explain how Young and Old Generation heaps are managed.',
      expectedConcepts: ['young and old generation', 'g1gc vs zgc', 'stop-the-world pauses', 'mark-and-sweep algorithm', 'heap memory allocation'],
    },
    {
      questionId: 'q_java_spring_di',
      topic: 'Spring Boot Dependency Injection',
      category: 'Spring Framework',
      questionText: 'How does Spring Boot IoC Container manage bean lifecycles? Explain the difference between Constructor Injection and Field Injection.',
      expectedConcepts: ['inversion of control ioc', 'bean lifecycle hooks', 'singleton vs prototype scope', 'constructor injection best practice', 'autowired annotation'],
    },
    {
      questionId: 'q_java_threads',
      topic: 'Java Multithreading & Concurrency',
      category: 'Java Concurrency',
      questionText: 'How do you handle thread safety and concurrency in Java? Compare synchronized blocks vs ReentrantLock and ExecutorService.',
      expectedConcepts: ['reentrantlock vs synchronized', 'volatile keyword memory barrier', 'executorservice threadpool', 'deadlock prevention', 'atomic variables'],
    },
    {
      questionId: 'q_java_hashmap',
      topic: 'HashMap Internals',
      category: 'Java Data Structures',
      questionText: 'Walk me through the internal working of Java HashMap. How are hash collisions resolved in Java 8+ using Red-Black Trees?',
      expectedConcepts: ['bucket array & hashing', 'equals and hashcode contract', 'linkedlist to red-black tree conversion', 'treeify threshold 8', 'load factor rehash'],
    },
  ],
  react: [
    {
      questionId: 'q_react_virtual_dom',
      topic: 'Virtual DOM & Reconciliation',
      category: 'React Core Architecture',
      questionText: 'Explain how React Virtual DOM diffing reconciliation algorithm works. How do keys help React optimize component rerenders?',
      expectedConcepts: ['virtual dom tree', 'reconciliation diffing', 'fiber architecture', 'key prop uniqueness', 'rerender minimization'],
    },
    {
      questionId: 'q_react_hooks_perf',
      topic: 'React Hooks Performance',
      category: 'React Performance Optimization',
      questionText: 'Compare useMemo vs useCallback in React. When should you use them, and what performance pitfalls can arise from premature memoization?',
      expectedConcepts: ['referential equality', 'memoization cache', 'usecallback function reference', 'usememo expensive computation', 'dependency array freshness'],
    },
    {
      questionId: 'q_react_state_mgmt',
      topic: 'State Management Architecture',
      category: 'Frontend State Architecture',
      questionText: 'How do you manage complex global state in a large React application? Compare Context API vs Redux Toolkit vs Zustand.',
      expectedConcepts: ['prop drilling avoidance', 'context provider rerenders', 'redux toolkit slice reducers', 'zustand lightweight store', 'selector optimization'],
    },
    {
      questionId: 'q_react_ssr_csr',
      topic: 'SSR vs CSR & Next.js',
      category: 'Modern Web Architecture',
      questionText: 'What is the difference between Client-Side Rendering (CSR) and Server-Side Rendering (SSR)? How does Next.js App Router optimize initial page load?',
      expectedConcepts: ['hydration process', 'seo meta indexing', 'static site generation ssg', 'server components rsc', 'time to first byte ttfb'],
    },
  ],
  backend: [
    {
      questionId: 'q_backend_node_event_loop',
      topic: 'Node.js Event Loop',
      category: 'Node.js Core Architecture',
      questionText: 'Describe the Node.js Event Loop architecture. What are the microtask and macrotask queues, and how does setImmediate differ from setTimeout?',
      expectedConcepts: ['libuv event loop', 'single threaded non-blocking', 'call stack & task queue', 'process.nexttick microtasks', 'io polling phase'],
    },
    {
      questionId: 'q_backend_jwt_auth',
      topic: 'JWT Authentication Architecture',
      category: 'Security & Auth Architecture',
      questionText: 'Walk me through how JWT authentication works end-to-end between a React frontend and Express backend, including token storage and security trade-offs.',
      expectedConcepts: ['stateless bearer tokens', 'header payload signature', 'hmac rsa signing', 'httponly cookies', 'token expiration & refresh'],
    },
    {
      questionId: 'q_backend_rate_limiting',
      topic: 'Distributed Rate Limiting',
      category: 'System Scalability',
      questionText: 'How would you design a rate-limiting middleware for a high-traffic REST API? What algorithms (Sliding Window, Token Bucket) and Redis datastores would you use?',
      expectedConcepts: ['sliding window / token bucket algorithm', 'redis memory store', 'express middleware', 'http 429 status code', 'ip / token limits'],
    },
    {
      questionId: 'q_backend_mongodb_aggregation',
      topic: 'Database Aggregations & Indexing',
      category: 'Database Architecture',
      questionText: 'How do MongoDB aggregation pipelines work? Explain how $match, $group, $lookup, and $unwind operators process documents in stages.',
      expectedConcepts: ['pipeline stages', 'document filtering $match', '$group aggregation accumulator', 'left outer join $lookup', 'index usage in aggregation'],
    },
  ],
  resume: [
    {
      questionId: 'q_resume_project_arch',
      topic: 'Resume Technical Project',
      category: 'Resume Project Deep Dive',
      questionText: 'Based on your resume experience, walk me through the technical architecture of a major project you built. What were the key engineering challenges and how did you overcome them?',
      expectedConcepts: ['resume project context', 'architectural trade-offs', 'tech stack justification', 'quantified engineering impact'],
    },
    {
      questionId: 'q_resume_skills_depth',
      topic: 'Resume Core Skillset',
      category: 'Resume Technical Competency',
      questionText: 'Your resume highlights hands-on experience with your listed core skills. Can you give a specific production example of how you used these technologies to solve a high-concurrency or performance bottleneck?',
      expectedConcepts: ['hands-on framework experience', 'production debugging', 'performance metrics', 'code optimization'],
    },
  ],
  general: [
    {
      questionId: 'q_microservices_diag',
      topic: 'Production Diagnostics',
      category: 'System Reliability',
      questionText: 'Suppose a microservice experiences high CPU usage and database connection timeouts. Walk me through your step-by-step diagnostic workflow.',
      expectedConcepts: ['apm logging tools', 'heap stack dump analysis', 'connection pooling', 'circuit breaker pattern', 'metrics profiling'],
    },
    {
      questionId: 'q_star_conflict',
      topic: 'Behavioral Leadership',
      category: 'STAR Method Behavioral',
      questionText: 'Tell me about a time when you faced a major technical disagreement with a team member. How did you resolve it and what was the outcome?',
      expectedConcepts: ['situation context', 'task objective', 'action taken by candidate', 'quantified impact result'],
    },
  ],
};

/**
 * Normalizes question text for Level 2 semantic duplicate checking
 */
const normalizeText = (text = '') => {
  const stopWords = new Set(['what', 'is', 'how', 'do', 'you', 'explain', 'describe', 'tell', 'me', 'about', 'a', 'the', 'and', 'in', 'for', 'to', 'with', 'your', 'works']);
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w))
    .join(' ');
};

/**
 * Calculates Jaccard token similarity between two normalized strings (0.0 to 1.0)
 */
const calculateTokenSimilarity = (str1, str2) => {
  const set1 = new Set(str1.split(' '));
  const set2 = new Set(str2.split(' '));

  if (set1.size === 0 || set2.size === 0) return 0;

  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1], [...set2]);

  return intersection.size / union.size;
};

/**
 * Level 1 & Level 2 Duplicate Check
 * Returns true if question is a duplicate of any previously asked questions in the session
 */
const isQuestionDuplicate = (candidateQuestion, askedQuestions = []) => {
  if (!candidateQuestion || !askedQuestions || askedQuestions.length === 0) {
    return false;
  }

  const candidateId = candidateQuestion.questionId;
  const candidateNorm = normalizeText(candidateQuestion.questionText);

  for (let q of askedQuestions) {
    const existingId = q.questionId;
    const existingNorm = normalizeText(q.questionText || '');

    if (candidateId && existingId && candidateId === existingId) {
      return true;
    }

    if (candidateQuestion.questionText.trim().toLowerCase() === (q.questionText || '').trim().toLowerCase()) {
      return true;
    }

    const similarity = calculateTokenSimilarity(candidateNorm, existingNorm);
    if (similarity >= 0.55) {
      return true;
    }
  }

  return false;
};

/**
 * Selects tailored question bank pool based on role title and resume presence
 */
const selectQuestionPoolForRole = (roleTitle = '', hasResume = false) => {
  const lower = (roleTitle || '').toLowerCase();
  let pool = [];

  if (hasResume) {
    pool = [...roleQuestionBank.resume];
  }

  if (lower.includes('java') && !lower.includes('javascript')) {
    pool = [...pool, ...roleQuestionBank.java];
  } else if (lower.includes('react') || lower.includes('frontend')) {
    pool = [...pool, ...roleQuestionBank.react];
  } else if (lower.includes('backend') || lower.includes('node') || lower.includes('express')) {
    pool = [...pool, ...roleQuestionBank.backend];
  } else {
    // Default Full Stack / Tech Pool
    pool = [...pool, ...roleQuestionBank.java, ...roleQuestionBank.react, ...roleQuestionBank.backend, ...roleQuestionBank.general];
  }

  return pool;
};

/**
 * Generates/Selects a Guaranteed Unique Next Question tailored to candidate Role & Resume
 */
const generateUniqueNextQuestion = ({
  role = 'Software Engineer',
  company = 'General Tech',
  interviewType = 'Technical',
  difficulty = 'Medium',
  askedQuestions = [],
  targetOrder = 1,
  resumeData = null,
}) => {
  const candidatePool = selectQuestionPoolForRole(role, !!resumeData);

  // Retry loop up to 3 attempts
  for (let attempt = 0; attempt < 3; attempt++) {
    const unaskedPool = candidatePool.filter(
      (q) => !isQuestionDuplicate(q, askedQuestions)
    );

    if (unaskedPool.length === 0) {
      break;
    }

    const selected = unaskedPool[(targetOrder - 1 + attempt) % unaskedPool.length];

    if (!isQuestionDuplicate(selected, askedQuestions)) {
      return {
        questionId: selected.questionId,
        order: targetOrder,
        category: selected.category,
        questionText: `[${company} ${difficulty} ${interviewType} Round] ${selected.questionText}`,
        expectedConcepts: selected.expectedConcepts,
        difficulty,
      };
    }
  }

  // Dynamic custom unique fallback
  const uniqueId = `q_custom_${Date.now()}_${targetOrder}`;
  const customText = `[${company} ${difficulty} ${interviewType} Round #${targetOrder}] Explain key architectural considerations and performance trade-offs when scaling ${role} applications under heavy production load.`;

  return {
    questionId: uniqueId,
    order: targetOrder,
    category: `${interviewType} Deep Dive`,
    questionText: customText,
    expectedConcepts: ['scalability trade-offs', 'load testing', 'bottleneck identification', 'performance optimization'],
    difficulty,
  };
};

module.exports = {
  roleQuestionBank,
  selectQuestionPoolForRole,
  isQuestionDuplicate,
  generateUniqueNextQuestion,
  normalizeText,
  calculateTokenSimilarity,
};
