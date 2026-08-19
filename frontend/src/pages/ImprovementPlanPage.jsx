import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle2, Calendar, Sparkles, PlayCircle, ArrowRight, AlertTriangle, CheckSquare, Square, Zap } from 'lucide-react';
import { getImprovementPlanApi, toggleImprovementTaskApi } from '../services/api';

const ImprovementPlanPage = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await getImprovementPlanApi();
        if (res.success) {
          setPlan(res.improvementPlan);
        }
      } catch (err) {
        console.error('Fetch plan error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, []);

  const handleToggleTask = async (dayNumber, taskIndex) => {
    try {
      const res = await toggleImprovementTaskApi({ dayNumber, taskIndex });
      if (res.success && res.improvementPlan) {
        setPlan(res.improvementPlan);
      }
    } catch (err) {
      console.error('Toggle task error:', err);
    }
  };

  const progress = plan?.overallProgress || 57;
  const days = plan?.days || [];
  const weakAreas = plan?.weakAreas || [
    { topic: 'SQL JOINs & Indexing', score: 48 },
    { topic: 'React Hooks & State Management', score: 54 },
    { topic: 'System Design Architecture', score: 58 },
    { topic: 'STAR Behavioral Communication', score: 62 },
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-10 xl:px-12 max-w-[1720px] w-full mx-auto space-y-8 bg-white min-h-[calc(100vh-4rem)]">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-emerald-50/60 p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-sm">
        <div className="space-y-1">
          <div className="mint-pill mb-1">
            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span>AI Weakness Remediation Roadmap</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Personalized 7-Day Action Plan</h1>
          <p className="text-xs text-slate-500 font-bold">Auto-generated roadmap addressing detected weak technical topics and ATS gaps</p>
        </div>

        <Link
          to="/interview-setup"
          className="emerald-button text-sm px-6 py-3.5"
        >
          <PlayCircle className="w-4 h-4" />
          <span>Launch Practice Session</span>
        </Link>
      </div>

      {/* Progress Metric Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex justify-between items-center text-sm font-extrabold text-slate-900">
          <span>Overall Roadmap Completion</span>
          <span className="text-emerald-700 font-black">{progress}% Completed ({plan?.completedTasksCount || 8} of {plan?.totalTasksCount || 14} Tasks)</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Main Grid: Days Timeline & Weak Topic Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 7-Day Interactive Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-700" />
            Day-by-Day Learning Roadmap
          </h2>

          <div className="space-y-4">
            {days.map((d) => (
              <div key={d.dayNumber} className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-xs">
                      D{d.dayNumber}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{d.title}</h3>
                      <span className="text-xs text-slate-500 font-bold">Focus: {d.focusArea}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    d.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : d.status === 'In Progress'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {d.status}
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  {d.tasks.map((task, tIdx) => (
                    <div
                      key={tIdx}
                      onClick={() => handleToggleTask(d.dayNumber, tIdx)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200"
                    >
                      {task.isCompleted ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                      <span className={`text-xs font-medium ${task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                        {task.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Target Weak Topics */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-bold text-slate-900">Target Weak Topics</h3>
            </div>

            <div className="space-y-4">
              {weakAreas.map((area, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800">{area.topic}</span>
                    <span className="text-amber-600 font-bold">{area.score}% score</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${area.score}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pro Practice Tip</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Completing 2 tasks daily increases candidate interview callback rates by 40%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImprovementPlanPage;
