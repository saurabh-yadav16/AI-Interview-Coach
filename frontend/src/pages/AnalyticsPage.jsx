import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { BarChart3, TrendingUp, Target, AlertTriangle, CheckCircle2, Sparkles, BookOpen, ArrowUpRight, Trophy, PlayCircle } from 'lucide-react';
import { getAnalyticsOverviewApi } from '../services/api';

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getAnalyticsOverviewApi();
        if (res.success) {
          setData(res.analytics);
        }
      } catch (err) {
        console.error('Fetch analytics error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const totalInterviews = data?.totalInterviews || 0;
  const avgScore = data?.avgScore || 0;
  const hasData = totalInterviews > 0;

  const radarMetrics = data?.radarMetrics || [];
  const scoreTrend = data?.scoreTrend || [];
  const categoryBreakdown = data?.categoryBreakdown || [];
  const weakAreas = data?.weakAreas || [];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-10 xl:px-12 w-full max-w-[1720px] mx-auto space-y-8 bg-white min-h-[calc(100vh-4rem)]">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-emerald-50/60 p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-sm">
        <div className="space-y-1">
          <div className="mint-pill mb-1">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Real Database Performance Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Analytics & Skill Metrics</h1>
          <p className="text-xs text-slate-500 font-bold">5-Dimension Radar, Historical Trends, and Weak Topic Highlights</p>
        </div>

        <Link
          to="/interview-setup"
          className="emerald-button text-sm px-6 py-3.5"
        >
          <PlayCircle className="w-4 h-4" />
          <span>Start New Interview</span>
        </Link>
      </div>

      {/* Top Stat Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Average</span>
          <div className="text-3xl font-black text-emerald-700">{hasData ? avgScore : 'N/A'} {hasData && <span className="text-sm text-slate-400 font-bold">/ 10</span>}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Sessions</span>
          <div className="text-3xl font-black text-slate-900">{totalInterviews}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Accuracy Rate</span>
          <div className="text-3xl font-black text-teal-600">{hasData ? `${Math.round(avgScore * 10)}%` : '0%'}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Session Status</span>
          <div className="text-3xl font-black text-emerald-600">{hasData ? 'Active' : 'No Sessions'}</div>
        </div>
      </div>

      {/* Recharts Data Visualization Grid or Empty State */}
      {hasData ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Radar Chart: 5 Dimensions */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-700" />
                5-Dimension Competency Radar
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={radarMetrics}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#334155', fontSize: 12, fontWeight: 700 }} />
                    <Radar name="Score" dataKey="score" stroke="#047857" fill="#047857" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Area Chart: Score Progress Trend */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-700" />
                Historical Score Trend
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={scoreTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis domain={[0, 10]} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="score" stroke="#047857" fill="#dcfce7" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Category Bar Chart & Weak Areas Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Score by Interview Category</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="category" tick={{ fill: '#334155', fontSize: 11, fontWeight: 700 }} />
                    <YAxis domain={[0, 10]} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="avgScore" fill="#047857" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-bold text-slate-900">Detected Weak Topics</h3>
                </div>
              </div>

              <div className="space-y-4">
                {weakAreas.map((area, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800">{area.topic}</span>
                      <span className="text-amber-600 font-bold">{area.score}% accuracy</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${area.score}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/90 text-center space-y-4 shadow-sm">
          <BarChart3 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-lg font-extrabold text-slate-900">No Interview Analytics Data Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">Complete mock interviews to generate real performance intelligence, 5-dimension radar charts, and score progress trends.</p>
          <Link to="/interview-setup" className="emerald-button text-xs inline-flex px-6 py-3">
            Start Mock Interview
          </Link>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
