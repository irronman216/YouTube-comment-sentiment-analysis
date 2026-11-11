import React from 'react'
import { Play, Sparkles, Github, Sun, Moon } from 'lucide-react'

export default function Navbar({ theme, onToggleTheme, onScrollToModel, onScrollToHowItWorks }) {
  const isDark = theme === 'dark'

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-[#0B0F19] border-b border-indigo-100 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-[1500px] w-full mx-auto px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200 dark:shadow-none">
            <Play className="w-4 h-4 fill-white ml-0.5" />
          </div>
          <div>
            <span className="text-xl font-bold font-head tracking-tight text-ink dark:text-white flex items-center gap-1.5">
              SentimentLens
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
                IML Research
              </span>
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onScrollToHowItWorks}
            className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-1.5 rounded-lg hover:bg-indigo-50/60 dark:hover:bg-slate-800/60 transition-colors hidden md:inline-block"
          >
            How it works
          </button>
          
          <button
            onClick={onScrollToModel}
            className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-1.5 rounded-lg hover:bg-indigo-50/60 dark:hover:bg-slate-800/60 transition-colors hidden md:inline-block"
          >
            Model info
          </button>

          {/* Explicit Light / Dark Mode Toggle Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold shadow-2xs transition-all cursor-pointer active:scale-95 ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700 hover:border-slate-600'
                : 'bg-white border-indigo-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300'
            }`}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span>Dark</span>
              </>
            )}
          </button>

          {/* GitHub Icon Link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-ink dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="GitHub Repository"
          >
            <Github className="w-5 h-5" />
          </a>
        </nav>

      </div>
    </header>
  )
}
