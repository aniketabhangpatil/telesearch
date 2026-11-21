import React from 'react';
import { LinkedInIcon, GitHubIcon, InstagramIcon, EmailIcon, TelegramIcon } from './Icons';
import { Code, ExternalLink, ShieldCheck } from 'lucide-react';

export const DeveloperProfile = ({ developerEmail = 'silkroad2.o@gmail.com' }) => {
  return (
    <section id="developer" className="py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-cyan-500/20 shadow-glass relative overflow-hidden">
          {/* Subtle Ambient Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            {/* Profile Photograph with Circular Crop & Responsive Sizing */}
            <div className="relative flex-shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-[3px] bg-gradient-to-tr from-accent-blue via-accent-cyan to-accent-neon shadow-glow-md flex items-center justify-center overflow-hidden">
                <img
                  src="/aniket-patil.jpg"
                  alt="Aniket Abhang Patil"
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    if (e.target.src.endsWith('/aniket-patil.jpg')) {
                      e.target.src = '/profile.jpg';
                    } else if (e.target.src.endsWith('/profile.jpg')) {
                      e.target.src = '/aniket-patil.png';
                    }
                  }}
                />
              </div>
              <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-navy-900 border-2 border-accent-cyan flex items-center justify-center text-accent-cyan shadow-sm">
                <Code className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-blue/15 border border-accent-cyan/30 text-xs font-semibold text-accent-neon mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Founder & Developer</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
                Aniket Abhang Patil
              </h2>

              <p className="text-sm font-semibold text-accent-cyan mb-4">
                Software Developer
              </p>

              <blockquote className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal mb-6 border-l-2 border-accent-cyan/40 pl-4 py-1 italic bg-navy-900/30 rounded-r-xl">
                "I'm Aniket Abhang Patil, a Software Developer and the founder of this platform. I built this platform to make discovering relevant Telegram channels easier through a simple, organized and efficient search experience."
              </blockquote>

              {/* Social and Contact Links with Real Icons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/aniket-abhang-824315338"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-navy-900 hover:bg-[#0077b5] text-slate-300 hover:text-white border border-slate-700/60 hover:border-transparent text-xs font-semibold transition-all group"
                  aria-label="LinkedIn Profile"
                >
                  <LinkedInIcon className="w-4 h-4 text-[#0077b5] group-hover:text-white transition-colors" />
                  <span>LinkedIn</span>
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com/aniketabhangpatil"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-navy-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 hover:border-slate-500 text-xs font-semibold transition-all group"
                  aria-label="GitHub Profile"
                >
                  <GitHubIcon className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  <span>GitHub</span>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/aniket_abhang_patil/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-navy-900 hover:bg-gradient-to-r hover:from-[#833ab4] hover:via-[#fd1d1d] hover:to-[#fcb045] text-slate-300 hover:text-white border border-slate-700/60 hover:border-transparent text-xs font-semibold transition-all group"
                  aria-label="Instagram Profile"
                >
                  <InstagramIcon className="w-4 h-4 text-[#e1306c] group-hover:text-white transition-colors" />
                  <span>Instagram</span>
                </a>

                {/* Developer Email */}
                <a
                  href={`mailto:${developerEmail}`}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-navy-900 hover:bg-accent-blue/30 text-slate-300 hover:text-accent-cyan border border-slate-700/60 hover:border-accent-cyan text-xs font-semibold transition-all group"
                  aria-label="Developer Email"
                >
                  <EmailIcon className="w-4 h-4 text-accent-cyan group-hover:scale-110 transition-transform" />
                  <span className="font-mono text-[11px]">{developerEmail}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

