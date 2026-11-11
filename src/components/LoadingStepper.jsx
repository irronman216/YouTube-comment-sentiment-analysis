import React from 'react'
import { Download, Sparkles, Cpu, BarChart3, CheckCircle2, Loader2 } from 'lucide-react'

const STEPS = [
  { id: 0, label: 'Fetching comments', desc: 'Querying YouTube API stream', icon: Download },
  { id: 1, label: 'Cleaning text', desc: 'Removing emojis, handles, and noise', icon: Sparkles },
  { id: 2, label: 'Running model', desc: 'DistilRoBERTa fine-tuned inference', icon: Cpu },
  { id: 3, label: 'Building charts', desc: 'Computing distributions and metrics', icon: BarChart3 },
]

export default function LoadingStepper({ currentStep = 0 }) {
  return (
    <div className="max-w-[1500px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-10 space-y-10 animate-fadeIn">

      {/* 4-Step Stepper Card */}
      <div className="bg-white dark:bg-[#131B2E] border border-indigo-100 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-center text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-8">
          Processing Video Analysis
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2 relative">
          {STEPS.map((step, index) => {
            const Icon = step.icon
            const isFinished = currentStep > index
            const isActive = currentStep === index

            return (
              <div key={step.id} className="flex flex-col items-center text-center relative z-10">
                {/* Step Circle */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${isFinished
                      ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200 dark:shadow-none'
                      : isActive
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-950 animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                    }`}
                >
                  {isFinished ? (
                    <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                  ) : isActive ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                {/* Step Text */}
                <div className="mt-3">
                  <span
                    className={`block text-xs sm:text-sm font-bold ${isFinished
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : isActive
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                  >
                    {step.label}
                  </span>
                  <span className="block text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 max-w-[150px] hidden sm:block">
                    {step.desc}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Skeleton Pulse Layout */}
      <div className="space-y-6">

        {/* Skeleton Video Card */}
        <div className="bg-white dark:bg-[#131B2E] border border-indigo-100 dark:border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row gap-5 items-center animate-pulse">
          <div className="w-full sm:w-48 h-28 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="flex-1 space-y-3 w-full">
            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4"></div>
            <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-md w-1/3"></div>
            <div className="h-7 bg-slate-100 dark:bg-slate-700 rounded-full w-28"></div>
          </div>
        </div>

        {/* Skeleton KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-[#131B2E] border border-indigo-100 dark:border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-1/2"></div>
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full w-full"></div>
            </div>
          ))}
        </div>

        {/* Skeleton Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-[#131B2E] border border-indigo-100 dark:border-slate-800 rounded-2xl p-6 h-64 flex flex-col justify-between">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
              <div className="w-32 h-32 mx-auto rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-indigo-300 dark:border-t-indigo-600 animate-spin"></div>
              <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-2/3 mx-auto"></div>
            </div>
          ))}
        </div>

      </div>

    </div>
  )
}
