import React from 'react'
import { MessageSquare, Smile, Meh, Frown } from 'lucide-react'
import { formatNumber } from '../lib/utils'

export default function KpiRow({ counts, total }) {
  const safeTotal = total > 0 ? total : (counts.positive + counts.neutral + counts.negative) || 1

  const posPct = Math.round((counts.positive / safeTotal) * 100)
  const neuPct = Math.round((counts.neutral / safeTotal) * 100)
  const negPct = Math.round((counts.negative / safeTotal) * 100)

  const cards = [
    {
      title: 'Total Comments',
      count: safeTotal,
      pct: 100,
      icon: MessageSquare,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/60',
      barColor: 'bg-indigo-600 dark:bg-indigo-500',
      borderColor: 'border-indigo-100 dark:border-slate-800',
      isTotal: true
    },
    {
      title: 'Positive',
      count: counts.positive,
      pct: posPct,
      icon: Smile,
      emoji: '😊',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/60',
      barColor: 'bg-emerald-500',
      borderColor: 'border-emerald-100 dark:border-slate-800',
    },
    {
      title: 'Neutral',
      count: counts.neutral,
      pct: neuPct,
      icon: Meh,
      emoji: '😐',
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/60',
      barColor: 'bg-amber-500',
      borderColor: 'border-amber-100 dark:border-slate-800',
    },
    {
      title: 'Negative',
      count: counts.negative,
      pct: negPct,
      icon: Frown,
      emoji: '😠',
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/60',
      barColor: 'bg-rose-500',
      borderColor: 'border-rose-100 dark:border-slate-800',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <div
            key={idx}
            className={`bg-white dark:bg-[#131B2E] border ${card.borderColor} rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between`}
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{card.title}</span>
              <div className={`w-9 h-9 rounded-xl ${card.bgColor} ${card.color} flex items-center justify-center text-sm`}>
                {card.emoji ? <span>{card.emoji}</span> : <Icon className="w-4 h-4" />}
              </div>
            </div>

            {/* Metric row */}
            <div className="mt-4">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold font-head text-ink dark:text-white tracking-tight leading-tight">
                  {formatNumber(card.count)}
                </span>
                {!card.isTotal && (
                  <span className={`text-xs sm:text-sm font-bold ${card.color} shrink-0 px-2 py-0.5 rounded-full ${card.bgColor}`}>
                    {card.pct}%
                  </span>
                )}
              </div>

              {/* Mini progress bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${card.barColor}`}
                  style={{ width: `${card.pct}%` }}
                />
              </div>
            </div>

          </div>
        )
      })}
    </div>
  )
}
