import React, { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { SENTIMENT_COLORS, formatNumber } from '../lib/utils'
import { PieChart as PieIcon } from 'lucide-react'

export default function DonutChart({ counts, total }) {
  const safeTotal = total || (counts.positive + counts.neutral + counts.negative) || 1
  const [activeSlice, setActiveSlice] = useState(null)

  const data = [
    {
      name: 'Positive',
      value: counts.positive,
      color: SENTIMENT_COLORS.positive,
      pct: Math.round((counts.positive / safeTotal) * 100)
    },
    {
      name: 'Neutral',
      value: counts.neutral,
      color: SENTIMENT_COLORS.neutral,
      pct: Math.round((counts.neutral / safeTotal) * 100)
    },
    {
      name: 'Negative',
      value: counts.negative,
      color: SENTIMENT_COLORS.negative,
      pct: Math.round((counts.negative / safeTotal) * 100)
    },
  ]

  const dominant = data.reduce((prev, current) => (prev.value > current.value ? prev : current), data[0])

  // Center figure display: shows hovered slice details or defaults to dominant sentiment
  const active = activeSlice || {
    name: dominant.name,
    pct: dominant.pct,
    value: dominant.value,
    color: dominant.color,
  }

  return (
    <div className="bg-white dark:bg-[#131B2E] border border-indigo-100 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-indigo-50 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <PieIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h4 className="text-sm font-bold font-head text-ink dark:text-white">Sentiment Distribution</h4>
        </div>
        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">Hover slice to inspect</span>
      </div>

      {/* Donut Chart with Interactive Center Display (No colliding tooltip) */}
      <div className="relative w-full h-52 flex items-center justify-center my-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={66}
              outerRadius={92}
              paddingAngle={3}
              dataKey="value"
              onMouseEnter={(_, index) => setActiveSlice(data[index])}
              onMouseLeave={() => setActiveSlice(null)}
              cursor="pointer"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="none"
                  className="transition-opacity duration-200"
                  opacity={activeSlice && activeSlice.name !== entry.name ? 0.6 : 1}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text (Always legible, never clashed by popups) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none select-none transition-all duration-200">
          <span
            className="text-3xl sm:text-4xl font-extrabold font-head tracking-tight block leading-none transition-colors duration-200"
            style={{ color: active.color }}
          >
            {active.pct}%
          </span>
          <span className="block text-xs font-bold uppercase tracking-wider text-ink dark:text-white mt-1">
            {active.name}
          </span>
          <span className="block text-[11px] font-medium text-slate-400 dark:text-slate-500">
            {formatNumber(active.value)} comments
          </span>
        </div>
      </div>

      {/* Interactive Legend with Slice Counts */}
      <div className="pt-2.5 border-t border-indigo-50 dark:border-slate-800 flex items-center justify-around text-xs">
        {data.map((item) => (
          <button
            key={item.name}
            type="button"
            onMouseEnter={() => setActiveSlice(item)}
            onMouseLeave={() => setActiveSlice(null)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all cursor-pointer ${
              activeSlice?.name === item.name
                ? 'bg-slate-100 dark:bg-slate-800 scale-105'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-slate-600 dark:text-slate-300 font-semibold text-[11px]">
              {item.name}: <strong className="text-ink dark:text-white">{formatNumber(item.value)}</strong>
            </span>
          </button>
        ))}
      </div>

    </div>
  )
}
