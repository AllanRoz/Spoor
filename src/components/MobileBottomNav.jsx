import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Footprints,
  Calendar,
  BookOpen,
  BarChart2
} from 'lucide-react';
import { playSound } from '../utils/sound.js';
import { triggerHaptic } from '../utils/haptics.js';

export function MobileBottomNav({ settings }) {
  const location = useLocation();

  const tabs = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/play', label: 'Play', icon: Footprints },
    { to: '/daily', label: 'Daily', icon: Calendar },
    { to: '/field-guide', label: 'Field Guide', icon: BookOpen },
    { to: '/statistics', label: 'Stats', icon: BarChart2 }
  ];

  const handleNavClick = () => {
    triggerHaptic('light', settings?.hapticsEnabled);
    playSound('click', settings?.soundEnabled);
  };

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-journal-50/95 dark:bg-[#0c1613]/95 backdrop-blur-lg border-t border-journal-200 dark:border-stone-800 safe-bottom-nav transition-colors duration-200 shadow-lg"
    >
      <div className="grid grid-cols-5 h-14 max-w-lg mx-auto px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.to;

          return (
            <Link
              key={tab.to}
              to={tab.to}
              onClick={handleNavClick}
              className={`flex flex-col items-center justify-center py-1 transition-all ${
                isActive
                  ? 'text-amber-600 dark:text-amber-400 font-bold'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
