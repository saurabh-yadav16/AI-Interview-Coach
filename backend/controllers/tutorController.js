/**
 * AI Tutor & Concept Assistant Controller
 */

const generateTutorResponse = (query, category = 'General') => {
  const qLower = query.toLowerCase();

  let responseText = `Here is a structured explanation for **"${query}"**:\n\n` +
    `1. **Core Concept**: Focus on clear definition, key architectural choices, and practical production trade-offs.\n` +
    `2. **Key Talking Points**:\n` +
    `   • Start with high-level purpose (Why it is used in top tech systems).\n` +
    `   • Explain the inner mechanism or sequence flow.\n` +
    `   • Highlight edge cases and security or scalability considerations.\n` +
    `3. **Pro Interview Tip**: Use concrete quantitative metrics from your past projects to back up your answer!`;

  if (qLower.includes('jwt') || qLower.includes('token') || qLower.includes('auth')) {
    responseText = `🔑 **JWT Authentication Masterclass (Senior Staff Standards)**:\n\n` +
      `• **Structure**: JSON Web Tokens consist of 3 parts: Header (algorithm), Payload (claims like userId), and Signature (HMAC/RSA).\n` +
      `• **Transmission**: Transmitted via \`Authorization: Bearer <token>\` or HttpOnly, SameSite cookies to prevent XSS and CSRF attacks.\n` +
      `• **Verification**: The backend verifies signature statelessly using a secret key without querying the DB for state on every request.\n` +
      `• **Dual Token Pattern**: Use short-lived Access Tokens (15 min) + long-lived Refresh Tokens stored securely in HttpOnly cookies with Redis revocation.`;
  } else if (qLower.includes('star') || qLower.includes('behavioral')) {
    responseText = `⭐ **STAR Behavioral Answer Framework**:\n\n` +
      `1. **Situation** (15%): Set the context. Where were you working and what was the problem?\n` +
      `2. **Task** (15%): What was your specific responsibility?\n` +
      `3. **Action** (50%): What *you* personally did (architecture decisions, code refactoring, team coordination).\n` +
      `4. **Result** (20%): Quantify your impact! (e.g., "Reduced response latency by 40% and saved $12k/mo in cloud costs").`;
  } else if (qLower.includes('sql') || qLower.includes('nosql') || qLower.includes('index') || qLower.includes('mongodb')) {
    responseText = `📊 **SQL vs NoSQL Database Trade-Offs**:\n\n` +
      `• **SQL (Relational)**: Strong ACID compliance, structured schema, complex JOINs. Ideal for financial transactions and relational domain models.\n` +
      `• **NoSQL (MongoDB)**: High write throughput, horizontal sharding, flexible JSON document schema. Ideal for rapid iteration, high volume logs, and un-structured content.\n` +
      `• **Indexing Tip**: Always build B-Tree or Compound Indexes on query filter fields to turn O(N) table scans into O(log N) index lookups!`;
  } else if (qLower.includes('project') || qLower.includes('explain')) {
    responseText = `🚀 **How to Explain a Complex Project in 2 Minutes**:\n\n` +
      `1. **One-Sentence Hook**: State what the project does and who uses it.\n` +
      `2. **Tech Stack & Architecture**: Mention frontend, backend, database, and messaging queue choices.\n` +
      `3. **Your Specific Impact**: Highlight 2 major technical challenges you solved (e.g., JWT Auth, WebSockets, Caching).\n` +
      `4. **Quantified Result**: Mention user scale, latency improvement, or test coverage.`;
  }

  return responseText;
};

// @desc    Ask AI Tutor a technical concept or interview question
// @route   POST /api/tutor/ask
// @access  Private
const askTutor = async (req, res) => {
  try {
    const { prompt, category } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a valid prompt' });
    }

    const answer = generateTutorResponse(prompt, category);

    return res.json({
      success: true,
      answer,
      prompt,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Ask tutor error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get curated revision topic suggestions
// @route   GET /api/tutor/suggestions
// @access  Private
const getSuggestions = async (req, res) => {
  try {
    const suggestions = [
      "Explain JWT Authentication & security best practices",
      "How do I structure a STAR method behavioral answer?",
      "Compare SQL Indexes vs NoSQL MongoDB Aggregation",
      "What are React custom hooks and why use them?",
      "How to explain a complex project architecture in 2 minutes?",
    ];

    return res.json({ success: true, suggestions });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  askTutor,
  getSuggestions,
};
