import React, { useState } from 'react';
import { Lock, User, AlertCircle, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../../api/api';

export const AdminLoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);

    try {
      const data = await api.login(username.trim(), password);
      if (!data.success) {
        throw new Error(data.message || 'Invalid username or password.');
      }
      onLoginSuccess(data.user);
      setUsername('');
      setPassword('');
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-md glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 shadow-glass">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-navy-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent-blue to-accent-cyan p-[2px] mx-auto mb-3 shadow-glow-sm">
            <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center text-cyan-400">
              <Lock className="w-6 h-6" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h2>
          <p className="text-xs text-slate-400 mt-1">
            Authenticate to manage channels, submissions, and directories.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-950/80 border border-red-500/30 text-red-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* Login Form (Never prefilled) */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full px-4 py-2.5 pl-10 rounded-xl glass-input text-sm text-white placeholder-slate-500 transition-all"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-2.5 pl-10 rounded-xl glass-input text-sm text-white placeholder-slate-500 transition-all"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan hover:opacity-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-glow-sm hover:shadow-glow-md disabled:opacity-50 transition-all active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

