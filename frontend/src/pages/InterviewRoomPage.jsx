import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Send, Clock, Sparkles, CheckCircle2, ArrowRight, Bot, Volume2, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { submitAnswerApi, getInterviewByIdApi } from '../services/api';

const InterviewRoomPage = () => {
  const storedSession = localStorage.getItem('active_interview_session');
  const [session, setSession] = useState(storedSession ? JSON.parse(storedSession) : null);
  const [answer, setAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(180); // 3 minutes per question
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const recognitionRef = useRef(null);

  const interviewId = session?._id || session?.id;

  // Refresh Recovery (F5): Restore session state from database backend
  useEffect(() => {
    if (!interviewId) return;

    const restoreSession = async () => {
      try {
        const res = await getInterviewByIdApi(interviewId);
        if (res.success && res.interview) {
          setSession(res.interview);
          localStorage.setItem('active_interview_session', JSON.stringify(res.interview));

          if (res.interview.status === 'completed' || res.interview.currentQuestionIndex >= res.interview.totalQuestionsCount) {
            localStorage.setItem('completed_interview_result', JSON.stringify(res.interview));
            navigate('/interview-result');
          }
        }
      } catch (err) {
        console.error('Restore session error:', err);
      }
    };

    restoreSession();
  }, [interviewId, navigate]);

  const currentIdx = session?.currentQuestionIndex || 0;
  const totalQuestions = session?.totalQuestionsCount || 5;
  const currentQuestion = session?.questions?.[currentIdx] || {
    questionId: 'q_1',
    questionText: '[Technical Round] Walk me through how JWT authentication works end-to-end between a React frontend and Express backend.',
    category: 'Technical Architecture',
  };

  // Setup Speech-to-Text Recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setAnswer((prev) => (prev ? prev + ' ' + transcript : transcript));
      };

      recognitionRef.current.onerror = (err) => {
        console.error('Speech recognition error:', err);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Per-Question Countdown Timer
  useEffect(() => {
    setTimerSeconds(180);
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIdx]);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your answer.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSubmitAnswer = async (e) => {
    if (e) e.preventDefault();
    if (!answer.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    const targetId = session?._id || session?.id || 'int_demo';

    try {
      const res = await submitAnswerApi(targetId, {
        questionId: currentQuestion?.questionId,
        questionIndex: currentIdx,
        userAnswer: answer,
      });

      if (res.success) {
        setAnswer('');
        if (isListening && recognitionRef.current) {
          recognitionRef.current.stop();
          setIsListening(false);
        }

        if (res.isCompleted) {
          localStorage.setItem('completed_interview_result', JSON.stringify(res.interview));
          navigate('/interview-result');
        } else {
          setSession(res.interview);
          localStorage.setItem('active_interview_session', JSON.stringify(res.interview));
        }
      }
    } catch (err) {
      console.error('Submit answer error:', err);
      setError(err.message || 'Evaluation failed. Please try again.');
    } font: {
      setIsSubmitting(false);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6 bg-white min-h-[calc(100vh-4rem)]">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-emerald-50/60 p-4 sm:p-6 rounded-3xl border border-emerald-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-700 flex items-center justify-center text-white font-black text-sm shadow-md">
            AI
          </div>
          <div>
            <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider block">
              {session?.company || 'Google'} • {session?.role || 'Full Stack Developer'} ({session?.difficulty || 'Medium'})
            </span>
            <h2 className="text-sm font-black text-slate-900">
              Question {currentIdx + 1} of {totalQuestions}
            </h2>
          </div>
        </div>

        {/* Live Timer & Audio Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-emerald-200 text-slate-700 text-xs font-bold shadow-xs">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>Time Left: {formatTime(timerSeconds)}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-extrabold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
            LIVE
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-between gap-3 text-red-700 text-sm font-bold">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={handleSubmitAnswer}
            disabled={isSubmitting}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Evaluation</span>
          </button>
        </div>
      )}

      {/* Main Question Display Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xl shadow-emerald-900/5 space-y-6 relative">
        {/* Loading Overlay */}
        {isSubmitting && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-xs rounded-3xl flex flex-col items-center justify-center gap-3 z-20">
            <div className="w-10 h-10 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-extrabold text-slate-900">Evaluating answer & generating unique next question...</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold">
            Category: {currentQuestion?.category || 'Technical Architecture'}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
          {currentQuestion?.questionText}
        </h1>

        {/* Answer Text Area & Voice Input Controls */}
        <form onSubmit={handleSubmitAnswer} className="space-y-4 pt-4 border-t border-slate-100">
          <div className="relative">
            <textarea
              rows={6}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here or click the Microphone button below to speak out loud..."
              className="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white resize-none"
            />
            <div className="absolute bottom-3 right-3 text-xs font-bold text-slate-400">
              {answer.length} characters
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={toggleMic}
              className={`px-5 py-3 rounded-full text-xs font-extrabold flex items-center gap-2 transition-all ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <span>Listening... (Click to Stop)</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 text-emerald-700" />
                  <span>Answer Out Loud (Voice STT)</span>
                </>
              )}
            </button>

            <button
              type="submit"
              disabled={!answer.trim() || isSubmitting}
              className="emerald-button text-sm font-bold px-8 py-3.5 w-full sm:w-auto disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Evaluating...' : currentIdx + 1 === totalQuestions ? 'Complete Interview Session' : 'Submit & Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewRoomPage;
