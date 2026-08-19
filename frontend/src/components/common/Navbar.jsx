import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, FileText, PlayCircle, BarChart3, BookOpen, Bot, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSectionClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      const elem = document.getElementById(sectionId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 border-b border-slate-200/80 backdrop-blur-md shadow-xs">
      <div className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo - Left Aligned */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl shadow-md shadow-slate-950/20 group-hover:scale-105 transition-transform flex items-center justify-center shrink-0 overflow-hidden bg-slate-950">
              <img
                src="/logo.png"
                alt="AI Interview Coach Logo"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
                AI Interview <span className="font-serif italic text-emerald-700 font-bold">Coach</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-200/70">
                .ai
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          {isAuthenticated ? (
            <div className="hidden lg:flex items-center justify-center gap-1.5 flex-1 max-w-4xl mx-auto">
              <Link
                to="/dashboard"
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                  isActive('/dashboard')
                    ? 'bg-emerald-100/90 text-emerald-900 border border-emerald-300/80 shadow-xs font-black'
                    : 'text-slate-700 hover:text-emerald-800 hover:bg-slate-100/80'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/resume"
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                  isActive('/resume') || isActive('/resume-analysis')
                    ? 'bg-emerald-100/90 text-emerald-900 border border-emerald-300/80 shadow-xs font-black'
                    : 'text-slate-700 hover:text-emerald-800 hover:bg-slate-100/80'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Resume AI</span>
              </Link>

              <Link
                to="/interview-setup"
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                  isActive('/interview-setup') || isActive('/interview-room')
                    ? 'bg-emerald-100/90 text-emerald-900 border border-emerald-300/80 shadow-xs font-black'
                    : 'text-slate-700 hover:text-emerald-800 hover:bg-slate-100/80'
                }`}
              >
                <PlayCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Mock Interview</span>
              </Link>

              <Link
                to="/analytics"
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                  isActive('/analytics')
                    ? 'bg-emerald-100/90 text-emerald-900 border border-emerald-300/80 shadow-xs font-black'
                    : 'text-slate-700 hover:text-emerald-800 hover:bg-slate-100/80'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Analytics</span>
              </Link>

              <Link
                to="/improvement-plan"
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                  isActive('/improvement-plan')
                    ? 'bg-emerald-100/90 text-emerald-900 border border-emerald-300/80 shadow-xs font-black'
                    : 'text-slate-700 hover:text-emerald-800 hover:bg-slate-100/80'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>7-Day Plan</span>
              </Link>

              <Link
                to="/ai-assistant"
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                  isActive('/ai-assistant')
                    ? 'bg-emerald-100/90 text-emerald-900 border border-emerald-300/80 shadow-xs font-black'
                    : 'text-slate-700 hover:text-emerald-800 hover:bg-slate-100/80'
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>AI Tutor</span>
              </Link>
            </div>
          ) : (
            <div className="hidden lg:flex items-center space-x-8 shrink-0 text-sm font-semibold text-slate-700">
              <button
                onClick={() => handleSectionClick('features')}
                className="hover:text-emerald-700 transition-colors text-left"
              >
                Features
              </button>
              <button
                onClick={() => handleSectionClick('how-it-works')}
                className="hover:text-emerald-700 transition-colors text-left"
              >
                How it Works
              </button>
              <button
                onClick={() => handleSectionClick('roles')}
                className="hover:text-emerald-700 transition-colors text-left"
              >
                Roles
              </button>
              <button
                onClick={() => handleSectionClick('pricing')}
                className="hover:text-emerald-700 transition-colors text-left"
              >
                Pricing
              </button>
            </div>
          )}

          {/* Right User Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 bg-emerald-50/90 border border-emerald-200/90 px-3.5 py-1.5 rounded-full shadow-xs">
                <div className="flex flex-col text-right whitespace-nowrap">
                  <span className="text-xs font-black text-slate-900 leading-tight">{user?.name || 'Saurabh'}</span>
                  <span className="text-[11px] font-bold text-emerald-700 leading-tight">{user?.targetRole || 'Software Engineer'}</span>
                </div>
                <div className="h-4 w-px bg-emerald-200 mx-0.5"></div>
                <button
                  onClick={handleLogout}
                  className="p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-emerald-700 transition-colors px-3 py-1.5"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-[#047857] hover:bg-[#065f46] text-white text-xs font-bold rounded-full px-4 py-2 shadow-sm shadow-emerald-700/20 transition-all transform hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Down Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2 shadow-lg">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold ${
                  isActive('/dashboard') ? 'bg-emerald-100/90 text-emerald-900' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                Dashboard
              </Link>
              <Link
                to="/resume"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold ${
                  isActive('/resume') || isActive('/resume-analysis') ? 'bg-emerald-100/90 text-emerald-900' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-4 h-4 text-emerald-700" />
                Resume AI
              </Link>
              <Link
                to="/interview-setup"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold ${
                  isActive('/interview-setup') || isActive('/interview-room') ? 'bg-emerald-100/90 text-emerald-900' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <PlayCircle className="w-4 h-4 text-emerald-700" />
                Mock Interview
              </Link>
              <Link
                to="/analytics"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold ${
                  isActive('/analytics') ? 'bg-emerald-100/90 text-emerald-900' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-emerald-700" />
                Analytics
              </Link>
              <Link
                to="/improvement-plan"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold ${
                  isActive('/improvement-plan') ? 'bg-emerald-100/90 text-emerald-900' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <BookOpen className="w-4 h-4 text-emerald-700" />
                7-Day Plan
              </Link>
              <Link
                to="/ai-assistant"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold ${
                  isActive('/ai-assistant') ? 'bg-emerald-100/90 text-emerald-900' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Bot className="w-4 h-4 text-emerald-700" />
                AI Tutor
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() => handleSectionClick('features')}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Features
              </button>
              <button
                onClick={() => handleSectionClick('how-it-works')}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                How it Works
              </button>
              <button
                onClick={() => handleSectionClick('roles')}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Roles
              </button>
              <button
                onClick={() => handleSectionClick('pricing')}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Pricing
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
