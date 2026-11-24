import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Clock,
  ListFilter,
  Award,
  Sparkles,
  Settings,
  LogOut,
  Check,
  X,
  Trash2,
  Edit,
  ExternalLink,
  Plus,
  RefreshCw,
  Search,
  ArrowUp,
  ArrowDown,
  ShieldCheck,
  KeyRound
} from 'lucide-react';
import { api } from '../../api/api';
import { TelegramIcon } from '../Icons';

export const AdminDashboard = ({ isOpen, onClose, user, onLogout, showToast }) => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, submissions, channels, sponsored, featured, settings

  // State for Overview
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // State for Submissions
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [rejectModalId, setRejectModalId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // State for Channels Management
  const [channels, setChannels] = useState([]);
  const [channelStatusFilter, setChannelStatusFilter] = useState('all');
  const [channelSearch, setChannelSearch] = useState('');
  const [editingChannel, setEditingChannel] = useState(null);
  const [loadingChannels, setLoadingChannels] = useState(false);

  // State for Sponsored
  const [sponsoredList, setSponsoredList] = useState([]);
  const [loadingSponsored, setLoadingSponsored] = useState(false);
  const [addSponsoredModalOpen, setAddSponsoredModalOpen] = useState(false);
  const [selectedChannelIdForSponsored, setSelectedChannelIdForSponsored] = useState('');
  const [sponsoredBadge, setSponsoredBadge] = useState('Sponsored Partner');
  const [sponsoredNotes, setSponsoredNotes] = useState('');

  // State for Featured Orbit
  const [featuredList, setFeaturedList] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(false);

  // State for Settings
  const [settings, setSettings] = useState({
    sponsorship_email: '',
    developer_email: ''
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Load data based on tab
  useEffect(() => {
    if (isOpen) {
      if (activeTab === 'overview') loadStats();
      if (activeTab === 'submissions') loadSubmissions();
      if (activeTab === 'channels') loadChannels();
      if (activeTab === 'sponsored') loadSponsored();
      if (activeTab === 'featured') loadFeatured();
      if (activeTab === 'settings') loadSettings();
    }
  }, [isOpen, activeTab, channelStatusFilter]);

  if (!isOpen) return null;

  // Overview loader
  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const data = await api.getDashboardStats();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      showToast('Failed to load stats', 'error');
    } finally {
      setLoadingStats(false);
    }
  };

  // Submissions loader & actions
  const loadSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const data = await api.getPendingSubmissions(1, 50);
      if (data.success) {
        setSubmissions(data.submissions);
      }
    } catch (err) {
      showToast('Failed to load pending submissions', 'error');
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const data = await api.approveSubmission(id);
      if (data.success) {
        showToast('Channel approved and published!', 'success');
        loadSubmissions();
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Error approving channel', 'error');
    }
  };

  const handleReject = async () => {
    if (!rejectModalId) return;
    try {
      const data = await api.rejectSubmission(rejectModalId, rejectionReason);
      if (data.success) {
        showToast('Channel submission marked as rejected', 'success');
        setRejectModalId(null);
        setRejectionReason('');
        loadSubmissions();
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Error rejecting channel', 'error');
    }
  };

  // Channels loader & actions
  const loadChannels = async () => {
    setLoadingChannels(true);
    try {
      const data = await api.getAllChannels({
        status: channelStatusFilter,
        search: channelSearch,
        limit: 50
      });
      if (data.success) {
        setChannels(data.channels);
      }
    } catch (err) {
      showToast('Failed to load channels', 'error');
    } finally {
      setLoadingChannels(false);
    }
  };

  const handleDeleteChannel = async (id) => {
    if (!window.confirm('Are you sure you want to delete this channel? This action cannot be undone.')) return;
    try {
      const data = await api.deleteChannel(id);
      if (data.success) {
        showToast('Channel deleted successfully', 'success');
        loadChannels();
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Failed to delete channel', 'error');
    }
  };

  const handleSaveEditChannel = async (e) => {
    e.preventDefault();
    try {
      const data = await api.updateChannel(editingChannel.id, {
        name: editingChannel.name,
        telegram_url: editingChannel.telegram_url,
        description: editingChannel.description,
        category_id: editingChannel.category_id,
        keywords: editingChannel.keywords,
        language: editingChannel.language,
        status: editingChannel.status
      });
      if (data.success) {
        showToast('Channel details updated successfully', 'success');
        setEditingChannel(null);
        loadChannels();
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Error updating channel', 'error');
    }
  };

  // Sponsored loader & actions
  const loadSponsored = async () => {
    setLoadingSponsored(true);
    try {
      const data = await api.getSponsoredList();
      if (data.success) {
        setSponsoredList(data.sponsored);
      }
    } catch (err) {
      showToast('Failed to load sponsored channels', 'error');
    } finally {
      setLoadingSponsored(false);
    }
  };

  const handleAddSponsored = async (e) => {
    e.preventDefault();
    if (!selectedChannelIdForSponsored) {
      showToast('Please select a channel', 'error');
      return;
    }
    try {
      const data = await api.addSponsored(selectedChannelIdForSponsored, sponsoredBadge, sponsoredNotes);
      if (data.success) {
        showToast('Channel added to Top 100 Sponsored!', 'success');
        setAddSponsoredModalOpen(false);
        setSelectedChannelIdForSponsored('');
        loadSponsored();
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleRemoveSponsored = async (id) => {
    if (!window.confirm('Remove this channel from the Top 100 Sponsored directory?')) return;
    try {
      const data = await api.removeSponsored(id);
      if (data.success) {
        showToast('Removed from sponsored directory', 'success');
        loadSponsored();
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Error removing sponsored channel', 'error');
    }
  };

  const handleMoveSponsored = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sponsoredList.length) return;

    const newList = [...sponsoredList];
    const [moved] = newList.splice(index, 1);
    newList.splice(targetIndex, 0, moved);

    setSponsoredList(newList);
    const orderedIds = newList.map(item => item.id);
    try {
      await api.reorderSponsored(orderedIds);
      showToast('Sponsored order saved', 'success');
    } catch (err) {
      showToast('Failed to save order', 'error');
      loadSponsored();
    }
  };

  // Featured Orbit loader & actions
  const loadFeatured = async () => {
    setLoadingFeatured(true);
    try {
      const data = await api.getFeaturedList();
      if (data.success) {
        setFeaturedList(data.featured);
      }
    } catch (err) {
      showToast('Failed to load featured channels', 'error');
    } finally {
      setLoadingFeatured(false);
    }
  };

  const handleSetFeatured = async (sponsoredId) => {
    try {
      const data = await api.setFeatured(sponsoredId);
      if (data.success) {
        showToast('Channel added to Top 10 Featured Orbit!', 'success');
        loadFeatured();
        loadSponsored();
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Failed to set featured channel', 'error');
    }
  };

  const handleRemoveFeatured = async (sponsoredId) => {
    try {
      const data = await api.removeFeatured(sponsoredId);
      if (data.success) {
        showToast('Removed from Top 10 Featured Orbit', 'success');
        loadFeatured();
        loadSponsored();
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Failed to remove featured channel', 'error');
    }
  };

  const handleMoveFeatured = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= featuredList.length) return;

    const newList = [...featuredList];
    const [moved] = newList.splice(index, 1);
    newList.splice(targetIndex, 0, moved);

    setFeaturedList(newList);
    const orderedIds = newList.map(item => item.id);
    try {
      await api.reorderFeatured(orderedIds);
      showToast('Top 10 Featured order saved', 'success');
    } catch (err) {
      showToast('Failed to save featured order', 'error');
      loadFeatured();
    }
  };

  // Settings loader & actions
  const loadSettings = async () => {
    try {
      const data = await api.getAdminSettings();
      if (data.success) {
        setSettings({
          sponsorship_email: data.settings.sponsorship_email || 'silkroad2@gmail.com',
          developer_email: data.settings.developer_email || 'silkroad2.o@gmail.com'
        });
      }
    } catch (err) {
      showToast('Failed to load site settings', 'error');
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const data = await api.updateAdminSettings(settings);
      if (data.success) {
        showToast('Contact emails updated successfully!', 'success');
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Failed to update settings', 'error');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast('All password fields are required', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    try {
      const data = await api.changePassword(currentPassword, newPassword);
      if (data.success) {
        showToast('Admin password changed successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Failed to change password', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-navy-950/90 backdrop-blur-xl overflow-hidden">
      <div className="relative w-full max-w-6xl h-[92vh] glass-panel-glow rounded-3xl border border-cyan-500/30 shadow-glass flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="px-6 py-4 border-b border-cyan-500/20 flex items-center justify-between bg-navy-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent-blue to-accent-cyan flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Admin Command Center</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {user?.username || 'silkroad2.o'}
                </span>
              </h2>
              <span className="text-xs text-slate-400">Database & Directory Controls</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-navy-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-800/80 bg-navy-950/60 flex items-center gap-2 overflow-x-auto scrollbar-none py-2.5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'overview'
                ? 'bg-accent-blue text-white shadow-glow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-navy-900'
              }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'submissions'
                ? 'bg-accent-blue text-white shadow-glow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-navy-900'
              }`}
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Pending Submissions</span>
            {stats?.pendingSubmissions > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-black font-extrabold text-[10px] flex items-center justify-center">
                {stats.pendingSubmissions}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('channels')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'channels'
                ? 'bg-accent-blue text-white shadow-glow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-navy-900'
              }`}
          >
            <ListFilter className="w-4 h-4" />
            <span>All Channels</span>
          </button>

          <button
            onClick={() => setActiveTab('sponsored')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'sponsored'
                ? 'bg-accent-blue text-white shadow-glow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-navy-900'
              }`}
          >
            <Award className="w-4 h-4 text-accent-cyan" />
            <span>Top 100 Sponsored</span>
          </button>

          <button
            onClick={() => setActiveTab('featured')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'featured'
                ? 'bg-accent-blue text-white shadow-glow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-navy-900'
              }`}
          >
            <Sparkles className="w-4 h-4 text-accent-neon" />
            <span>Top 10 Featured Orbit</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'settings'
                ? 'bg-accent-blue text-white shadow-glow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-navy-900'
              }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings & Security</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20 text-center">
                  <span className="text-xs text-slate-400 block mb-1">Total Channels</span>
                  <span className="text-2xl font-black text-white">{stats?.totalChannels || 0}</span>
                </div>
                <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 text-center">
                  <span className="text-xs text-amber-300 block mb-1">Pending Review</span>
                  <span className="text-2xl font-black text-amber-400">{stats?.pendingSubmissions || 0}</span>
                </div>
                <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30 text-center">
                  <span className="text-xs text-emerald-300 block mb-1">Approved Public</span>
                  <span className="text-2xl font-black text-emerald-400">{stats?.approvedChannels || 0}</span>
                </div>
                <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20 text-center">
                  <span className="text-xs text-cyan-300 block mb-1">Top 100 Sponsored</span>
                  <span className="text-2xl font-black text-cyan-400">{stats?.totalSponsored || 0} / 100</span>
                </div>
                <div className="glass-panel p-4 rounded-2xl border border-accent-blue/30 text-center">
                  <span className="text-xs text-accent-neon block mb-1">Top 10 Featured</span>
                  <span className="text-2xl font-black text-accent-neon">{stats?.totalFeatured || 0} / 10</span>
                </div>
                <div className="glass-panel p-4 rounded-2xl border border-purple-500/30 text-center">
                  <span className="text-xs text-purple-300 block mb-1">Categories</span>
                  <span className="text-2xl font-black text-purple-400">{stats?.totalCategories || 0}</span>
                </div>
              </div>

              {/* Quick Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20">
                  <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Quick Review: Pending Channels</span>
                  </h3>
                  {stats?.pendingSubmissions === 0 ? (
                    <p className="text-xs text-slate-400">All submissions have been reviewed. Good job!</p>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-300">
                        There are <strong className="text-amber-400">{stats?.pendingSubmissions}</strong> submissions awaiting moderation.
                      </p>
                      <button
                        onClick={() => setActiveTab('submissions')}
                        className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold"
                      >
                        Review Submissions Now &rarr;
                      </button>
                    </div>
                  )}
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20">
                  <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent-cyan" />
                    <span>Featured Showcase Management</span>
                  </h3>
                  <p className="text-xs text-slate-300 mb-3">
                    Featured channels form the orbital showcase on the homepage. Must be picked from Top 100 sponsored directory.
                  </p>
                  <button
                    onClick={() => setActiveTab('featured')}
                    className="px-4 py-2 rounded-xl bg-accent-blue/20 hover:bg-accent-blue/30 text-accent-cyan border border-accent-cyan/40 text-xs font-semibold"
                  >
                    Manage Top 10 Featured Channels &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PENDING SUBMISSIONS */}
          {activeTab === 'submissions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Pending Channel Submissions</h3>
                <button
                  onClick={loadSubmissions}
                  className="p-1.5 rounded-lg bg-navy-800 text-slate-300 hover:text-white"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {loadingSubmissions ? (
                <div className="text-center py-12 text-slate-400 text-sm">Loading pending submissions...</div>
              ) : submissions.length === 0 ? (
                <div className="glass-panel text-center p-12 rounded-2xl text-slate-400 text-sm">
                  No pending submissions at this moment.
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="glass-panel p-4 rounded-2xl border border-cyan-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-navy-900 border border-slate-700 overflow-hidden flex items-center justify-center flex-shrink-0">
                          {sub.logo_url ? (
                            <img src={sub.logo_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-bold text-accent-cyan text-sm">{sub.name.slice(0, 2)}</span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-bold text-white truncate">{sub.name}</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-navy-800 text-cyan-300 border border-cyan-500/20">
                              {sub.category_name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(sub.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <a
                            href={sub.telegram_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-accent-neon hover:underline flex items-center gap-1 mb-1"
                          >
                            <span>{sub.telegram_url}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <p className="text-xs text-slate-300 line-clamp-2">{sub.description}</p>
                        </div>
                      </div>

                      {/* Approval / Rejection Controls */}
                      <div className="flex items-center gap-2 self-end md:self-center">
                        <button
                          onClick={() => handleApprove(sub.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => setRejectModalId(sub.id)}
                          className="px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ALL CHANNELS */}
          {activeTab === 'channels' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <input
                      type="text"
                      value={channelSearch}
                      onChange={(e) => setChannelSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && loadChannels()}
                      placeholder="Search channels..."
                      className="w-full px-3 py-1.5 pl-9 rounded-xl glass-input text-xs text-white"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2 pointer-events-none" />
                  </div>
                  <select
                    value={channelStatusFilter}
                    onChange={(e) => setChannelStatusFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl glass-input text-xs text-white bg-navy-900"
                  >
                    <option value="all">All Statuses</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <button
                  onClick={loadChannels}
                  className="px-3 py-1.5 rounded-xl bg-navy-850 hover:bg-navy-800 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 border border-cyan-500/20"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>

              {loadingChannels ? (
                <div className="text-center py-12 text-slate-400 text-sm">Loading channels...</div>
              ) : (
                <div className="glass-panel rounded-2xl border border-cyan-500/20 overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-navy-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-3">Channel</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Sponsored</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {channels.map((chan) => (
                        <tr key={chan.id} className="hover:bg-navy-850/40">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-navy-900 overflow-hidden flex items-center justify-center flex-shrink-0">
                                {chan.logo_url ? (
                                  <img src={chan.logo_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <span className="font-bold text-accent-cyan text-xs">{chan.name.slice(0, 2)}</span>
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-white">{chan.name}</div>
                                <a
                                  href={chan.telegram_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-accent-neon hover:underline"
                                >
                                  {chan.telegram_url}
                                </a>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">{chan.category_name}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${chan.status === 'approved'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : chan.status === 'pending'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
                              }`}>
                              {chan.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {chan.sponsored_id ? (
                              <span className="text-cyan-300 font-semibold">Yes (#{chan.sponsored_order})</span>
                            ) : (
                              <span className="text-slate-500">No</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingChannel(chan)}
                                className="p-1.5 rounded-lg bg-navy-800 text-slate-300 hover:text-white"
                                title="Edit Channel"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteChannel(chan.id)}
                                className="p-1.5 rounded-lg bg-red-950/60 text-red-400 hover:text-red-300 border border-red-500/20"
                                title="Delete Channel"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: TOP 100 SPONSORED */}
          {activeTab === 'sponsored' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Top 100 Sponsored Channels</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                      {sponsoredList.length} / 100
                    </span>
                  </h3>
                  <span className="text-xs text-slate-400">Reorder with arrows to change ranking order.</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAddSponsoredModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Sponsored</span>
                  </button>
                  <button
                    onClick={loadSponsored}
                    className="p-1.5 rounded-lg bg-navy-800 text-slate-300 hover:text-white"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {loadingSponsored ? (
                <div className="text-center py-12 text-slate-400 text-sm">Loading sponsored directory...</div>
              ) : sponsoredList.length === 0 ? (
                <div className="glass-panel text-center p-12 rounded-2xl text-slate-400 text-sm">
                  No sponsored channels yet. Click "Add to Sponsored" to spotlight an approved channel.
                </div>
              ) : (
                <div className="space-y-2">
                  {sponsoredList.map((item, idx) => (
                    <div
                      key={item.id}
                      className="glass-panel p-3.5 rounded-2xl border border-cyan-500/20 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-7 h-7 rounded-lg bg-navy-900 border border-cyan-500/30 flex items-center justify-center font-bold text-accent-cyan text-xs">
                          #{idx + 1}
                        </span>

                        <div className="w-10 h-10 rounded-xl bg-navy-900 overflow-hidden flex items-center justify-center flex-shrink-0">
                          {item.logo_url ? (
                            <img src={item.logo_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-bold text-accent-cyan text-xs">{item.name.slice(0, 2)}</span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                          <span className="text-[11px] text-slate-400">{item.category_name}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Reorder Buttons */}
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMoveSponsored(idx, 'up')}
                          className="p-1 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 disabled:opacity-30"
                          title="Move Up"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          disabled={idx === sponsoredList.length - 1}
                          onClick={() => handleMoveSponsored(idx, 'down')}
                          className="p-1 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 disabled:opacity-30"
                          title="Move Down"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>

                        {/* Feature in Orbit Button */}
                        {item.is_featured ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            Featured Orbit #{item.featured_order}
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSetFeatured(item.id)}
                            className="px-2.5 py-1 rounded-lg bg-accent-blue/20 hover:bg-accent-blue/30 text-accent-cyan border border-accent-cyan/30 text-[11px] font-semibold"
                          >
                            + Orbit
                          </button>
                        )}

                        <button
                          onClick={() => handleRemoveSponsored(item.id)}
                          className="p-1.5 rounded-lg bg-red-950/60 text-red-400 hover:text-red-300 border border-red-500/20"
                          title="Remove from Sponsored"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: TOP 10 FEATURED ORBIT */}
          {activeTab === 'featured' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent-cyan" />
                    <span>Top 10 Featured Orbit Channels</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-accent-blue/20 text-accent-neon">
                      {featuredList.length} / 10 Max
                    </span>
                  </h3>
                  <span className="text-xs text-slate-400">
                    These 10 channels power the animated radial showcase on the homepage.
                  </span>
                </div>

                <button
                  onClick={loadFeatured}
                  className="p-1.5 rounded-lg bg-navy-800 text-slate-300 hover:text-white"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {loadingFeatured ? (
                <div className="text-center py-12 text-slate-400 text-sm">Loading featured orbit...</div>
              ) : featuredList.length === 0 ? (
                <div className="glass-panel text-center p-12 rounded-2xl text-slate-400 text-sm">
                  No featured channels assigned yet. Go to "Top 100 Sponsored" tab and click "+ Orbit" to add channels to the signature showcase.
                </div>
              ) : (
                <div className="space-y-2">
                  {featuredList.map((item, idx) => (
                    <div
                      key={item.id}
                      className="glass-panel p-3.5 rounded-2xl border border-cyan-500/30 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-accent-blue to-accent-cyan flex items-center justify-center font-bold text-white text-xs shadow-sm">
                          #{idx + 1}
                        </span>

                        <div className="w-10 h-10 rounded-xl bg-navy-900 overflow-hidden flex items-center justify-center flex-shrink-0">
                          {item.logo_url ? (
                            <img src={item.logo_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-bold text-accent-cyan text-xs">{item.name.slice(0, 2)}</span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                          <span className="text-[11px] text-slate-400">{item.category_name}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMoveFeatured(idx, 'up')}
                          className="p-1 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 disabled:opacity-30"
                          title="Move Up"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          disabled={idx === featuredList.length - 1}
                          onClick={() => handleMoveFeatured(idx, 'down')}
                          className="p-1 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 disabled:opacity-30"
                          title="Move Down"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveFeatured(item.id)}
                          className="px-2.5 py-1 rounded-lg bg-red-950/60 text-red-300 border border-red-500/30 text-xs font-semibold"
                        >
                          Remove from Orbit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SETTINGS & SECURITY */}
          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Public Contact Emails */}
              <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-cyan-400" />
                  <span>Platform Contact Emails</span>
                </h3>
                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Sponsorship Inquiry Email
                    </label>
                    <input
                      type="email"
                      required
                      value={settings.sponsorship_email}
                      onChange={(e) => setSettings({ ...settings, sponsorship_email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                    />
                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                      Used by the "SPONSOR YOUR TELEGRAM CHANNEL" banner button.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Developer Contact Email
                    </label>
                    <input
                      type="email"
                      required
                      value={settings.developer_email}
                      onChange={(e) => setSettings({ ...settings, developer_email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                    />
                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                      Displayed on Aniket Abhang Patil's developer profile card.
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan text-white text-xs font-bold shadow-sm"
                  >
                    Save Contact Settings
                  </button>
                </form>
              </div>

              {/* Password Change */}
              <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-accent-neon" />
                  <span>Change Admin Password</span>
                </h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan text-white text-xs font-bold shadow-sm"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reject Submission Reason Modal */}
      {rejectModalId && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full border border-red-500/30">
            <h3 className="text-base font-bold text-white mb-2">Reject Channel Submission</h3>
            <p className="text-xs text-slate-300 mb-4">
              Optionally specify a rejection reason for admin records:
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Does not meet directory content guidelines..."
              className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white mb-4 resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectModalId(null)}
                className="px-3 py-1.5 rounded-xl bg-navy-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add To Sponsored Modal */}
      {addSponsoredModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full border border-cyan-500/30">
            <h3 className="text-base font-bold text-white mb-2">Add Channel to Top 100</h3>
            <form onSubmit={handleAddSponsored} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Select Channel ID or Name
                </label>
                <select
                  required
                  value={selectedChannelIdForSponsored}
                  onChange={(e) => setSelectedChannelIdForSponsored(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white bg-navy-900"
                >
                  <option value="">Choose an approved channel...</option>
                  {channels.filter(c => c.status === 'approved' && !c.sponsored_id).map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.telegram_url})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Partner Badge Text
                </label>
                <input
                  type="text"
                  value={sponsoredBadge}
                  onChange={(e) => setSponsoredBadge(e.target.value)}
                  placeholder="Sponsored Partner"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Internal Notes (Optional)
                </label>
                <input
                  type="text"
                  value={sponsoredNotes}
                  onChange={(e) => setSponsoredNotes(e.target.value)}
                  placeholder="e.g. Sponsoring partner Q1"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddSponsoredModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-navy-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan text-white text-xs font-bold"
                >
                  Add to Directory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Channel Modal */}
      {editingChannel && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-2xl max-w-lg w-full border border-cyan-500/30">
            <h3 className="text-base font-bold text-white mb-4">Edit Channel Details</h3>
            <form onSubmit={handleSaveEditChannel} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Channel Name</label>
                <input
                  type="text"
                  required
                  value={editingChannel.name}
                  onChange={(e) => setEditingChannel({ ...editingChannel, name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl glass-input text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Telegram URL</label>
                <input
                  type="text"
                  required
                  value={editingChannel.telegram_url}
                  onChange={(e) => setEditingChannel({ ...editingChannel, telegram_url: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl glass-input text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={editingChannel.description}
                  onChange={(e) => setEditingChannel({ ...editingChannel, description: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl glass-input text-xs text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Status</label>
                  <select
                    value={editingChannel.status}
                    onChange={(e) => setEditingChannel({ ...editingChannel, status: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl glass-input text-xs text-white bg-navy-900"
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Language</label>
                  <input
                    type="text"
                    value={editingChannel.language}
                    onChange={(e) => setEditingChannel({ ...editingChannel, language: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl glass-input text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Keywords</label>
                <input
                  type="text"
                  value={editingChannel.keywords || ''}
                  onChange={(e) => setEditingChannel({ ...editingChannel, keywords: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl glass-input text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingChannel(null)}
                  className="px-3 py-1.5 rounded-xl bg-navy-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan text-white text-xs font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

