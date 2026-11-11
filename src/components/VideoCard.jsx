import React from 'react'
import { Youtube, Sparkles, MessageSquare } from 'lucide-react'
import { getVerdict, calculateSentimentScore, formatNumber } from '../lib/utils'

export default function VideoCard({ video, counts }) {
  const score = calculateSentimentScore(counts.positive, counts.negative, video.total)
  const verdict = getVerdict(score)

  return (
    <div className="bg-white dark:bg-[#131B2E] border border-indigo-100 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        
        {/* Left: Thumbnail & Meta */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-48 h-28 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-indigo-50 dark:border-slate-800">
            <img
              src={video.thumbnail || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80'}
              alt={video.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80'
              }}
            />
            <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-semibold text-white flex items-center gap-1">
              <Youtube className="w-3 h-3 text-red-500" />
              <span>YouTube</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase">
              {video.channel || 'Channel'}
            </span>
            <h2 className="text-base sm:text-xl font-bold font-head text-ink dark:text-white line-clamp-2 leading-snug">
              {video.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span><strong>{formatNumber(video.total)}</strong> comments analyzed</span>
            </div>
          </div>
        </div>

        {/* Right: Overall Verdict Chip */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-indigo-50 dark:border-slate-800">
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-1">Audience Verdict</span>
          <div className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-2 ${verdict.bg} ${verdict.textCol} ${verdict.border} dark:bg-opacity-20`}>
            <span className="w-2 h-2 rounded-full bg-current"></span>
            <span>{verdict.text}</span>
          </div>
        </div>

      </div>
    </div>
  )
}
