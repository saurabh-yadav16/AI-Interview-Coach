import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#070a11] text-slate-400 py-12">
      <div className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 p-0.5 shadow-md shadow-violet-500/20">
                <img
                  src="/logo.png"
                  alt="AI Interview Coach Logo"
                  className="w-full h-full object-contain rounded-full bg-[#0b0f19]"
                />
              </div>
              <span className="text-lg font-black text-white">AI <span className="gradient-text">Interview Coach</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Your personal AI-powered interview coach that understands your resume, adapts to your target job role, and guides you to career success.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs font-bold">
              <li><a href="#features" className="hover:text-cyan-400 transition-colors">AI Mock Interviews</a></li>
              <li><a href="#how-it-works" className="hover:text-cyan-400 transition-colors">Resume ATS Analyzer</a></li>
              <li><a href="#roles" className="hover:text-cyan-400 transition-colors">Role-based Questions</a></li>
              <li><a href="#analytics" className="hover:text-cyan-400 transition-colors">Performance Analytics</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4">Supported Roles</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-400">
              <li><span>Software & Full Stack Developer</span></li>
              <li><span>AI / Machine Learning Engineer</span></li>
              <li><span>Data Scientist & Analyst</span></li>
              <li><span>DevOps & Cloud Engineer</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4">Security & Tech</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3 font-medium">
              Built with MERN Stack, Express Security, JWT Auth, and state-of-the-art LLM Structured Evaluation.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-xs font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              AI Engine Online
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 font-bold gap-4">
          <p>© {new Date().getFullYear()} AI Interview Coach. Production Ready Enterprise Architecture.</p>
          <p className="flex items-center gap-1 font-bold">
            Engineered with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for job seekers worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
