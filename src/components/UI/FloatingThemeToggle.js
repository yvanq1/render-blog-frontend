import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const FloatingThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  return (
    <div className="fixed right-6 top-24 z-50">
      {/* 拉线效果 */}
      <div className="absolute -top-8 right-5 w-px h-12 bg-gray-300 dark:bg-gray-600" />
      
      {/* 开关按钮 */}
      <button
        onClick={toggleTheme}
        className="relative group flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label="Toggle dark mode"
      >
        <div className="relative z-10">
          {isDark ? (
            <SunIcon className="w-5 h-5 text-yellow-500 transition-transform duration-300 group-hover:rotate-90" />
          ) : (
            <MoonIcon className="w-5 h-5 text-gray-600 transition-transform duration-300 group-hover:-rotate-90" />
          )}
        </div>
        
        {/* 按钮边框动画 */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-gray-300 dark:group-hover:border-gray-600 transition-all duration-300"></div>
        
        {/* 悬停时的光晕效果 */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-indigo-400 dark:to-purple-500 transition-opacity duration-300"></div>
      </button>
    </div>
  );
};

export default FloatingThemeToggle;
