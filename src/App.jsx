import React, { useState, useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import LoadingStepper from './components/LoadingStepper'
import VideoCard from './components/VideoCard'
import KpiRow from './components/KpiRow'
import SentimentDial from './components/SentimentDial'
import DonutChart from './components/DonutChart'
import CountBars from './components/CountBars'
import ConfidenceBars from './components/ConfidenceBars'
import LikesBySentiment from './components/LikesBySentiment'
import Spotlight from './components/Spotlight'
import CommentExplorer from './components/CommentExplorer'
import ModelInfo from './components/ModelInfo'
import ErrorCard from './components/ErrorCard'
import HowItWorksModal from './components/HowItWorksModal'
import { analyzeYouTube } from './lib/api'
import { exportToCsv } from './lib/utils'
import { Download, RotateCcw, ArrowLeft, Sparkles } from 'lucide-react'

export default function App() {
  // Theme state: 'light' | 'dark' (defaults to 'light' for Calm Sky theme)
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('sentimentlens_theme')
      return saved === 'dark' ? 'dark' : 'light'
    } catch (e) {
      return 'light'
    }
  })

  const applyTheme = (t) => {
    const isDark = t === 'dark'
    document.documentElement.setAttribute('data-theme', t)
    document.documentElement.style.colorScheme = t
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    if (document.body) {
      document.body.setAttribute('data-theme', t)
      document.body.style.backgroundColor = isDark ? '#0B0F19' : '#FAF9F6'
      document.body.style.color = isDark ? '#94A3B8' : '#475569'
      if (isDark) {
        document.body.classList.add('dark')
      } else {
        document.body.classList.remove('dark')
      }
    }
  }

  useEffect(() => {
    applyTheme(theme)
    try {
      localStorage.setItem('sentimentlens_theme', theme)
    } catch (e) {}
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark'
      applyTheme(nextTheme)
      return nextTheme
    })
  }

  // Application states: 'idle' | 'loading' | 'success' | 'error'
  const [status, setStatus] = useState('idle')
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [lastQuery, setLastQuery] = useState(null)

  // How it works modal
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false)

  const handleScrollToModel = () => {
    const el = document.getElementById('model-info-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleAnalyze = async (query) => {
    setLastQuery(query)
    setStatus('loading')
    setCurrentStep(0)
    setError(null)

    try {
      const result = await analyzeYouTube({
        url: query.url,
        maxComments: query.maxComments,
        sort: query.sort,
        onProgress: (step) => setCurrentStep(step),
      })

      setData(result)
      setStatus('success')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      console.error('Analysis failed:', err)
      setError(err.message || 'Failed to complete sentiment analysis.')
      setStatus('error')
    }
  }

  const handleRetry = () => {
    if (lastQuery) {
      handleAnalyze(lastQuery)
    } else {
      setStatus('idle')
    }
  }

  const handleResetToIdle = () => {
    setStatus('idle')
    setData(null)
    setError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleExportCsv = () => {
    if (!data) return
    const sanitizedTitle = (data.video?.title || 'video_sentiment')
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase()
      .substring(0, 30)
    exportToCsv(data, `${sanitizedTitle}_sentiment.csv`)
  }

  return (
    <div
      data-theme={theme}
      className={`min-h-screen flex flex-col font-body transition-colors duration-200 ${
        theme === 'dark' ? 'dark bg-[#0B0F19] text-slate-300' : 'bg-canvas text-slate-600'
      }`}
      style={{
        backgroundColor: theme === 'dark' ? '#0B0F19' : '#FAF9F6',
        color: theme === 'dark' ? '#94A3B8' : '#475569',
      }}
    >
      
      {/* 1. Sticky Navbar with Theme Switcher */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onScrollToModel={handleScrollToModel}
        onScrollToHowItWorks={() => setIsHowItWorksOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        
        {/* STATE 1: IDLE */}
        {status === 'idle' && (
          <div className="space-y-6 w-full">
            <Hero onAnalyze={handleAnalyze} isLoading={false} />
            <ModelInfo id="model-info-section" />
          </div>
        )}

        {/* STATE 2: LOADING */}
        {status === 'loading' && (
          <LoadingStepper currentStep={currentStep} />
        )}

        {/* STATE 3: RESULTS (SUCCESS) */}
        {status === 'success' && data && (
          <div className="max-w-[1500px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-8 animate-fadeIn">
            
            {/* Top Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-indigo-100 dark:border-slate-800">
              <button
                onClick={handleResetToIdle}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3.5 py-2 rounded-xl bg-white dark:bg-[#131B2E] border border-indigo-100 dark:border-slate-800 shadow-2xs hover:bg-indigo-50/50 dark:hover:bg-slate-800 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Analyze another video</span>
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-indigo-700 dark:text-indigo-300 bg-white dark:bg-[#131B2E] border border-indigo-100 dark:border-slate-800 hover:bg-indigo-50/80 dark:hover:bg-slate-800 rounded-xl shadow-2xs transition-all hover:shadow-xs"
                >
                  <Download className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Download CSV</span>
                </button>

                <button
                  onClick={() => handleAnalyze(lastQuery)}
                  className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-[#131B2E] border border-indigo-100 dark:border-slate-800 hover:bg-indigo-50/60 dark:hover:bg-slate-800 rounded-xl transition-all shadow-2xs"
                  title="Re-run analysis"
                  aria-label="Re-run analysis"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Video Summary Card */}
            <VideoCard video={data.video} counts={data.counts} />

            {/* KPI Row (4 Cards) */}
            <KpiRow counts={data.counts} total={data.video.total} />

            {/* Visual Analytics Grid: 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SentimentDial
                positive={data.counts.positive}
                negative={data.counts.negative}
                total={data.video.total}
                theme={theme}
              />
              <DonutChart counts={data.counts} total={data.video.total} />
              <CountBars counts={data.counts} />
            </div>

            {/* Secondary Analytics Grid: 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ConfidenceBars avgConfidence={data.avg_confidence} />
              <LikesBySentiment comments={data.comments} />
            </div>

            {/* Spotlight Cards (Most Positive & Most Negative) */}
            <Spotlight comments={data.comments} />

            {/* Comment Explorer with Tabs, Search, Sorting, and Pagination */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold font-head uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Comment Explorer
                </h3>
              </div>
              <CommentExplorer comments={data.comments} />
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 py-8 border-t border-indigo-100 dark:border-slate-800">
              <button
                onClick={handleExportCsv}
                className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download CSV</span>
              </button>

              <button
                onClick={handleResetToIdle}
                className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#131B2E] border border-indigo-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all shadow-2xs flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4 text-slate-500" />
                <span>Analyze another video</span>
              </button>
            </div>

            {/* Model Info Section */}
            <ModelInfo id="model-info-section" />

          </div>
        )}

        {/* STATE 4: ERROR */}
        {status === 'error' && (
          <div className="py-6 space-y-6 w-full">
            <ErrorCard
              error={error}
              onRetry={handleRetry}
              onUseSample={(sample) => handleAnalyze({ url: sample.url, maxComments: sample.data.video.total, sort: 'top' })}
            />
            <ModelInfo id="model-info-section" />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#0B0F19] border-t border-indigo-100 dark:border-slate-800 py-6 text-center text-xs text-slate-400 dark:text-slate-500 transition-colors">
        <div className="max-w-[1500px] w-full mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 SentimentLens — Introduction to Machine Learning Research Project.</p>
          <p className="flex items-center gap-1">
            Built by <strong className="text-slate-600 dark:text-slate-300">Krish Prajapati</strong> & <strong className="text-slate-600 dark:text-slate-300">Avinash A</strong>
          </p>
        </div>
      </footer>

      {/* How It Works Pipeline Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

    </div>
  )
}
