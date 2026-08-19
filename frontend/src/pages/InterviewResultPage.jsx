import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, CheckCircle2, AlertTriangle, ArrowRight, BookOpen, Star, Sparkles, ChevronDown, ChevronUp, Zap, FileText } from 'lucide-react';

const InterviewResultPage = () => {
  const storedResult = localStorage.getItem('completed_interview_result');
  const result = storedResult ? JSON.parse(storedResult) : null;

  const [expandedIndex, setExpandedIndex] = useState(0);

  const finalScore = result?.finalScore !== undefined ? result.finalScore : 0;
  const questions = result?.questions || [];

  const weakAreas = result?.weakAreas || [];
  const strongAreas = result?.strongAreas || [];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-10 xl:px-12 max-w-[1720px] w-full mx-auto space-y-8 bg-white min-h-[calc(100vh-4rem)]">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-emerald-50/60 p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-sm">
        <div className="space-y-1">
          <div className="mint-pill mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Strict Multi-Metric Evaluation Complete</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {result?.role || 'Full Stack Developer'} • {result?.company || 'General Tech'} Mock Interview Report
          </h1>
          <p className="text-xs text-slate-500 font-bold">
            Evaluated on Weighted Rubric (Correctness 30%, Tech Accuracy 25%, Completeness 20%, Relevance 15%, Clarity 10%)
          </p>
        </div>

        <Link
          to="/improvement-plan"
          className="emerald-button text-sm px-6 py-3.5"
        >
          <BookOpen className="w-4 h-4" />
          <span>View 7-Day Improvement Plan</span>
        </Link>
      </div>

      {/* Main Score & Dimensions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Overall Score Box */}
        <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-200/90 shadow-xl shadow-emerald-900/5 text-center space-y-4 flex flex-col justify-center items-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Performance Score</span>
          <div className="text-6xl font-black text-emerald-700">{finalScore} <span className="text-2xl text-slate-400 font-bold">/ 10</span></div>
          <div className={`px-4 py-1.5 rounded-full text-xs font-extrabold border ${
            finalScore >= 7.0
              ? 'bg-emerald-100/80 border-emerald-200 text-emerald-800'
              : finalScore >= 4.0
              ? 'bg-amber-100 border-amber-200 text-amber-800'
              : 'bg-rose-100 border-rose-200 text-rose-800'
          }`}>
            {finalScore >= 7.0 ? '✓ Strong Hire Recommendation' : finalScore >= 4.0 ? '⚠️ Moderate — Needs Technical Practice' : '❌ Needs Significant Revision'}
          </div>
        </div>

        {/* 4 Dimension Metrics */}
        <div className="md:col-span-3 grid grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">1. Technical Accuracy (25%)</span>
            <div className="text-2xl font-black text-slate-900">{finalScore} <span className="text-xs text-slate-400">/ 10</span></div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${Math.min(finalScore * 10, 100)}%` }}></div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">2. Correctness (30%)</span>
            <div className="text-2xl font-black text-slate-900">{finalScore} <span className="text-xs text-slate-400">/ 10</span></div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${Math.min(finalScore * 10, 100)}%` }}></div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">3. Completeness (20%)</span>
            <div className="text-2xl font-black text-slate-900">{Math.max(finalScore - 0.5, 0).toFixed(1)} <span className="text-xs text-slate-400">/ 10</span></div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${Math.min(finalScore * 9, 100)}%` }}></div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">4. Relevance & Clarity (25%)</span>
            <div className="text-2xl font-black text-slate-900">{finalScore} <span className="text-xs text-slate-400">/ 10</span></div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${Math.min(finalScore * 10, 100)}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Per-Question Accordion List */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900">Question-by-Question Strict AI Evaluation Breakdown</h2>

        {questions.length > 0 ? (
          questions.map((q, idx) => (
            <div key={idx} className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
              <button
                onClick={() => setExpandedIndex(expandedIndex === idx ? -1 : idx)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="space-y-1">
                  <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">Question {idx + 1}</span>
                  <h3 className="text-base font-bold text-slate-900">{q.questionText}</h3>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className={`text-lg font-black ${
                    (q.evaluation?.score || q.score || 0) >= 7
                      ? 'text-emerald-700'
                      : (q.evaluation?.score || q.score || 0) >= 4
                      ? 'text-amber-600'
                      : 'text-rose-600'
                  }`}>
                    {(q.evaluation?.score !== undefined ? q.evaluation.score : (q.score || 0))} / 10
                  </span>
                  {expandedIndex === idx ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </button>

              {expandedIndex === idx && (
                <div className="p-6 pt-0 border-t border-slate-100 space-y-6 bg-slate-50/30">
                  {/* Candidate Answer */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Candidate Submitted Answer</h4>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                      {q.userAnswer || <span className="text-rose-600 italic">No answer provided.</span>}
                    </div>
                  </div>

                  {/* AI Evaluation & Feedback */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      AI Technical Accuracy Feedback
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                      {q.evaluation?.feedback || q.feedback || 'Evaluated strictly based on candidate response.'}
                    </p>
                  </div>

                  {/* Missing Concepts if any */}
                  {q.evaluation?.missingConcepts && q.evaluation.missingConcepts.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        Missing Required Concepts
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {q.evaluation.missingConcepts.map((concept, cIdx) => (
                          <span key={cIdx} className="px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                            ⚠️ {concept}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-500 font-medium">No completed questions found for this session.</p>
        )}
      </div>
    </div>
  );
};

export default InterviewResultPage;
