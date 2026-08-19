import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Trophy,
  Target,
  CheckCircle2,
  TrendingUp,
  Zap,
  PlayCircle,
  FileText,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { getAnalyticsOverviewApi, getInterviewHistoryApi } from '../services/api';

const DashboardPage = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [analyticsRes, historyRes] = await Promise.all([
          getAnalyticsOverviewApi().catch(() => null),
          getInterviewHistoryApi().catch(() => null),
        ]);

        if (analyticsRes?.success) {
          setAnalytics(analyticsRes.analytics);
        }
        if (historyRes?.success) {
          setHistory(historyRes.history || []);
        }
      } catch (err) {
        console.error('Fetch dashboard data error:', err);
      } font: {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const totalInterviews = analytics?.totalInterviews || history.length || 0;
  const avgScore = analytics?.avgScore || 0;
  const weakAreas = analytics?.weakAreas || [];
  const strongAreas = analytics?.strongAreas || (user?.skills || []).slice(0, 5);

  const stats = [
    { label: 'Overall Score', value: totalInterviews > 0 ? `${avgScore} / 10` : 'N/A', icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200/80' },
    { label: 'Interviews Completed', value: `${totalInterviews}`, icon: Target, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200/80' },
    { label: 'Questions Answered', value: `${totalInterviews * 5}`, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200/80' },
    { label: 'Avg Accuracy', value: totalInterviews > 0 ? `${Math.round(avgScore * 10)}%` : '0%', icon: TrendingUp, color: 'text-teal-600', bg: 'bg-teal-50 border-teal-200/80' },
    { label: 'Current Streak', value: totalInterviews > 0 ? '4 Days' : '0 Days', icon: Zap, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200/80' },
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-10 xl:px-12 w-full max-w-[1720px] mx-auto space-y-8 bg-white min-h-[calc(100vh-4rem)]">
      {/* Welcome Banner */}
      <div className="bg-emerald-50/50 p-6 sm:p-8 rounded-3xl border border-emerald-100 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 relative z-10">
          <div className="mint-pill">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Target Role: {user?.targetRole || 'Software Engineer'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Welcome back, {user?.name || 'Candidate'} 👋
          </h1>
          <p className="text-sm text-slate-600 max-w-xl font-medium">
            {totalInterviews > 0
              ? `You've completed ${totalInterviews} mock interview(s) so far. Let's keep your streak going today!`
              : 'You have not completed any mock interviews yet. Start your first mock interview today!'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10 w-full md:w-auto">
          <Link
            to="/interview-setup"
            className="emerald-button flex-1 sm:flex-none px-5 py-3 text-sm"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Start Mock Interview</span>
          </Link>
          <Link
            to="/resume"
            className="emerald-outline-button flex-1 sm:flex-none px-4 py-3 text-sm"
          >
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>Upload Resume</span>
          </Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`p-5 rounded-2xl border ${stat.bg} shadow-xs space-y-3 bg-white`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-black text-slate-900">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Performance & Weak Areas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weak Areas */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-bold text-slate-900">Detected Weak Areas</h3>
            </div>
            <Link to="/improvement-plan" className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1">
              View Plan <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {weakAreas.length > 0 ? (
            <div className="space-y-4">
              {weakAreas.map((area, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{area.topic || area.name}</span>
                    <span className="text-amber-600 font-bold">{area.score || 48}% score</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${area.score || 48}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 font-medium">Complete mock interviews to detect technical weak areas.</p>
          )}

          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Strong Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {strongAreas.length > 0 ? (
                strongAreas.map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-md bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold">
                    ✓ {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">Upload resume to list strong skills</span>
              )}
            </div>
          </div>
        </div>

        {/* Recent Interview Sessions */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-700" />
              <h3 className="text-lg font-bold text-slate-900">Recent Mock Interviews</h3>
            </div>
            <Link to="/analytics" className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1">
              Full Analytics <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg font-bold">Role & Company</th>
                    <th className="px-4 py-3 font-bold">Type</th>
                    <th className="px-4 py-3 font-bold">Difficulty</th>
                    <th className="px-4 py-3 font-bold">Score</th>
                    <th className="px-4 py-3 rounded-r-lg font-bold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900">{item.role}</div>
                        <div className="text-xs text-emerald-700 font-semibold">{item.company}</div>
                      </td>
                      <td className="px-4 py-3.5 text-xs font-medium text-slate-600">{item.interviewType}</td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100/80 text-emerald-800 border border-emerald-200">
                          {item.difficulty}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-black text-emerald-700">{item.finalScore || 0} / 10</td>
                      <td className="px-4 py-3.5 text-xs text-slate-500 font-medium">{new Date(item.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 space-y-3">
              <PlayCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-slate-900">No mock interviews completed yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">Start your first AI mock interview session to get scored feedback and performance analytics.</p>
              <Link to="/interview-setup" className="emerald-button text-xs inline-flex px-5 py-2.5">
                Start First Mock Interview
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
