import React, { useState, useEffect } from 'react';
import { Send, Shield, PlusCircle, Search, Sparkles } from 'lucide-react';
import { TelegramIcon } from './Icons';

export const Navbar = ({ onOpenSubmit, onOpenAdmin, onScrollToSearch, onScrollToSponsor }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled
        ? 'bg-navy-950/85 backdrop-blur-xl border-b border-cyan-500/20 py-3 shadow-glass'
        : 'bg-transparent py-5'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-blue via-accent-cyan to-accent-neon p-[1.5px] shadow-glow-sm group-hover:shadow-glow-md transition-shadow">
            <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
              <TelegramIcon className="w-5 h-5 text-accent-cyan group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              Tele<span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-blue">Search</span>
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent-blue/20 text-accent-neon font-semibold border border-accent-blue/30">
                PRO
              </span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Telegram Channel Finder</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={onScrollToSearch}
            className="hover:text-accent-cyan transition-colors flex items-center gap-1.5"
          >
            <Search className="w-4 h-4 text-accent-neon" />
            Discover
          </button>
          <a
            href="#featured"
            className="hover:text-accent-cyan transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Top 10 Featured Channels
          </a>
          <a
            href="#categories"
            className="hover:text-accent-cyan transition-colors"
          >
            Categories
          </a>
          <a
            href="#sponsored"
            className="hover:text-accent-cyan transition-colors flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-accent-cyan animate-ping" />
            Top 100 Directory
          </a>
          <a
            href="#developer"
            className="hover:text-accent-cyan transition-colors"
          >
            Developer
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onScrollToSponsor}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-accent-cyan bg-accent-blue/10 border border-accent-blue/30 hover:bg-accent-blue/20 hover:border-accent-cyan transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent-neon" />
            Sponsor Channel
          </button>

          <button
            onClick={onOpenSubmit}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-accent-blue to-accent-cyan hover:shadow-glow-sm hover:opacity-95 transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Submit Channel
          </button>

          <button
            onClick={onOpenAdmin}
            title="Admin Portal"
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-navy-900/60 hover:bg-navy-800 border border-slate-700/50 transition-colors"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

