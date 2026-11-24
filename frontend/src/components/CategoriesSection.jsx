import React from 'react';
import { 
  Folder, Cpu, Coins, TrendingUp, BookOpen, Film, Newspaper, 
  Gamepad2, Megaphone, HeartPulse, Headphones, Code2, Compass
} from 'lucide-react';

const iconMap = {
  Cpu,
  Coins,
  TrendingUp,
  BookOpen,
  Film,
  Newspaper,
  Gamepad2,
  Megaphone,
  HeartPulse,
  Headphones,
  Code2,
  Compass,
  Folder
};

export const CategoriesSection = ({ categories = [], selectedCategory, onSelectCategory }) => {
  return (
    <section id="categories" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent-blue/10 border border-accent-cyan/30 text-xs font-semibold text-accent-neon mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Structured Exploration</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Browse Channels By Category
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Discover vetted communities categorized by domain expertise and niche interests.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const IconComponent = iconMap[cat.icon] || Compass;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
                className={`p-4 rounded-2xl text-left transition-all duration-300 flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-navy-800/90 border-accent-cyan shadow-glow-sm scale-[1.02]'
                    : 'glass-panel border-cyan-500/10 hover:border-cyan-400/40 hover:bg-navy-850/60'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-navy-900 border border-cyan-500/20 flex items-center justify-center text-accent-cyan mb-3">
                  <IconComponent className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white mb-1 truncate">
                    {cat.name}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{cat.approved_count || 0} channels</span>
                    <span className="text-accent-neon font-semibold text-[10px]">Explore &rarr;</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

