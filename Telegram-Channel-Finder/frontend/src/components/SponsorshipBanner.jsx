import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Send, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { TelegramIcon, EmailIcon } from './Icons';

export const SponsorshipBanner = ({ sponsorshipEmail = 'silkroad2@gmail.com' }) => {
  const mailtoSubject = encodeURIComponent('Telegram Channel Sponsorship Inquiry');
  const mailtoBody = encodeURIComponent(
    'Hello,\n\nI would like to sponsor my Telegram channel in the Top 100 Directory or Top 10 Featured Orbit on your platform.\n\nChannel Name:\nTelegram Link:\nCategory:\nTarget Duration:\n\nThank you!'
  );
  const mailtoLink = `mailto:${sponsorshipEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

  return (
    <section id="sponsor-banner" className="py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 border-2 border-accent-cyan/40 bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 shadow-glow-md"
        >
          {/* Animated decorative gradient mesh */}
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-accent-cyan/15 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-accent-blue/20 blur-[100px] pointer-events-none" />

          {/* Long Animated Header */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-xs font-bold text-accent-cyan uppercase tracking-widest mb-4 shadow-glow-sm">
                <Sparkles className="w-3.5 h-3.5 text-accent-neon animate-pulse" />
                <span>Prime Sponsorship Opportunities</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase leading-[1.1] mb-4">
                SPONSOR YOUR <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-sky-300 to-accent-blue text-glow">
                  TELEGRAM CHANNEL
                </span>
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 font-normal">
                Skyrocket your subscriber growth by securing a permanent featured slot in our Top 10 Animated Orbit or Top 100 Verified Directory. Direct exposure to thousands of active Telegram community seekers.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <CheckCircle2 className="w-4 h-4 text-accent-neon" />
                  Top 10 Radial Orbital Placement
                </span>
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <CheckCircle2 className="w-4 h-4 text-accent-neon" />
                  Top 100 Directory Rank Badge
                </span>
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <CheckCircle2 className="w-4 h-4 text-accent-neon" />
                  1-Click Working Join Buttons
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <a
                href={mailtoLink}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-accent-blue via-sky-500 to-accent-cyan text-white text-base font-extrabold shadow-glow-md hover:shadow-glow-lg transition-all duration-300 active:scale-95 whitespace-nowrap"
              >
                <EmailIcon className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                <span>CONTACT US TO SPONSOR</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              <span className="text-xs text-slate-400 font-medium">
                Direct inquiry to:{' '}
                <a
                  href={`mailto:${sponsorshipEmail}`}
                  className="text-accent-cyan hover:underline font-mono"
                >
                  {sponsorshipEmail}
                </a>
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

