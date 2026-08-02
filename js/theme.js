/* ==========================================================================
   theme.js — light/dark theme toggle with localStorage persistence
   ========================================================================== */
(function () {
  'use strict';

  const STORAGE_KEY = 'portfolio-theme';
  const root = document.documentElement;
  const toggleBtn = document.getElementById('themeToggle');

  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (toggleBtn) {
      const isLight = theme === 'light';
      toggleBtn.setAttribute('aria-pressed', isLight ? 'true' : 'false');
      toggleBtn.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
    }
  }

  // Apply theme immediately to avoid flash of wrong theme
  applyTheme(getPreferredTheme());

  function toggleTheme() {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleTheme);
  }

  // Expose for other scripts if needed
  window.__portfolioTheme = { applyTheme, toggleTheme, getPreferredTheme };
})();
