import React from 'react';
import { ExternalLink, Tag, Globe, Sparkles, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { TelegramIcon } from './Icons';

export const SearchResults = ({
  channels = [],
  loading = false,
  page = 1,
  totalPages = 1,
  totalResults = 0,
  query = '',
  onPageChange,
  onOpenSubmit
}) => {
  return (
    <section id="results" className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>Search & Directory Results</span>
              {query && (
                <span className="text-sm font-normal text-slate-400">
                  for "<span className="text-accent-cyan">{query}</span>"
                </span>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {loading
                ? 'Searching channels with relevance scoring...'
                : `Showing ${channels.length} of ${totalResults} verified channel${totalResults === 1 ? '' : 's'}`}
            </p>
          </div>

          <button
            onClick={onOpenSubmit}
            className="self-start sm:self-auto text-xs font-semibold px-3 py-1.5 rounded-lg bg-navy-850 hover:bg-navy-800 text-accent-neon border border-cyan-500/30 transition-colors"
          >
            + Submit Channel for Listing
          </button>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="glass-panel p-6 rounded-2xl animate-pulse border border-slate-800">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-navy-900" />
                  <div className="flex-1 space-y-2">
                    <div className="w-3/4 h-4 bg-navy-850 rounded" />
                    <div className="w-1/2 h-3 bg-navy-900 rounded" />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="w-full h-3 bg-navy-900 rounded" />
                  <div className="w-4/5 h-3 bg-navy-900 rounded" />
                </div>
                <div className="w-full h-9 bg-navy-850 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && channels.length === 0 && (
          <div className="glass-panel text-center p-12 sm:p-16 rounded-3xl border border-cyan-500/20 max-w-xl mx-auto my-6">
            <div className="w-16 h-16 rounded-2xl bg-navy-900 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4 text-cyan-400">
              <Inbox className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Matching Channels Found</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              We couldn't find any approved channels matching your search criteria. Try different keywords or add your channel to our public directory!
            </p>
            <button
              onClick={onOpenSubmit}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan text-white text-sm font-semibold shadow-glow-sm hover:shadow-glow-md transition-all"
            >
              Submit Your Channel Free
            </button>
          </div>
        )}

        {/* Channel Cards Grid */}
        {!loading && channels.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {channels.map((channel) => (
              <div
                key={channel.id}
                className="glass-panel p-6 rounded-2xl border border-cyan-500/15 hover:border-cyan-400/50 hover:shadow-glow-sm transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-navy-900 border border-cyan-500/30 overflow-hidden flex-shrink-0 flex items-center justify-center group-hover:border-cyan-400 transition-colors">
                      {channel.logo_url ? (
                        <img
                          src={channel.logo_url}
                          alt={channel.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className="w-full h-full bg-gradient-to-tr from-accent-blue/30 to-accent-cyan/20 flex items-center justify-center font-bold text-accent-neon text-base"
                        style={{ display: channel.logo_url ? 'none' : 'flex' }}
                      >
                        {channel.name?.slice(0, 2).toUpperCase() || 'TG'}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h3 className="text-base font-bold text-white truncate group-hover:text-accent-cyan transition-colors">
                          {channel.name}
                        </h3>
                        {channel.relevance_score > 0 && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-accent-blue/20 text-accent-cyan border border-accent-blue/30 whitespace-nowrap">
                            Score: {channel.relevance_score}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-navy-800 text-slate-300 border border-slate-700/60">
                          {channel.category_name}
                        </span>
                        {channel.language && (
                          <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-navy-900 text-slate-400 flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {channel.language}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Channel Description */}
                  <p className="text-xs sm:text-sm text-slate-300/85 leading-relaxed line-clamp-3 mb-4">
                    {channel.description}
                  </p>

                  {/* Keywords Tags */}
                  {channel.keywords && (
                    <div className="flex flex-wrap gap-1 mb-5">
                      {channel.keywords.split(',').slice(0, 3).map((kw, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-medium px-2 py-0.5 rounded bg-navy-900/80 text-cyan-300 border border-cyan-500/20"
                        >
                          #{kw.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Working Join Channel Button */}
                <a
                  href={channel.telegram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan hover:opacity-95 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm group-hover:shadow-glow-sm transition-all active:scale-[0.98]"
                >
                  <TelegramIcon className="w-4 h-4 text-white" />
                  <span>JOIN CHANNEL</span>
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-200" />
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="p-2 rounded-xl bg-navy-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-semibold text-slate-300 px-3 py-1 rounded-lg bg-navy-900 border border-slate-800">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="p-2 rounded-xl bg-navy-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

