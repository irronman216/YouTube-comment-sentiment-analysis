import React, { useState, useMemo } from 'react'
import { Search, ThumbsUp, Filter, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react'
import { LABEL_MAP, formatNumber } from '../lib/utils'

const PAGE_SIZE = 8

export default function CommentExplorer({ comments = [] }) {
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState('confidence_desc')
  const [page, setPage] = useState(1)

  const filteredComments = useMemo(() => {
    let result = [...comments]

    if (tab === 'positive') result = result.filter((c) => c.label === 2)
    else if (tab === 'neutral') result = result.filter((c) => c.label === 1)
    else if (tab === 'negative') result = result.filter((c) => c.label === 0)

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((c) => (c.text || '').toLowerCase().includes(q))
    }

    result.sort((a, b) => {
      if (sortOrder === 'confidence_desc') return (b.confidence || 0) - (a.confidence || 0)
      if (sortOrder === 'confidence_asc') return (a.confidence || 0) - (b.confidence || 0)
      if (sortOrder === 'likes_desc') return (b.likes || 0) - (a.likes || 0)
      return 0
    })

    return result
  }, [comments, tab, search, sortOrder])

  const totalPages = Math.max(1, Math.ceil(filteredComments.length / PAGE_SIZE))
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredComments.slice(start, start + PAGE_SIZE)
  }, [filteredComments, page])

  const handleTabChange = (newTab) => {
    setTab(newTab)
    setPage(1)
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  return (
    <div className="bg-white dark:bg-[#131B2E] border border-indigo-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-all">
      
      {/* Header Bar */}
      <div className="p-5 border-b border-indigo-50 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left: Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All', count: comments.length },
            { id: 'positive', label: 'Positive', count: comments.filter(c => c.label === 2).length },
            { id: 'neutral', label: 'Neutral', count: comments.filter(c => c.label === 1).length },
            { id: 'negative', label: 'Negative', count: comments.filter(c => c.label === 0).length },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                tab === item.id
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-indigo-50/70 dark:hover:bg-slate-700 hover:text-indigo-700 dark:hover:text-indigo-300'
              }`}
            >
              <span>{item.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                tab === item.id ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {item.count}
              </span>
            </button>
          ))}
        </div>

        {/* Right: Search and Sort */}
        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search comments..."
              className="w-full pl-10 pr-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 rounded-xl text-ink dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
            >
              <option value="confidence_desc">Highest Confidence</option>
              <option value="likes_desc">Most Likes</option>
              <option value="confidence_asc">Lowest Confidence</option>
            </select>
          </div>
        </div>

      </div>

      {/* Comment List */}
      <div className="divide-y divide-indigo-50/70 dark:divide-slate-800">
        {paginated.length === 0 ? (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40 text-indigo-400" />
            <p>No comments matched the filter or search criteria.</p>
          </div>
        ) : (
          paginated.map((comment, idx) => {
            const labelInfo = LABEL_MAP[comment.label] || LABEL_MAP[1]
            const confPct = Math.round((comment.confidence || 0.8) * 100)

            return (
              <div
                key={idx}
                className="p-4 sm:p-5 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Comment Text */}
                <p className="text-sm text-ink dark:text-slate-200 leading-relaxed font-normal flex-1">
                  {comment.text}
                </p>

                {/* Badges & Likes */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  {/* Likes */}
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{formatNumber(comment.likes)}</span>
                  </div>

                  {/* Sentiment Chip */}
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${labelInfo.bg} ${labelInfo.text} ${labelInfo.border} dark:bg-opacity-20`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    <span>{labelInfo.label}</span>
                    <span className="opacity-75 font-mono text-[11px]">{confPct}%</span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-indigo-50 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850/40 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div>
            Showing <strong className="text-ink dark:text-white">{(page - 1) * PAGE_SIZE + 1}</strong> to{' '}
            <strong className="text-ink dark:text-white">{Math.min(page * PAGE_SIZE, filteredComments.length)}</strong> of{' '}
            <strong className="text-ink dark:text-white">{filteredComments.length}</strong> comments
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-indigo-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:pointer-events-none hover:bg-indigo-50 dark:hover:bg-slate-700"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3.5 py-1.5 font-semibold text-ink dark:text-white bg-white dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 rounded-lg">
              {page} / {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-indigo-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:pointer-events-none hover:bg-indigo-50 dark:hover:bg-slate-700"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
