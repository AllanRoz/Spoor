import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Footprints,
  Calendar,
  BookOpen,
  BarChart2,
  Settings,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Flame,
  Menu,
  X
} from 'lucide-react';
import { playSound } from '../utils/sound.js';

export function Navbar({ settings, onUpdateSettings, currentStreak = 0 }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    const updated = { ...settings, soundEnabled: !settings.soundEnabled };
    onUpdateSettings(updated);
    if (!settings.soundEnabled) {
      playSound('click', true);
    }
  };

  const toggleTheme = () => {
    const updated = { ...settings, darkMode: !settings.darkMode };
    onUpdateSettings(updated);
    playSound('click', settings.soundEnabled);
  };

  const navLinks = [
    { to: '/play', label: 'Play', icon: Footprints },
    { to: '/daily', label: 'Daily', icon: Calendar },
    { to: '/field-guide', label: 'Field Guide', icon: BookOpen },
    { to: '/statistics', label: 'Stats', icon: BarChart2 },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleLinkClick = () => {
    playSound('click', settings.soundEnabled);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-journal-50/90 dark:bg-[#0c1613]/90 backdrop-blur-md border-b border-journal-200 dark:border-stone-800/80 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          onClick={handleLinkClick}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-600 dark:bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-600/20 group-hover:scale-105 transition-transform">
            <Footprints className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif font-black text-xl tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-1">
              SPOOR
            </span>
            <span className="hidden sm:block text-[10px] text-stone-500 dark:text-stone-400 font-medium -mt-1 tracking-wider uppercase">
              Field Tracking
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-journal-100/70 dark:bg-stone-900/60 p-1.5 rounded-2xl border border-journal-200 dark:border-stone-800">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={handleLinkClick}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white dark:bg-stone-800 text-amber-700 dark:text-amber-400 shadow-sm'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-journal-200/50 dark:hover:bg-stone-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Tools (Streak, Sound, Theme, Mobile toggle) */}
        <div className="flex items-center gap-2">
          {/* Streak Badge */}
          {currentStreak > 0 && (
            <div
              title="Current Spoor Streak"
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100/90 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold font-mono"
            >
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse-subtle" />
              <span>{currentStreak}</span>
            </div>
          )}

          {/* Sound Toggle Button */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={settings.soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-journal-200 dark:hover:bg-stone-800 transition-colors"
            title={settings.soundEnabled ? 'Sound Effects: ON' : 'Sound Effects: OFF'}
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-400" />
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={settings.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-journal-200 dark:hover:bg-stone-800 transition-colors"
            title={settings.darkMode ? 'Light Field Journal' : 'Dark Night Guide'}
          >
            {settings.darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-stone-600" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-journal-200 dark:hover:bg-stone-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 border-b border-journal-200 dark:border-stone-800 bg-journal-50 dark:bg-[#0c1613] animate-fade-in">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-stone-700 dark:text-stone-300 hover:bg-journal-200 dark:hover:bg-stone-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
