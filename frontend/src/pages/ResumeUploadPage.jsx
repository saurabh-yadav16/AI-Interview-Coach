import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { uploadResumeApi } from '../services/api';

const ResumeUploadPage = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
      ];

      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(pdf|docx|doc)$/i)) {
        setError('Invalid file type. Please upload a PDF or DOCX file.');
        setFile(null);
        return;
      }

      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit.');
        setFile(null);
        return;
      }

      setError('');
      setFile(selectedFile);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const res = await uploadResumeApi(formData);
      if (res.success) {
        // Store parsed resume result in session/local storage for analysis view
        localStorage.setItem('current_resume_analysis', JSON.stringify(res.resume));
        navigate('/resume-analysis');
      }
    } catch (err) {
      console.error('Resume upload error:', err);
      setError(err.message || 'Failed to upload resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 bg-white min-h-[calc(100vh-4rem)]">
      <div className="text-center space-y-2">
        <div className="mint-pill">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>Resume & ATS Analyzer Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Upload Your Resume</h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto font-medium">
          Multer-powered file parsing extracts your skills, projects, and experience to calculate your ATS score and personalize mock interview questions.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-sm font-bold max-w-2xl mx-auto">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-xl shadow-emerald-900/5 space-y-6 max-w-2xl mx-auto">
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-3xl p-8 text-center transition-colors cursor-pointer bg-emerald-50/30 hover:bg-emerald-50/60">
            <input
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={handleFileChange}
              className="hidden"
              id="resume-file-input"
            />
            <label htmlFor="resume-file-input" className="cursor-pointer block space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100/80 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-700 shadow-sm">
                <Upload className="w-8 h-8" />
              </div>
              {file ? (
                <div className="space-y-1">
                  <p className="text-sm font-extrabold text-emerald-700 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-500 font-bold">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-500 font-medium">Supports PDF or DOCX (Max 10MB)</p>
                </div>
              )}
            </label>
          </div>

          <button
            type="submit"
            disabled={!file || isUploading}
            className="emerald-button w-full text-sm font-bold py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <span>Parsing Resume & Calculating ATS Score...</span>
            ) : (
              <>
                <span>Upload & Extract Resume Skills</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResumeUploadPage;
