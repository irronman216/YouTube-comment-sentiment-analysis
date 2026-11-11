import React from 'react'
import { Smile, Frown, ThumbsUp, ShieldCheck, Sparkles } from 'lucide-react'
import { formatNumber } from '../lib/utils'

export default function Spotlight({ comments }) {
  if (!comments || comments.length === 0) return null

  const posComments = comments.filter((c) => c.label === 2)
  const mostPos = posComments.length > 0
    ? [...posComments].sort((a, b) => b.confidence - a.confidence || (b.likes || 0) - (a.likes || 0))[0]
    : null

  const negComments = comments.filter((c) => c.label === 0)
  const mostNeg = negComments.length > 0
    ? [...negComments].sort((a, b) => b.confidence - a.confidence || (b.likes || 0) - (a.likes || 0))[0]
    : null

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-sm font-bold font-head uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Sentiment Spotlight
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Most Positive Comment (Green Card) */}
        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100 dark:border-emerald-900/50">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                  <Smile className="w-4 h-4" />
                </div>
                <span>Most Positive Highlight</span>
              </div>
              {mostPos && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100/70 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{Math.round(mostPos.confidence * 100)}% Conf.</span>
                </div>
              )}
            </div>

            <p className="mt-4 text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed italic">
              "{mostPos?.text || 'No positive comments detected in this sample.'}"
            </p>
          </div>

          {mostPos && (
            <div className="mt-5 pt-3 border-t border-emerald-100/70 dark:border-emerald-900/40 flex items-center justify-between text-xs text-emerald-900/80 dark:text-emerald-300/80">
              <div className="flex items-center gap-1.5">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{formatNumber(mostPos.likes)} likes</span>
              </div>
              <span className="text-[11px] font-medium bg-emerald-200/50 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md">
                Class 2 (Positive)
              </span>
            </div>
          )}
        </div>

        {/* Most Negative Comment (Red Card) */}
        <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-800/40 rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-rose-100 dark:border-rose-900/50">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs">
                <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-center">
                  <Frown className="w-4 h-4" />
                </div>
                <span>Most Critical Highlight</span>
              </div>
              {mostNeg && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100/70 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300 text-[11px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{Math.round(mostNeg.confidence * 100)}% Conf.</span>
                </div>
              )}
            </div>

            <p className="mt-4 text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed italic">
              "{mostNeg?.text || 'No critical comments detected in this sample.'}"
            </p>
          </div>

          {mostNeg && (
            <div className="mt-5 pt-3 border-t border-rose-100/70 dark:border-rose-900/40 flex items-center justify-between text-xs text-rose-900/80 dark:text-rose-300/80">
              <div className="flex items-center gap-1.5">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{formatNumber(mostNeg.likes)} likes</span>
              </div>
              <span className="text-[11px] font-medium bg-rose-200/50 dark:bg-rose-900/60 px-2 py-0.5 rounded-md">
                Class 0 (Negative)
              </span>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
