import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, ExternalLink, ShieldCheck, Compass } from 'lucide-react';
import { TelegramIcon } from './Icons';

export const FeaturedOrbit = ({ featuredChannels = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const shouldReduceMotion = useReducedMotion();

  // If no featured channels yet, show clean placeholder or message
  if (!featuredChannels || featuredChannels.length === 0) {
    return (
      <section id="featured" className="py-20 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="glass-panel p-10 rounded-2xl border border-cyan-500/20">
            <Sparkles className="w-10 h-10 text-cyan-400 mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-bold text-white mb-2">Top 10 Featured Orbit</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Our curated showcase of signature Telegram communities is being configured by the admin team. Check back shortly!
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Maximum 10 featured channels
  const channels = featuredChannels.slice(0, 10);
  const count = channels.length;

  return (
    <section id="featured" className="py-24 relative overflow-hidden select-none">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-accent-blue/15 via-cyan-500/10 to-indigo-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent-blue/10 border border-accent-cyan/30 text-xs font-semibold text-accent-neon mb-3 shadow-glow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Signature Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Top 10 Featured Channels
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Dynamic radial orbit featuring our most prestigious, high-growth partner communities.
          </p>
        </div>

        {/* Desktop & Large Screen: Orbital Radial Showcase */}
        <div className="hidden lg:block relative w-full h-[660px] mx-auto">
          {/* Central Radial Core */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center">
            {/* Concentric Decorative Rings */}
            <div className="absolute w-[620px] h-[480px] rounded-[50%] border border-cyan-500/15 pointer-events-none -z-10" />
            <div className="absolute w-[440px] h-[340px] rounded-[50%] border border-cyan-400/20 border-dashed pointer-events-none -z-10" />
            <div className="absolute w-[240px] h-[190px] rounded-[50%] border border-sky-400/25 pointer-events-none -z-10" />

            {/* Glowing Center Hub */}
            <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-navy-900 via-navy-850 to-navy-800 border-2 border-accent-cyan p-1 shadow-glow-cyan flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-accent-blue to-accent-cyan flex items-center justify-center mb-1 shadow-sm">
                <TelegramIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-[10px] font-extrabold text-accent-cyan uppercase tracking-wider">
                TOP 10
              </span>
              <span className="text-[9px] text-slate-300 font-medium">FEATURED</span>
            </div>
          </div>

          {/* Orbiting Channel Cards */}
          <div className="relative w-full h-full">
            {channels.map((channel, i) => {
              // Calculate radial position in ellipse
              const angle = (i * (2 * Math.PI / count)) - (Math.PI / 2);
              const radiusX = 360;
              const radiusY = 220;
              const xPos = Math.cos(angle) * radiusX;
              const yPos = Math.sin(angle) * radiusY;

              const isHovered = hoveredIndex === i;

              return (
                <motion.div
                  key={channel.channel_id || channel.id || i}
                  initial={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { scale: 0, x: 0, y: 0, opacity: 0 }
                  }
                  animate={{
                    scale: isHovered ? 1.08 : 1,
                    x: xPos,
                    y: yPos,
                    opacity: 1,
                    zIndex: isHovered ? 50 : 20
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 90,
                    damping: 15,
                    delay: shouldReduceMotion ? 0 : i * 0.1
                  }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 group cursor-pointer"
                >
                  <div className={`p-4 rounded-2xl transition-all duration-300 ${
                    isHovered
                      ? 'bg-navy-850/95 border-2 border-accent-cyan shadow-glow-cyan backdrop-blur-2xl'
                      : 'glass-panel border-cyan-500/20 hover:border-cyan-400/60'
                  }`}>
                    {/* Header: Logo, Rank, Badge */}
                    <div className="flex items-center gap-3 mb-2.5">
                      <div className="relative w-11 h-11 rounded-xl bg-navy-900 border border-cyan-500/30 overflow-hidden flex-shrink-0 flex items-center justify-center">
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
                          className="w-full h-full bg-gradient-to-tr from-accent-blue/30 to-accent-cyan/20 flex items-center justify-center font-bold text-accent-neon text-sm"
                          style={{ display: channel.logo_url ? 'none' : 'flex' }}
                        >
                          {channel.name?.slice(0, 2).toUpperCase() || 'TG'}
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent-blue/20 text-accent-cyan border border-accent-blue/30">
                            #{i + 1}
                          </span>
                          <span className="text-xs font-semibold text-white truncate">
                            {channel.name}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 block truncate">
                          {channel.category_name || 'Featured Partner'}
                        </span>
                      </div>
                    </div>

                    {/* Short Description */}
                    <p className="text-xs text-slate-300/80 line-clamp-2 leading-relaxed mb-3 h-8">
                      {channel.description}
                    </p>

                    {/* Working Join Channel Button */}
                    <a
                      href={channel.telegram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan hover:opacity-95 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm group-hover:shadow-glow-sm transition-all"
                    >
                      <TelegramIcon className="w-3.5 h-3.5 text-white" />
                      <span>JOIN CHANNEL</span>
                      <ExternalLink className="w-3 h-3 text-cyan-200" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile / Tablet Responsive Fallback: Responsive Staggered Grid */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {channels.map((channel, i) => (
            <motion.div
              key={channel.channel_id || channel.id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="glass-panel p-4 rounded-2xl border border-cyan-500/20 hover:border-cyan-400/60 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-navy-900 border border-cyan-500/30 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {channel.logo_url ? (
                    <img src={channel.logo_url} alt={channel.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-accent-blue/30 to-accent-cyan/20 flex items-center justify-center font-bold text-accent-neon text-sm">
                      {channel.name?.slice(0, 2).toUpperCase() || 'TG'}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent-blue/20 text-accent-cyan border border-accent-blue/30">
                      #{i + 1}
                    </span>
                    <h4 className="text-sm font-semibold text-white truncate">
                      {channel.name}
                    </h4>
                  </div>
                  <span className="text-xs text-slate-400">
                    {channel.category_name || 'Featured'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 mb-3">
                {channel.description}
              </p>

              <a
                href={channel.telegram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <TelegramIcon className="w-3.5 h-3.5" />
                <span>JOIN CHANNEL</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

