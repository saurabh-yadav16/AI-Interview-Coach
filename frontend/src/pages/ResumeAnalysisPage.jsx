import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, Sparkles, PlayCircle, Star, ArrowRight, FileText, Check, Lightbulb, Zap, RefreshCw } from 'lucide-react';
import { analyzeResumeApi } from '../services/api';

const ResumeAnalysisPage = () => {
  const storedAnalysis = localStorage.getItem('current_resume_analysis');
  const [resume, setResume] = useState(storedAnalysis ? JSON.parse(storedAnalysis) : null);
  const [targetRole, setTargetRole] = useState(resume?.targetRole || 'Software Engineer');
  const [isReanalyzing, setIsReanalyzing] = useState(false);

  const handleReanalyze = async (newRole) => {
    if (!resume?._id && !resume?.id) return;
    setIsReanalyzing(true);
    try {
      const res = await analyzeResumeApi(resume._id || resume.id, newRole);
      if (res.success && res.resume) {
        setResume(res.resume);
        localStorage.setItem('current_resume_analysis', JSON.stringify(res.resume));
      }
    } catch (err) {
      console.error('Re-analysis error:', err);
    } finally {
      setIsReanalyzing(false);
    }
  };

  const fileName = resume?.fileName || 'resume_alex_mercer.pdf';
  const atsScore = resume?.atsScore || 84;
  const skills = resume?.skills || ['JavaScript', 'React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'JWT Auth', 'Git', 'Tailwind CSS'];
  const strengths = resume?.strengths || [
    'Extracted key technical skills matching target role',
    'Demonstrated practical project building experience with modern frameworks',
    'Clean formatting and readable structure for automated screeners',
  ];
  const weaknesses = resume?.weaknesses || [
    'Missing core keywords commonly required by top tech screeners',
    'Project descriptions could benefit from more quantitative metrics',
  ];
  const suggestions = resume?.suggestions || [
    'Add explicit section for System Design, Docker, and Redis to boost ATS match above 90%',
    'Quantify achievements using metrics (e.g., "Reduced response latency by 35%")',
  ];
  const missingKeywords = resume?.missingKeywords || ['SYSTEM DESIGN', 'DOCKER', 'REDIS', 'CI/CD'];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-10 xl:px-12 max-w-[1720px] w-full mx-auto space-y-8 bg-white min-h-[calc(100vh-4rem)]">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-emerald-50/50 p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-sm">
        <div className="space-y-1">
          <div className="mint-pill mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>ATS Resume Analysis Complete</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{fileName}</h1>
          <p className="text-xs text-slate-500 font-bold">Parsed by Resume Parser Service • {skills.length} Technical Skills Extracted</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/interview-setup"
            className="emerald-button text-sm px-6 py-3.5"
          >
            <span>Start Resume Mock Interview</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Role Target Switcher */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <RefreshCw className={`w-4 h-4 text-emerald-700 ${isReanalyzing ? 'animate-spin' : ''}`} />
          <span>Re-score Resume for Role:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'AI Engineer'].map((r) => (
            <button
              key={r}
              onClick={() => {
                setTargetRole(r);
                handleReanalyze(r);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                targetRole === r
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-emerald-500'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Main Analysis Score Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* ATS Score Display */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm text-center space-y-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">ATS Score Match</span>
          <div className="text-5xl font-black text-emerald-700">{atsScore} <span className="text-xl text-slate-400 font-bold">/ 100</span></div>
          <p className="text-xs text-emerald-700 font-bold bg-emerald-50 py-1.5 px-3 rounded-full border border-emerald-100">
            ✓ Strong match for {targetRole} candidate screeners
          </p>
        </div>

        {/* Skills Breakdown */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-700" />
            Parsed Skills Dictionary ({skills.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((s, idx) => (
              <span key={idx} className="px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold">
                ✓ {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Deep Analysis Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Strengths */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Resume Strengths
          </h3>
          <ul className="space-y-2">
            {strengths.map((str, idx) => (
              <li key={idx} className="text-xs font-medium text-slate-700 flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Missing Keywords & Recommendations */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Missing Keywords Gap Analysis
          </h3>
          <div className="flex flex-wrap gap-2">
            {missingKeywords.map((kw, idx) => (
              <span key={idx} className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                + {kw}
              </span>
            ))}
          </div>
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-emerald-600" />
              AI Recommendations to Boost ATS Score
            </h4>
            <ul className="space-y-1.5">
              {suggestions.map((sug, idx) => (
                <li key={idx} className="text-xs text-slate-600 leading-relaxed font-medium">
                  • {sug}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalysisPage;
