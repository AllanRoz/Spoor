import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  getStoredSettings,
  saveStoredSettings,
  getStoredStats,
  getStoredFieldGuide,
  getStoredDaily
} from './utils/storage.js';
import { Navbar } from './components/Navbar.jsx';
import { Footer } from './components/Footer.jsx';
import { Home } from './pages/Home.jsx';
import { Setup } from './pages/Setup.jsx';
import { Game } from './pages/Game.jsx';
import { Daily } from './pages/Daily.jsx';
import { FieldGuide } from './pages/FieldGuide.jsx';
import { Statistics } from './pages/Statistics.jsx';
import { Settings } from './pages/Settings.jsx';

export default function App() {
  const [settings, setSettings] = useState(getStoredSettings);
  const [stats, setStats] = useState(getStoredStats);
  const [fieldGuide, setFieldGuide] = useState(getStoredFieldGuide);
  const [dailyRecord, setDailyRecord] = useState(getStoredDaily);

  // Sync dark mode class on <html> element
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const handleUpdateSettings = (newSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
  };

  return (
    <div className="min-h-screen flex flex-col bg-journal-50 dark:bg-[#0c1613] text-stone-900 dark:text-stone-100 bg-journal-pattern transition-colors duration-200 selection:bg-amber-500 selection:text-white">
      {/* Persistent Navigation Header */}
      <Navbar
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        currentStreak={stats.currentStreak || 0}
      />

      {/* Main Page Routing */}
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                stats={stats}
                fieldGuide={fieldGuide}
                dailyRecord={dailyRecord}
                settings={settings}
              />
            }
          />
          <Route
            path="/play"
            element={<Setup settings={settings} />}
          />
          <Route
            path="/game"
            element={
              <Game
                settings={settings}
                stats={stats}
                onUpdateStats={setStats}
              />
            }
          />
          <Route
            path="/daily"
            element={
              <Daily
                settings={settings}
                stats={stats}
                onUpdateStats={setStats}
                dailyRecord={dailyRecord}
                onUpdateDailyRecord={setDailyRecord}
              />
            }
          />
          <Route
            path="/field-guide"
            element={
              <FieldGuide
                fieldGuide={fieldGuide}
                settings={settings}
              />
            }
          />
          <Route
            path="/statistics"
            element={
              <Statistics
                stats={stats}
                onUpdateStats={setStats}
                settings={settings}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <Settings
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onUpdateStats={setStats}
                onUpdateFieldGuide={setFieldGuide}
                onUpdateDailyRecord={setDailyRecord}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
