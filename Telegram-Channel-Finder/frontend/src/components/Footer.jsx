import React from 'react';
import { TelegramIcon, LinkedInIcon, GitHubIcon, InstagramIcon, EmailIcon } from './Icons';
import { Shield, Sparkles } from 'lucide-react';

export const Footer = ({ onOpenAdmin, sponsorshipEmail = 'silkroad2@gmail.com', developerEmail = 'silkroad2.o@gmail.com' }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-navy-950 pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent-blue to-accent-cyan p-[1.5px] flex items-center justify-center">
                <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                  <TelegramIcon className="w-5 h-5 text-accent-cyan" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Tele<span className="text-accent-cyan">Search</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed mb-6">
              A modern, high-precision search directory designed to help Telegram users discover verified, active communities across technology, crypto, news, education and beyond.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/in/aniket-abhang-824315338"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-navy-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-cyan-500/30 transition-colors"
                title="LinkedIn"
              >
                <LinkedInIcon className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/aniketabhangpatil"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-navy-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-cyan-500/30 transition-colors"
                title="GitHub"
              >
                <GitHubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/aniket_abhang_patil/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-navy-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-cyan-500/30 transition-colors"
                title="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${developerEmail}`}
                className="w-8 h-8 rounded-lg bg-navy-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-cyan-500/30 transition-colors"
                title="Email Developer"
              >
                <EmailIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="#featured" className="hover:text-accent-cyan transition-colors">
                  Top 10 Featured Orbit
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-accent-cyan transition-colors">
                  Category Directory
                </a>
              </li>
              <li>
                <a href="#sponsored" className="hover:text-accent-cyan transition-colors">
                  Top 100 Sponsored
                </a>
              </li>
              <li>
                <a href="#submit" className="hover:text-accent-cyan transition-colors">
                  Free Channel Submission
                </a>
              </li>
              <li>
                <a href="#developer" className="hover:text-accent-cyan transition-colors">
                  Developer Profile
                </a>
              </li>
            </ul>
          </div>

          {/* Admin & Support */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href={`mailto:${sponsorshipEmail}`} className="hover:text-accent-cyan transition-colors">
                  Sponsorship Inquiries
                </a>
              </li>
              <li>
                <a href={`mailto:${developerEmail}`} className="hover:text-accent-cyan transition-colors">
                  Developer Contact
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-accent-cyan transition-colors flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-accent-neon" />
                  <span>Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Attribution */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} Telegram Channel Finder. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Engineered by{' '}
            <a
              href="https://github.com/aniketabhangpatil"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-accent-cyan font-medium transition-colors"
            >
              Aniket Abhang Patil
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

