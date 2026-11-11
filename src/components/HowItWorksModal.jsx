import React from 'react'
import { X, Youtube, Cpu, BarChart3, ShieldCheck, CheckCircle } from 'lucide-react'

export default function HowItWorksModal({ isOpen, onClose }) {
  if (!isOpen) return null

  const steps = [
    {
      num: '01',
      title: 'YouTube Ingestion',
      icon: Youtube,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950/60',
      desc: 'Fetches raw user comments from the target YouTube video stream sorted by top or newest reactions.'
    },
    {
      num: '02',
      title: 'Preprocessing & Tokenization',
      icon: ShieldCheck,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/60',
      desc: 'Cleans text noise, strips emojis, handles casing, and truncates to 128 max tokens with attention masks.'
    },
    {
      num: '03',
      title: 'Fine-Tuned Transformer Inference',
      icon: Cpu,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/60',
      desc: 'Passes tokens through the top 3 unfrozen layers of DistilRoBERTa, extracting CLS pooled embeddings.'
    },
    {
      num: '04',
      title: 'Multi-Class Sentiment Head',
      icon: BarChart3,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/60',
      desc: 'Dense MLP layers output softmax confidence across 3 balanced sentiment classes: Negative, Neutral, and Positive.'
    }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 dark:bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#131B2E] border border-indigo-100 dark:border-slate-800 rounded-2xl shadow-xl max-w-xl w-full p-6 sm:p-7 relative transition-all">

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-indigo-50 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold font-head text-ink dark:text-white">How SentimentLens Works</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">End-to-end sentiment classification pipeline</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="mt-5 space-y-3.5">
          {steps.map((st, i) => {
            const Icon = st.icon
            return (
              <div key={i} className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className={`w-9 h-9 rounded-xl ${st.bgColor} ${st.color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">{st.num}</span>
                    <h4 className="text-xs font-bold text-ink dark:text-white">{st.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Accuracy Benchmark Note */}
        <div className="mt-5 p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-xs text-indigo-950 dark:text-indigo-300 flex items-center gap-2.5">
          <CheckCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>
            Achieving <strong>77.57% test accuracy</strong> on 102k test comments, outperforming frozen embeddings by +6.5%.
          </span>
        </div>

        {/* Close Button */}
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  )
}
