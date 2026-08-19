import React from 'react';
import { ShieldCheck, Users, Activity, FileText, Sparkles } from 'lucide-react';

const AdminDashboardPage = () => {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-10 xl:px-12 max-w-[1720px] w-full mx-auto space-y-8 bg-white min-h-[calc(100vh-4rem)]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-sm">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">System Admin Control Center</h1>
          <p className="text-xs text-slate-500 font-bold">Platform analytics, system health, and candidate statistics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Registered Candidates</span>
          <div className="text-3xl font-black text-slate-900">1,482</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total AI Mock Interviews</span>
          <div className="text-3xl font-black text-emerald-700">8,920</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">System AI API Health</span>
          <div className="text-3xl font-black text-emerald-600">100% Operational</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
