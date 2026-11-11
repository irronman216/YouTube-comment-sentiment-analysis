import React from 'react'
import { calculateSentimentScore, getVerdict } from '../lib/utils'
import { Activity } from 'lucide-react'

export default function SentimentDial({ positive, negative, total, theme }) {
  const score = calculateSentimentScore(positive, negative, total)
  const verdict = getVerdict(score)

  // Clamp normalized fill percentage: 0 to 1
  const fillPct = Math.max(0.02, Math.min(1, (score + 100) / 200))

  const isDark = theme === 'dark' || (
    typeof document !== 'undefined' && (
      document.documentElement.classList.contains('dark') ||
      document.documentElement.getAttribute('data-theme') === 'dark'
    )
  )

  const trackColor = isDark ? '#1E293B' : '#E2E8F0'

  let dialColor = '#F59E0B' // Neutral
  if (score > 15) dialColor = '#10B981' // Positive
  if (score < -15) dialColor = '#F43F5E' // Negative

  // Circumference for semicircle of radius 88: Math.PI * 88 = 276.46
  const arcLength = 276.46
  const strokeOffset = arcLength * (1 - fillPct)

  return (
    <div className="bg-white dark:bg-[#131B2E] border border-indigo-100 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-indigo-50 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h4 className="text-sm font-bold font-head text-ink dark:text-white">Net Sentiment Score</h4>
        </div>
        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">Scale: -100 to +100</span>
      </div>

      {/* SVG Precision Gauge: exact coordinate geometry with guaranteed margins */}
      <div className="relative w-full h-52 my-1 flex items-center justify-center">
        <svg
          viewBox="0 0 240 135"
          className="w-full max-w-[270px] mx-auto overflow-visible"
          aria-label={`Net sentiment score: ${score}, verdict: ${verdict.text}`}
        >
          {/* Background Track Arc */}
          <path
            d="M 32,118 A 88,88 0 0,1 208,118"
            fill="none"
            stroke={trackColor}
            strokeWidth="15"
            strokeLinecap="round"
          />

          {/* Active Colored Score Arc */}
          <path
            d="M 32,118 A 88,88 0 0,1 208,118"
            fill="none"
            stroke={dialColor}
            strokeWidth="15"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={strokeOffset}
            style={{
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s ease'
            }}
          />

          {/* 1. Score Number: perfectly centered with 14px headroom from top arc */}
          <text
            x="120"
            y="60"
            textAnchor="middle"
            dominantBaseline="central"
            fill={dialColor}
            className="font-head font-extrabold select-none"
            style={{ fontSize: '32px', letterSpacing: '-0.03em' }}
          >
            {score > 0 ? `+${score}` : score}
          </text>

          {/* 2. Index Score Label: cleanly separated between number and verdict */}
          <text
            x="120"
            y="79"
            textAnchor="middle"
            dominantBaseline="central"
            fill={isDark ? '#94A3B8' : '#64748B'}
            className="font-head font-bold uppercase select-none"
            style={{ fontSize: '10px', letterSpacing: '0.12em' }}
          >
            INDEX SCORE
          </text>

          {/* 3. Verdict: clearly elevated 16px above the arc baseline, zero collision */}
          <text
            x="120"
            y="97"
            textAnchor="middle"
            dominantBaseline="central"
            fill={dialColor}
            className="font-head font-semibold select-none"
            style={{ fontSize: '11px' }}
          >
            {verdict.text}
          </text>
        </svg>
      </div>

      {/* Bottom Range Indicators: neatly aligned at card base */}
      <div className="pt-2.5 border-t border-indigo-50 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-slate-400 dark:text-slate-500">
        <span className="text-rose-500 font-bold">-100 (Neg)</span>
        <span className="text-amber-500 font-bold">0 (Neutral)</span>
        <span className="text-emerald-500 font-bold">+100 (Pos)</span>
      </div>

    </div>
  )
}
