import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { SENTIMENT_COLORS } from '../lib/utils'
import { ShieldCheck } from 'lucide-react'

export default function ConfidenceBars({ avgConfidence }) {
  const isDarkMode = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')

  const data = [
    {
      name: 'Positive',
      confidence: Math.round((avgConfidence.positive || 0.85) * 100),
      color: SENTIMENT_COLORS.positive
    },
    {
      name: 'Neutral',
      confidence: Math.round((avgConfidence.neutral || 0.68) * 100),
      color: SENTIMENT_COLORS.neutral
    },
    {
      name: 'Negative',
      confidence: Math.round((avgConfidence.negative || 0.82) * 100),
      color: SENTIMENT_COLORS.negative
    },
  ]

  return (
    <div className="bg-white dark:bg-[#131B2E] border border-indigo-100 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-indigo-50 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h4 className="text-sm font-bold font-head text-ink dark:text-white">Avg Model Confidence</h4>
        </div>
        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">0 - 100%</span>
      </div>

      {/* Horizontal Bar Chart */}
      <div className="w-full h-48 my-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 8, right: 28, left: 10, bottom: 0 }}
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              stroke={isDarkMode ? '#64748B' : '#94A3B8'}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke={isDarkMode ? '#64748B' : '#94A3B8'}
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(value) => [`${value}%`, 'Confidence']}
              contentStyle={{
                backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                borderColor: isDarkMode ? '#334155' : '#E0E7FF',
                color: isDarkMode ? '#F8FAFC' : '#1E1B4B',
                borderRadius: '12px',
                fontSize: '12px'
              }}
              itemStyle={{ color: isDarkMode ? '#F8FAFC' : '#1E1B4B' }}
            />
            <Bar dataKey="confidence" radius={[0, 6, 6, 0]} barSize={22}>
              {data.map((entry, index) => (
                <Cell key={`conf-cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-indigo-50 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
        <span>Transformer softmax mean score</span>
        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">DistilRoBERTa</span>
      </div>

    </div>
  )
}
