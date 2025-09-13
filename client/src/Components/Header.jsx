import React from 'react';
import { useChat } from '../context/ChatContext';
import { SunIcon, MoonIcon, Bars3Icon } from '@heroicons/react/24/outline';

function Header() {
  const { darkMode, toggleDarkMode, toggleSidebar } = useChat();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden" // Hide on large screens
          >
            <Bars3Icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            AI Chatbot
          </h1>
        </div>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {darkMode ? (
            <SunIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <MoonIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>
    </header>
  );
}

export default Header;