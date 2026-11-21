import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { SearchHero } from './components/SearchHero';
import { FeaturedOrbit } from './components/FeaturedOrbit';
import { SearchResults } from './components/SearchResults';
import { CategoriesSection } from './components/CategoriesSection';
import { SponsoredDirectory } from './components/SponsoredDirectory';
import { SubmissionSection } from './components/SubmissionSection';
import { SponsorshipBanner } from './components/SponsorshipBanner';
import { DeveloperProfile } from './components/DeveloperProfile';
import { Footer } from './components/Footer';
import { AdminLoginModal } from './components/Admin/AdminLoginModal';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { Toast } from './components/Toast';
import { api } from './api/api';

export default function App() {
  // Public data state
  const [categories, setCategories] = useState([]);
  const [featuredChannels, setFeaturedChannels] = useState([]);
  const [sponsoredChannels, setSponsoredChannels] = useState([]);
  const [channels, setChannels] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchLoading, setSearchLoading] = useState(false);

  // Settings
  const [settings, setSettings] = useState({
    sponsorship_email: 'silkroad2@gmail.com',
    developer_email: 'silkroad2.o@gmail.com'
  });

  // Admin Auth state
  const [adminUser, setAdminUser] = useState(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial Load: Settings, Categories, Featured, Sponsored
  const loadInitialData = useCallback(async () => {
    try {
      const [settingsRes, catRes, featRes, sponRes] = await Promise.allSettled([
        api.getPublicSettings(),
        api.getCategories(),
        api.getTop10Featured(),
        api.getTop100Sponsored()
      ]);

      if (settingsRes.status === 'fulfilled' && settingsRes.value.success) {
        setSettings(settingsRes.value.settings);
      }
      if (catRes.status === 'fulfilled' && catRes.value.success) {
        setCategories(catRes.value.categories);
      }
      if (featRes.status === 'fulfilled' && featRes.value.success) {
        setFeaturedChannels(featRes.value.featured);
      }
      if (sponRes.status === 'fulfilled' && sponRes.value.success) {
        setSponsoredChannels(sponRes.value.sponsored);
      }
    } catch (err) {
      console.error('Failed to load initial directory data:', err);
    }
  }, []);

  // Search Channels Query
  const fetchChannels = useCallback(async (queryParam = '', catParam = 'all', pageParam = 1) => {
    setSearchLoading(true);
    try {
      const data = await api.searchChannels({
        q: queryParam,
        category: catParam,
        page: pageParam,
        limit: 12
      });

      if (data.success) {
        setChannels(data.channels);
        setTotalResults(data.total);
        setTotalPages(data.totalPages);
        setPage(data.page);
      }
    } catch (err) {
      console.error('Search error:', err);
      addToast('Failed to retrieve search results.', 'error');
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // Check existing session
  useEffect(() => {
    api.checkAuth().then((res) => {
      if (res.authenticated) {
        setAdminUser(res.user);
      }
    }).catch(() => {});

    loadInitialData();
    fetchChannels('', 'all', 1);
  }, [loadInitialData, fetchChannels]);

  // Handlers
  const handlePerformSearch = (newQuery) => {
    setSearchQuery(newQuery);
    fetchChannels(newQuery, selectedCategory, 1);
    const resultsEl = document.getElementById('results');
    if (resultsEl) {
      resultsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    fetchChannels(searchQuery, catId, 1);
    const resultsEl = document.getElementById('results');
    if (resultsEl) {
      resultsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePageChange = (newPage) => {
    fetchChannels(searchQuery, selectedCategory, newPage);
    const resultsEl = document.getElementById('results');
    if (resultsEl) {
      resultsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoginSuccess = (user) => {
    setAdminUser(user);
    setIsAdminDashboardOpen(true);
    addToast(`Welcome back, ${user.username}!`, 'success');
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      setAdminUser(null);
      setIsAdminDashboardOpen(false);
      addToast('Admin logged out successfully.', 'info');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleSubmissionSuccess = () => {
    addToast('Your channel submission was received and is pending review!', 'success');
    setIsSubmitModalOpen(false);
  };

  const scrollToSearch = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSponsor = () => {
    const el = document.getElementById('sponsor-banner');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col relative selection:bg-accent-blue selection:text-white">
      {/* Background radial atmosphere */}
      <div className="fixed inset-0 bg-grid-pattern opacity-30 pointer-events-none -z-20" />

      {/* Navigation */}
      <Navbar
        onOpenSubmit={() => setIsSubmitModalOpen(true)}
        onOpenAdmin={() => {
          if (adminUser) {
            setIsAdminDashboardOpen(true);
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
        onScrollToSearch={scrollToSearch}
        onScrollToSponsor={scrollToSponsor}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* 1. Search Hero */}
        <SearchHero
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onPerformSearch={handlePerformSearch}
          totalResults={totalResults}
        />

        {/* 2. Top 10 Signature Radial Orbit Animation */}
        <FeaturedOrbit featuredChannels={featuredChannels} />

        {/* 3. Search Results & Directory */}
        <SearchResults
          channels={channels}
          loading={searchLoading}
          page={page}
          totalPages={totalPages}
          totalResults={totalResults}
          query={searchQuery}
          onPageChange={handlePageChange}
          onOpenSubmit={() => setIsSubmitModalOpen(true)}
        />

        {/* 4. Categories Section */}
        <CategoriesSection
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* 5. Top 100 Sponsored Directory */}
        <SponsoredDirectory
          sponsoredChannels={sponsoredChannels}
          onScrollToSponsor={scrollToSponsor}
        />

        {/* 6. Free Channel Submission Form */}
        <SubmissionSection
          categories={categories}
          onSubmitSuccess={handleSubmissionSuccess}
        />

        {/* 7. Animated "SPONSOR YOUR TELEGRAM CHANNEL" Banner */}
        <SponsorshipBanner sponsorshipEmail={settings.sponsorship_email} />

        {/* 8. Developer Profile (Aniket Abhang Patil) */}
        <DeveloperProfile developerEmail={settings.developer_email} />
      </main>

      {/* 9. Footer */}
      <Footer
        onOpenAdmin={() => {
          if (adminUser) {
            setIsAdminDashboardOpen(true);
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
        sponsorshipEmail={settings.sponsorship_email}
        developerEmail={settings.developer_email}
      />

      {/* Submission Modal */}
      {isSubmitModalOpen && (
        <SubmissionSection
          categories={categories}
          onSubmitSuccess={handleSubmissionSuccess}
          isModal={true}
          onClose={() => setIsSubmitModalOpen(false)}
        />
      )}

      {/* Admin Login Modal (unprefilled credentials) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Admin Dashboard Command Center */}
      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => {
          setIsAdminDashboardOpen(false);
          loadInitialData(); // Refresh directory in case admin updated anything
          fetchChannels(searchQuery, selectedCategory, page);
        }}
        user={adminUser}
        onLogout={handleLogout}
        showToast={addToast}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

