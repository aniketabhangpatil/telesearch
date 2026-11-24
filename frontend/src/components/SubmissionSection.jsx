import React, { useState } from 'react';
import { Send, Upload, CheckCircle2, AlertCircle, Sparkles, HelpCircle } from 'lucide-react';
import { TelegramIcon } from './Icons';
import { api } from '../api/api';

export const SubmissionSection = ({ categories = [], onSubmitSuccess, isModal = false, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    telegram_url: '',
    description: '',
    category_id: '',
    keywords: '',
    language: 'English'
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setError('Image file must be under 3MB.');
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validations
    if (!formData.name.trim()) {
      setError('Channel name is required.');
      return;
    }

    if (!formData.telegram_url.trim()) {
      setError('Telegram URL or @handle is required.');
      return;
    }

    if (!formData.description.trim() || formData.description.trim().length < 10) {
      setError('Description must be at least 10 characters long.');
      return;
    }

    if (!formData.category_id) {
      setError('Please select a category for your channel.');
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();
      payload.append('name', formData.name.trim());
      payload.append('telegram_url', formData.telegram_url.trim());
      payload.append('description', formData.description.trim());
      payload.append('category_id', formData.category_id);
      payload.append('keywords', formData.keywords.trim());
      payload.append('language', formData.language);
      if (logoFile) {
        payload.append('logo', logoFile);
      }

      const data = await api.submitChannel(payload);

      if (!data || !data.success) {
        throw new Error(data?.message || 'Submission failed. Please verify your details.');
      }

      setSuccess(data.message || 'Channel submitted successfully! Pending review.');
      setFormData({
        name: '',
        telegram_url: '',
        description: '',
        category_id: '',
        keywords: '',
        language: 'English'
      });
      setLogoFile(null);
      setLogoPreview('');

      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent-blue/10 border border-accent-cyan/30 text-xs font-semibold text-accent-neon mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>100% Free Public Submission</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
          List Your Telegram Channel
        </h2>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          No account or sign up required. Submit your channel to gain exposure across our relevance-ranked search directory.
        </p>
      </div>

      {/* Form Container */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/20 shadow-glass">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-500/30 text-red-200 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-200 text-sm flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Channel Submitted for Admin Review!</p>
              <p className="text-xs text-emerald-300/80">{success}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Channel Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Channel Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. AI Developers Hub"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500 transition-all"
              />
            </div>

            {/* Telegram URL or Handle */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Telegram Link or Handle *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.telegram_url}
                  onChange={(e) => setFormData({ ...formData, telegram_url: e.target.value })}
                  placeholder="https://t.me/aidevhub or @aidevhub"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500 transition-all pr-10"
                />
                <TelegramIcon className="w-4 h-4 text-cyan-400 absolute right-3.5 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Channel Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide a clear, engaging overview of what your community offers..."
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Primary Category *
              </label>
              <select
                required
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white bg-navy-900 transition-all"
              >
                <option value="">Select a category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Primary Language
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white bg-navy-900 transition-all"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="Hindi">Hindi</option>
                <option value="Russian">Russian</option>
                <option value="German">German</option>
                <option value="French">French</option>
                <option value="Portuguese">Portuguese</option>
                <option value="Chinese">Chinese</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Keywords & Tags <span className="text-slate-500 font-normal">(Comma-separated)</span>
            </label>
            <input
              type="text"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              placeholder="e.g. artificial intelligence, python, web development, coding"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500 transition-all"
            />
          </div>

          {/* Optional Logo Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Channel Logo / Icon <span className="text-slate-500 font-normal">(Optional, max 3MB)</span>
            </label>
            <div className="flex items-center gap-4">
              <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-cyan-500/30 hover:border-cyan-400 bg-navy-900/50 hover:bg-navy-850 text-slate-300 text-xs font-medium transition-all">
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>{logoFile ? logoFile.name : 'Choose image file (.png, .jpg, .svg)'}</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {logoPreview && (
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-cyan-500/40 flex-shrink-0">
                  <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan hover:opacity-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-glow-sm hover:shadow-glow-md disabled:opacity-50 transition-all active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting to Directory...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Channel For Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md overflow-y-auto">
        <div className="relative w-full max-w-2xl my-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-navy-900/80 text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
          {content}
        </div>
      </div>
    );
  }

  return (
    <section id="submit" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content}
      </div>
    </section>
  );
};

