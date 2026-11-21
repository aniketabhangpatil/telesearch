import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Filter, X, ArrowRight } from 'lucide-react';

export const SearchHero = ({ 
  categories = [], 
  selectedCategory, 
  onSelectCategory, 
  searchQuery, 
  onSearchChange, 
  onPerformSearch,
  totalResults
}) => {
  const [localQuery, setLocalQuery] = useState(searchQuery || '');

  useEffect(() => {
    setLocalQuery(searchQuery || '');
  }, [searchQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onPerformSearch(localQuery);
  };

  const handleClear = () => {
    setLocalQuery('');
    onPerformSearch('');
  };

  return (
    <section className="relative pt-32 pb-16 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-accent-blue/20 via-accent-cyan/15 to-transparent blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Futuristic Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy-850/90 border border-cyan-500/30 text-xs font-semibold text-cyan-300 mb-6 shadow-glow-sm backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-accent-cyan animate-pulse" />
          <span>Curated & Relevance-Ranked Directory</span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
          <span className="text-slate-400">Verified Channels</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
          Find The Best <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-sky-300 to-accent-blue text-glow">
            Telegram Channels
          </span>{' '}
          In Seconds
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300/90 font-normal leading-relaxed mb-10">
          Discover high-value communities, daily signals, coding hubs, and tech insights. 
          Powered by transparent, relevance-weighted search matching.
        </p>

        {/* Main Search Input Form */}
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative mb-6">
          <div className="relative flex items-center rounded-2xl p-2 glass-panel-glow border border-cyan-500/30 focus-within:border-cyan-400 focus-within:shadow-glow-md transition-all">
            <div className="pl-3.5 pr-2 text-cyan-400">
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search by channel name, topic, description, or keyword..."
              className="w-full bg-transparent text-white placeholder-slate-400 text-sm sm:text-base px-2 py-2.5 focus:outline-none"
            />

            {localQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan hover:from-sky-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-glow-sm hover:shadow-glow-md transition-all whitespace-nowrap active:scale-95"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Search Helper / Status */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-slate-400 mb-6">
          <span>Search weights: Exact name (100) • Name (60) • Link (30) • Description (20)</span>
          {totalResults !== null && (
            <span className="px-2.5 py-0.5 rounded-full bg-navy-800 text-cyan-300 border border-cyan-500/20 font-medium">
              {totalResults} channel{totalResults === 1 ? '' : 's'} found
            </span>
          )}
        </div>

        {/* Quick Filter Categories Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              selectedCategory === 'all'
                ? 'bg-accent-blue text-white border-accent-cyan shadow-glow-sm'
                : 'bg-navy-900/60 text-slate-300 border-slate-700/60 hover:border-slate-500 hover:bg-navy-800'
            }`}
          >
            All Channels
          </button>
          {categories.slice(0, 7).map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id === selectedCategory ? 'all' : cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-accent-blue text-white border-accent-cyan shadow-glow-sm'
                  : 'bg-navy-900/60 text-slate-300 border-slate-700/60 hover:border-slate-500 hover:bg-navy-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

