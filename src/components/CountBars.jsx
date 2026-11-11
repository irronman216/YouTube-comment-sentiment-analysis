import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { SENTIMENT_COLORS, formatNumber } from '../lib/utils'
import { BarChart2 } from 'lucide-react'

export default function CountBars({ counts }) {
  const isDarkMode = typeof document !== 'undefined' && (
    document.documentElement.classList.contains('dark') ||
    document.documentElement.getAttribute('data-theme') === 'dark'
  )

  const data = [
    { name: 'Positive', count: counts.positive, color: SENTIMENT_COLORS.positive },
    { name: 'Neutral', count: counts.neutral, color: SENTIMENT_COLORS.neutral },
    { name: 'Negative', count: counts.negative, color: SENTIMENT_COLORS.negative },
  ]

  return (
    <div className="bg-white dark:bg-[#131B2E] border border-indigo-100 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-indigo-50 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h4 className="text-sm font-bold font-head text-ink dark:text-white">Volume Breakdown</h4>
        </div>
        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">Total Counts</span>
      </div>

      {/* Chart with proper left padding to avoid number clashes */}
      <div className="w-full h-52 my-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="name"
              stroke={isDarkMode ? '#64748B' : '#94A3B8'}
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              width={38}
              stroke={isDarkMode ? '#64748B' : '#94A3B8'}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatNumber(v)}
            />
            <Tooltip
              formatter={(value) => [formatNumber(value), 'Comments']}
              contentStyle={{
                backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                borderColor: isDarkMode ? '#334155' : '#E0E7FF',
                color: isDarkMode ? '#F8FAFC' : '#1E1B4B',
                borderRadius: '12px',
                fontSize: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              itemStyle={{ color: isDarkMode ? '#F8FAFC' : '#1E1B4B' }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={52}>
              {data.map((entry, index) => (
                <Cell key={`bar-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom counts summary with distinct pill badges */}
      <div className="pt-2.5 border-t border-indigo-50 dark:border-slate-800 flex items-center justify-around text-xs font-semibold">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800/60">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {item.name}: <strong className="text-ink dark:text-white font-bold">{formatNumber(item.count)}</strong>
            </span>
          </div>
        ))}
      </div>

    </div>
  )
}
