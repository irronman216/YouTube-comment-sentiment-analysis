import React from 'react'
import { AlertCircle, RotateCcw, Youtube, Sparkles } from 'lucide-react'
import { SAMPLE_VIDEOS } from '../lib/utils'

export default function ErrorCard({ error, onRetry, onUseSample }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-fadeIn">
      <div className="bg-white dark:bg-[#131B2E] border border-rose-100 dark:border-rose-900/40 rounded-2xl p-8 sm:p-10 shadow-sm text-center">
        
        {/* Error Icon */}
        <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold font-head text-ink dark:text-white">
          Unable to Complete Analysis
        </h3>
        
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
          {error || 'An unexpected error occurred while fetching comments or processing sentiment.'}
        </p>

        {/* Diagnostic hints */}
        <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-left text-xs text-slate-600 dark:text-slate-300 space-y-2">
          <div className="font-semibold text-slate-800 dark:text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Common Causes & Solutions:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 pl-1 text-slate-500 dark:text-slate-400">
            <li>The video may have comments turned off, unlisted, or private.</li>
            <li>YouTube API quota limit reached; retry in a few moments or test with a sample video.</li>
            <li>Ensure the link format matches: <code>https://youtube.com/watch?v=...</code> or <code>youtu.be/...</code></li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onRetry}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-sm hover:shadow flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry Analysis</span>
          </button>

          <button
            onClick={() => onUseSample(SAMPLE_VIDEOS[0])}
            className="px-5 py-2.5 border border-indigo-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-indigo-700 dark:text-indigo-300 font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2"
          >
            <Youtube className="w-3.5 h-3.5 text-rose-500" />
            <span>Load Sample Video</span>
          </button>
        </div>

      </div>
    </div>
  )
}
