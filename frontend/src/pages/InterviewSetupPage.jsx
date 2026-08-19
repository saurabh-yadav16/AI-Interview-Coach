import React, { useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { PlayCircle, Sparkles, Sliders, Building2, Briefcase, Award, AlertCircle, HelpCircle, FileText } from 'lucide-react';
import { startInterviewApi } from '../services/api';

const InterviewSetupPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const selectedRole = location.state?.selectedRole || searchParams.get('role');

  const [role, setRole] = useState(selectedRole || 'Full Stack Developer');
  const [customRole, setCustomRole] = useState('');
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [company, setCompany] = useState('Google');
  const [interviewType, setInterviewType] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(5);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleStart = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const finalRole = isCustomRole && customRole.trim() ? customRole.trim() : role;
    const storedResume = localStorage.getItem('current_resume_analysis');
    const parsedResume = storedResume ? JSON.parse(storedResume) : null;

    try {
      const res = await startInterviewApi({
        role: finalRole,
        company,
        interviewType,
        difficulty,
        totalQuestionsCount: questionCount,
        resumeId: parsedResume?._id || parsedResume?.id,
      });

      if (res.success && res.interview) {
        localStorage.setItem('active_interview_session', JSON.stringify(res.interview));
        navigate('/interview-room');
      }
    } catch (err) {
      console.error('Start interview error:', err);
      setError(err.message || 'Failed to start interview session. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 bg-white min-h-[calc(100vh-4rem)]">
      <div className="text-center space-y-2">
        <div className="mint-pill">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>Interactive AI Mock Setup</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Configure Your AI Mock Interview</h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto font-medium">
          Customize target job role, company interview style, category, difficulty, and question count.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-sm font-bold">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xl shadow-emerald-900/5 space-y-6">
        <form onSubmit={handleStart} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Target Job Role Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Target Job Role
              </label>
              {!isCustomRole ? (
                <select
                  value={role}
                  onChange={(e) => {
                    if (e.target.value === 'CUSTOM_ROLE') {
                      setIsCustomRole(true);
                    } else {
                      setRole(e.target.value);
                    }
                  }}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                >
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Software Developer">Software Developer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Java Developer">Java Developer</option>
                  <option value="Python Developer">Python Developer</option>
                  <option value="React Developer">React Developer</option>
                  <option value="Node.js Developer">Node.js Developer</option>
                  <option value="MERN Stack Developer">MERN Stack Developer</option>
                  <option value="AI Engineer">AI Engineer</option>
                  <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                  <option value="Cloud Engineer">Cloud Engineer</option>
                  <option value="QA Engineer">QA Engineer</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="HR Interview">HR Interview</option>
                  <option value="CUSTOM_ROLE">+ Enter Custom Role...</option>
                </select>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    placeholder="e.g., Cyber Security Analyst"
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCustomRole(false)}
                    className="px-3 py-2 bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-200"
                  >
                    Preset List
                  </button>
                </div>
              )}
            </div>

            {/* Company Style */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Company Interview Style
              </label>
              <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              >
                <option value="Google">Google (System Design & Algorithmic Rigor)</option>
                <option value="Amazon">Amazon (STAR Behavioral & LP Focus)</option>
                <option value="Microsoft">Microsoft (Coding & OOP Concepts)</option>
                <option value="Adobe">Adobe (UI & Core CS Fundamentals)</option>
                <option value="TCS">TCS (Technical & Quantitative Screen)</option>
                <option value="Infosys">Infosys (Core Technical & Aptitude)</option>
                <option value="Wipro">Wipro (General Tech Interview)</option>
                <option value="General Tech">General Startup / Tech Industry</option>
              </select>
            </div>

            {/* Interview Type */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Interview Category
              </label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              >
                <option value="Technical">Technical Round</option>
                <option value="Resume-Based">Resume-Based Round (Using Extracted Projects)</option>
                <option value="HR">HR & Behavioral (STAR Framework)</option>
                <option value="Managerial">Managerial & System Architecture</option>
                <option value="Coding">Coding & DSA</option>
                <option value="Mixed">Mixed Categories</option>
              </select>
            </div>

            {/* Difficulty Level */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              >
                <option value="Easy">Easy (Entry Level / Freshers)</option>
                <option value="Medium">Medium (Mid-level Engineer)</option>
                <option value="Hard">Hard (Senior Engineer)</option>
                <option value="Expert">Expert (Principal / Staff Architect)</option>
              </select>
            </div>
          </div>

          {/* Question Count Slider */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Number of Interview Questions
              </label>
              <span className="text-xs font-black text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-200">
                {questionCount} Questions
              </span>
            </div>
            <div className="flex gap-4">
              {[3, 5, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuestionCount(num)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    questionCount === num
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-50 border border-slate-200 text-slate-700 hover:border-emerald-500'
                  }`}
                >
                  {num} Questions ({num * 3} Mins)
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="emerald-button w-full text-base font-bold py-4 disabled:opacity-50"
          >
            <PlayCircle className="w-5 h-5" />
            <span>{isSubmitting ? 'Configuring Session...' : 'Launch AI Mock Interview Session'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default InterviewSetupPage;
