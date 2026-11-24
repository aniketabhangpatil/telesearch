import React from 'react';
import { Award, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { TelegramIcon } from './Icons';
import { getAssetUrl } from '../api/api';

export const SponsoredDirectory = ({ sponsoredChannels = [], onScrollToSponsor }) => {
  return (
    <section id="sponsored" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent-blue/10 border border-accent-cyan/30 text-xs font-semibold text-accent-neon mb-3">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Partners</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
              Top 100 Telegram Channels
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
              Verified high-tier channels officially spotlighted on our platform. Maximum 100 channels strictly enforced.
            </p>
          </div>

          <button
            onClick={onScrollToSponsor}
            className="self-start md:self-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan text-white text-xs sm:text-sm font-semibold shadow-glow-sm hover:shadow-glow-md transition-all whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            <span>Apply For Top 100 Spot</span>
          </button>
        </div>

        {/* Channels Grid */}
        {sponsoredChannels.length === 0 ? (
          <div className="glass-panel text-center p-12 rounded-2xl border border-cyan-500/20">
            <Award className="w-10 h-10 text-amber-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Sponsored Directory Open</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-4">
              Be among the premier channels featured in our verified Top 100 sponsored directory.
            </p>
            <button
              onClick={onScrollToSponsor}
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-navy-800 text-accent-cyan border border-cyan-500/30 hover:bg-navy-700"
            >
              Contact Admin For Sponsorship
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {sponsoredChannels.map((item, index) => (
              <div
                key={item.sponsored_id || item.channel_id || index}
                className="glass-panel p-5 rounded-2xl border border-cyan-500/15 hover:border-cyan-400/50 hover:shadow-glow-sm transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-navy-900 text-accent-cyan border border-cyan-500/30">
                      Rank #{item.display_order || index + 1}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      {item.badge_text || 'Sponsored'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-navy-900 border border-cyan-500/30 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {item.logo_url ? (
                        <img
                          src={getAssetUrl(item.logo_url)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className="w-full h-full bg-gradient-to-tr from-accent-blue/30 to-accent-cyan/20 flex items-center justify-center font-bold text-accent-neon text-sm"
                        style={{ display: item.logo_url ? 'none' : 'flex' }}
                      >
                        {item.name?.slice(0, 2).toUpperCase() || 'TG'}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-white truncate group-hover:text-accent-cyan transition-colors">
                        {item.name}
                      </h3>
                      <span className="text-xs text-slate-400 block truncate">
                        {item.category_name}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300/80 line-clamp-2 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <a
                  href={item.telegram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan hover:opacity-95 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <TelegramIcon className="w-3.5 h-3.5" />
                  <span>JOIN CHANNEL</span>
                  <ExternalLink className="w-3 h-3 text-cyan-200" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

