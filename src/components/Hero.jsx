import React, { useState } from 'react'
import { Link2, ArrowRight, X, Sparkles, Youtube } from 'lucide-react'
import { validateYouTubeUrl, SAMPLE_VIDEOS } from '../lib/utils'

export default function Hero({ onAnalyze, isLoading }) {
  const [url, setUrl] = useState('')
  const [maxComments, setMaxComments] = useState(500)
  const [sort, setSort] = useState('top')
  const [touchError, setTouchError] = useState(false)

  const isValid = url.trim() === '' || validateYouTubeUrl(url)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!url.trim()) {
      setTouchError(true)
      return
    }

    if (!validateYouTubeUrl(url)) {
      setTouchError(true)
      return
    }

    setTouchError(false)
    onAnalyze({ url: url.trim(), maxComments, sort })
  }

  const handleSelectSample = (sample) => {
    setUrl(sample.url)
    setTouchError(false)
    onAnalyze({ url: sample.url, maxComments: sample.data.video.total || 500, sort: 'top' })
  }

  const handleClear = () => {
    setUrl('')
    setTouchError(false)
  }

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 transition-colors">

      {/* Faint subtle decorative background blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-gradient-to-tr from-indigo-100/40 dark:from-indigo-900/20 via-purple-50/30 dark:via-purple-900/10 to-emerald-50/30 dark:to-emerald-900/10 blur-3xl rounded-full pointer-events-none -z-10" />

      {/* Expanded wide container */}
      <div className="max-w-[1500px] w-full mx-auto px-4 sm:px-8 lg:px-12 text-center">

        {/* Research Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-[#131B2E] border border-indigo-100 dark:border-slate-800 shadow-xs mb-6 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-semibold text-ink dark:text-slate-200">
            DistilRoBERTa · <span className="text-indigo-600 dark:text-indigo-400 font-bold">77.57%</span> test accuracy · 3 classes
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-head text-ink dark:text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Know how the audience <span className="bg-gradient-to-r from-indigo-600 to-indigo-800 dark:from-indigo-400 dark:to-indigo-200 bg-clip-text text-transparent">really feels</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-normal">
          Paste any YouTube link and get instant, accurate 3-class sentiment intelligence powered by a fine-tuned transformer.
        </p>

        {/* Wide Input Box Card */}
        <form onSubmit={handleSubmit} className="mt-8 sm:mt-10 max-w-5xl mx-auto">
          <div className="bg-white dark:bg-[#131B2E] p-2 sm:p-2.5 rounded-2xl border border-indigo-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
            <div className="flex flex-col sm:flex-row items-center gap-2">

              <div className="relative flex-1 w-full flex items-center">
                <div className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none">
                  <Link2 className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value)
                    if (touchError) setTouchError(false)
                  }}
                  placeholder="Paste YouTube link (e.g. https://youtube.com/watch?v=...)"
                  className="w-full pl-12 pr-10 py-3.5 sm:py-4 text-sm sm:text-base text-ink dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-transparent rounded-xl focus:outline-none"
                  aria-label="YouTube Video Link"
                />
                {url && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    aria-label="Clear input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold text-sm sm:text-base rounded-xl transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 shrink-0 disabled:opacity-70 active:scale-[0.98]"
              >
                <span>Analyze</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          </div>

          {/* Validation Message */}
          {touchError && !isValid && (
            <p className="text-left text-xs text-rose-500 font-medium mt-2 pl-4 animate-fadeIn">
              Please enter a valid YouTube video URL (e.g., https://youtube.com/watch?v=... or youtu.be/...)
            </p>
          )}

          {/* Filter Pills & Options Row */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400 px-3">

            {/* Max Comments segmented pill */}
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-500 dark:text-slate-400">Max comments:</span>
              <div className="inline-flex p-1 bg-white dark:bg-[#131B2E] border border-indigo-100 dark:border-slate-800 rounded-xl shadow-2xs">
                {[100, 500, 1000].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setMaxComments(num)}
                    className={`px-3.5 py-1 rounded-lg text-xs font-semibold transition-all ${maxComments === num
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-slate-800'
                      }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-500 dark:text-slate-400">Sort:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-white dark:bg-[#131B2E] border border-indigo-100 dark:border-slate-800 rounded-xl px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs cursor-pointer"
              >
                <option value="top">Top comments</option>
                <option value="newest">Newest first</option>
              </select>
            </div>

          </div>

          {/* Sample Chips */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5 text-xs">
            <span className="text-slate-400 dark:text-slate-500 font-medium">Try a sample:</span>
            {SAMPLE_VIDEOS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="px-4 py-2 bg-white dark:bg-[#131B2E] hover:bg-indigo-50/70 dark:hover:bg-slate-800 border border-indigo-100 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-400 font-medium transition-all shadow-2xs flex items-center gap-2"
              >
                <Youtube className="w-3.5 h-3.5 text-rose-500" />
                <span>{sample.name}</span>
              </button>
            ))}
          </div>

        </form>

      </div>
    </section>
  )
}
