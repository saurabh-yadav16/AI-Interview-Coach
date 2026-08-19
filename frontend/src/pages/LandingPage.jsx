import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, CheckCircle2, FileText, Sparkles, Award, Star, TrendingUp, Cpu, ShieldCheck, Zap, Layers, Briefcase, Check, HelpCircle } from 'lucide-react';

const LandingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleRoleClick = (roleName) => {
    if (isAuthenticated) {
      navigate('/interview-setup', { state: { selectedRole: roleName } });
    } else {
      navigate(`/register?role=${encodeURIComponent(roleName)}`);
    }
  };

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const elem = document.getElementById(targetId);
      if (elem) {
        setTimeout(() => {
          elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="relative overflow-hidden bg-white min-h-screen">
      {/* Background Soft Mesh Glows */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-50/70 blur-[150px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-teal-50/60 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-10 xl:px-12 max-w-[1720px] w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: ClearRound Style Copy & Action */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              CLEAR EVERY ROUND.
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Practise AI Mock Interviews <br />
              <span className="font-serif italic text-emerald-700 font-bold">Built for Success</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-medium">
              AI Interview Coach reads your resume and target job role, then drills you on what top companies actually ask—so the real interview feels completely familiar.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/register"
                className="emerald-button text-base px-7 py-4"
              >
                <span>Start a mock interview free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/resume"
                className="emerald-outline-button text-base px-6 py-4"
              >
                <span>Upload Resume & JD</span>
              </Link>
            </div>

            <p className="text-xs text-slate-400 font-medium pt-2">
              No credit card required · Built for job seekers · Every answer scored on 5 weighted dimensions
            </p>
          </div>

          {/* Right Column: Floating Interactive Mockup Card */}
          <div className="lg:col-span-5 relative">
            <div className="glass-panel bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xl shadow-emerald-900/10 relative z-10 space-y-6">
              
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 pb-2 border-b border-slate-100">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <Cpu className="w-4 h-4 text-emerald-600" />
                  interview · live
                </span>
                <span className="flex items-center gap-1 text-emerald-600 font-extrabold uppercase">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  REC
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-emerald-50/40 border border-emerald-100 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Overall Score</span>
                  <span className="text-xs font-bold text-slate-400">5 dimensions</span>
                </div>
                <div className="text-4xl sm:text-5xl font-black text-slate-900">
                  8.2 <span className="text-xl text-slate-400 font-bold">/ 10</span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="px-3 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                    STRONG • depth
                  </span>
                  <span className="px-3 py-1 rounded-md bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-200">
                    IMPROVE • structure
                  </span>
                  <span className="px-3 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                    STRONG • relevance
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -left-6 z-20 bg-white p-3.5 px-4 rounded-2xl border border-slate-200 shadow-lg text-left space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                ₹ SALARY BAND
              </span>
              <span className="text-sm font-black text-slate-900">
                ₹28–42 <span className="text-xs font-bold text-slate-500">LPA</span>
              </span>
            </div>

            <div className="absolute -bottom-6 -right-4 z-20 bg-white p-3.5 px-4 rounded-2xl border border-slate-200 shadow-lg text-left space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <FileText className="w-3 h-3 text-emerald-600" /> RESUME SCORE
              </span>
              <span className="text-xl font-black text-emerald-700">
                87%
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 1. Features Section */}
      <section id="features" className="py-20 bg-slate-50/60 border-t border-slate-200/80 scroll-mt-20">
        <div className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
          <div className="text-center mb-14">
            <div className="mint-pill mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Core Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Evaluated on 5 Weighted Dimensions
            </h2>
            <p className="text-slate-600 max-w-lg mx-auto text-sm mt-2 font-medium">
              Get objective AI feedback identical to how top tech interviewers grade candidates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                01
              </div>
              <h3 className="text-xl font-bold text-slate-900">Technical Depth & Accuracy</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                Checks core concepts, edge cases, system trade-offs, and programming correctness.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                02
              </div>
              <h3 className="text-xl font-bold text-slate-900">STAR Communication</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                Evaluates clarity, structure, conciseness, and story framing for behavioral questions.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                03
              </div>
              <h3 className="text-xl font-bold text-slate-900">Personalized 7-Day Roadmap</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                Auto-generates daily practice recommendations focused on your specific weak areas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-t border-slate-200/80 scroll-mt-20">
        <div className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
          <div className="text-center mb-16">
            <div className="mint-pill mb-2">
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              <span>Step-by-Step</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              How AI Interview Coach Works
            </h2>
            <p className="text-slate-600 max-w-lg mx-auto text-sm mt-2 font-medium">
              3 simple steps to master technical interviews and land your dream job.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="bg-emerald-50/40 p-8 rounded-3xl border border-emerald-100 space-y-4 text-left">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-sm">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900">Upload Resume & Target Role</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                Our parser extracts your skills, experience, and project history to tailor questions to your profile.
              </p>
            </div>

            <div className="bg-emerald-50/40 p-8 rounded-3xl border border-emerald-100 space-y-4 text-left">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-sm">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900">Live AI Mock Session</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                Answer domain-specific questions in real-time. Questions adapt dynamically to your answers.
              </p>
            </div>

            <div className="bg-emerald-50/40 p-8 rounded-3xl border border-emerald-100 space-y-4 text-left">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-sm">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900">Scoring & 7-Day Plan</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                Receive instant rubric evaluation, ideal answer comparisons, and a targeted study plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Supported Roles Section */}
      <section id="roles" className="py-20 bg-slate-50/60 border-t border-slate-200/80 scroll-mt-20">
        <div className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
          <div className="text-center mb-14">
            <div className="mint-pill mb-2">
              <Briefcase className="w-3.5 h-3.5 text-emerald-700" />
              <span>Tailored Preparation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Supported Tech Roles
            </h2>
            <p className="text-slate-600 max-w-lg mx-auto text-sm mt-2 font-medium">
              Domain-specific question banks for top engineering tracks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
            {[
              { name: 'Java Developer', desc: 'JVM, Spring Boot, Threads' },
              { name: 'Full Stack Engineer', desc: 'React, Node.js, REST APIs' },
              { name: 'React Frontend', desc: 'Hooks, State, Performance' },
              { name: 'Node.js Backend', desc: 'Event Loop, Async, DBs' },
              { name: 'QA & SDET', desc: 'Automation, APIs, Security' },
              { name: 'DevOps Specialist', desc: 'Docker, K8s, CI/CD' },
            ].map((roleItem, idx) => (
              <button
                key={idx}
                onClick={() => handleRoleClick(roleItem.name)}
                className="bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-emerald-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-left space-y-3 group cursor-pointer w-full relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {roleItem.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    {roleItem.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Pricing Section */}
      <section id="pricing" className="py-20 bg-white border-t border-slate-200/80 scroll-mt-20">
        <div className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
          <div className="text-center mb-16">
            <div className="mint-pill mb-2">
              <Award className="w-3.5 h-3.5 text-emerald-700" />
              <span>Transparent Plans</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Simple Free & Pro Plans
            </h2>
            <p className="text-slate-600 max-w-lg mx-auto text-sm mt-2 font-medium">
              Start free today and upgrade as you prepare for major company interviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-left">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Starter</span>
                <h3 className="text-2xl font-black text-slate-900">Free Practice</h3>
                <div className="text-4xl font-black text-slate-900 mt-2">
                  ₹0 <span className="text-xs font-bold text-slate-400">/ forever</span>
                </div>
              </div>

              <ul className="space-y-3 text-sm text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Unlimited AI Mock Interviews</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Resume Parsing & ATS Scoring</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>5-Dimension Rubric Feedback</span>
                </li>
              </ul>

              <Link to="/register" className="emerald-outline-button w-full text-center">
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-emerald-900 text-white p-8 rounded-3xl border border-emerald-800 shadow-xl space-y-6 text-left relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-emerald-700 text-emerald-100 text-[10px] font-black uppercase px-3 py-1 rounded-full">
                Popular
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">Pro Candidate</span>
                <h3 className="text-2xl font-black text-white">FAANG Master Plan</h3>
                <div className="text-4xl font-black text-white mt-2">
                  ₹999 <span className="text-xs font-bold text-emerald-300">/ month</span>
                </div>
              </div>

              <ul className="space-y-3 text-sm text-emerald-100 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Everything in Free Plan</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Personalized 7-Day Study Challenges</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>24/7 AI Tutor Voice & Code Assistant</span>
                </li>
              </ul>

              <Link to="/register" className="emerald-button w-full text-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black">
                Upgrade to Pro Plan
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
