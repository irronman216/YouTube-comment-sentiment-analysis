// Mapping: 0 = negative, 1 = neutral, 2 = positive
export const LABEL_MAP = {
  0: { key: 'negative', label: 'Negative', color: '#F43F5E', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  1: { key: 'neutral', label: 'Neutral', color: '#F59E0B', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  2: { key: 'positive', label: 'Positive', color: '#10B981', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
}

export const SENTIMENT_COLORS = {
  positive: '#10B981',
  neutral: '#F59E0B',
  negative: '#F43F5E',
}

// Calculate sentiment score: -100 to +100
export function calculateSentimentScore(pos, neg, total) {
  if (!total || total === 0) return 0
  return Math.round(((pos - neg) / total) * 100)
}

// Get verdict string and styling based on net score
export function getVerdict(score) {
  if (score >= 40) {
    return {
      text: 'Overwhelmingly Positive',
      tone: 'pos',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      textCol: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800/60'
    }
  }
  if (score >= 15) {
    return {
      text: 'Mostly Positive',
      tone: 'pos',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      textCol: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800/60'
    }
  }
  if (score >= -10) {
    return {
      text: 'Mixed / Balanced',
      tone: 'neu',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      textCol: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800/60'
    }
  }
  if (score >= -35) {
    return {
      text: 'Mostly Negative',
      tone: 'neg',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      textCol: 'text-rose-700 dark:text-rose-400',
      border: 'border-rose-200 dark:border-rose-800/60'
    }
  }
  return {
    text: 'Overwhelmingly Negative',
    tone: 'neg',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    textCol: 'text-rose-700 dark:text-rose-400',
    border: 'border-rose-200 dark:border-rose-800/60'
  }
}

// Validate YouTube URL
export function validateYouTubeUrl(url) {
  if (!url || typeof url !== 'string') return false
  const trimmed = url.trim()
  const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  return ytRegex.test(trimmed)
}

// Extract Video ID
export function extractVideoId(url) {
  if (!url) return null
  const match = url.match(/(?:watch\?v=|youtu\.be\/|shorts\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

// Format numbers (e.g., 1400 -> 1.4K)
export function formatNumber(num) {
  if (num === undefined || num === null) return '0'
  return new Intl.NumberFormat('en-US').format(num)
}

// Export comments to CSV
export function exportToCsv(data, filename = 'youtube_sentiment_analysis.csv') {
  if (!data || !data.comments || data.comments.length === 0) return

  const headers = ['Comment Text', 'Sentiment', 'Confidence', 'Likes']
  const rows = data.comments.map(c => {
    const labelInfo = LABEL_MAP[c.label] || { label: 'Unknown' }
    const cleanText = `"${(c.text || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
    return [
      cleanText,
      labelInfo.label,
      `${(c.confidence * 100).toFixed(1)}%`,
      c.likes ?? 0
    ].join(',')
  })

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Demo Sample Data for instant preview & testing
export const SAMPLE_VIDEOS = [
  {
    id: 'sample-1',
    name: 'M3 MacBook Pro Review: 3 Months Later',
    url: 'https://www.youtube.com/watch?v=sampleM3MacBook',
    data: {
      video: {
        title: 'M3 Max MacBook Pro: The Honest Truth After 90 Days of Real Work',
        channel: 'TechPulse Reviews',
        thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
        total: 500
      },
      counts: {
        negative: 95,
        neutral: 145,
        positive: 260
      },
      avg_confidence: {
        negative: 0.82,
        neutral: 0.69,
        positive: 0.88
      },
      comments: [
        { text: "The battery life on this machine is literally sorcery. I coded for 14 hours straight on a flight without plugging in once!", label: 2, confidence: 0.98, likes: 342 },
        { text: "Space Black looks astonishingly good in person. Apple finally fixed the fingerprint problem compared to midnight blue.", label: 2, confidence: 0.95, likes: 215 },
        { text: "Upgraded from an M1 Pro and honestly for normal day-to-day video editing the export speed improvement is noticeable and worth it.", label: 2, confidence: 0.92, likes: 118 },
        { text: "Great video review as always Krish! Detailed breakdown of the thermal throttling under sustained Blender renders.", label: 2, confidence: 0.94, likes: 89 },
        { text: "Still deciding whether to get the 36GB unified RAM or jump straight to 64GB. Anyone with Xcode experience have advice?", label: 1, confidence: 0.74, likes: 45 },
        { text: "The screen notch still exists in 2024. Why can't we have a full bezel-less display or FaceID if the notch is that big?", label: 0, confidence: 0.88, likes: 154 },
        { text: "The price bump in Europe is completely absurd. 4000 euros for decent storage is just greed.", label: 0, confidence: 0.96, likes: 289 },
        { text: "It's fine if your company buys it for you. But for an individual freelancer, M2 Pro on discount makes way more economic sense.", label: 1, confidence: 0.65, likes: 92 },
        { text: "Ports selection is decent, but wish they kept USB-A or at least bundled an adapter in the box.", label: 1, confidence: 0.62, likes: 23 },
        { text: "Worst speaker grill design ever, accumulated dust within a week and impossible to clean.", label: 0, confidence: 0.89, likes: 67 },
        { text: "Screen brightness reaching 1600 nits in HDR is breathtaking when color grading in DaVinci Resolve.", label: 2, confidence: 0.96, likes: 140 },
        { text: "Does anyone know if dual external display output works with the lid closed on standard M3?", label: 1, confidence: 0.78, likes: 12 },
        { text: "Apple charging $200 for 8GB RAM upgrades in 2024 is pure Highway robbery.", label: 0, confidence: 0.97, likes: 412 },
        { text: "Solid incremental refresh. Nothing revolutionary over M2 Max, but outstanding if you are upgrading from Intel.", label: 1, confidence: 0.71, likes: 88 },
        { text: "Best laptop keyboard on the market right now. Key travel is perfection.", label: 2, confidence: 0.91, likes: 76 }
      ]
    }
  },
  {
    id: 'sample-2',
    name: 'AI Agent Frameworks: LangGraph vs AutoGen',
    url: 'https://www.youtube.com/watch?v=sampleAIFrameworks',
    data: {
      video: {
        title: 'Building Autonomous Multi-Agent Systems: Complete Architecture Breakdown',
        channel: 'Applied AI Labs',
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
        total: 350
      },
      counts: {
        negative: 45,
        neutral: 95,
        positive: 210
      },
      avg_confidence: {
        negative: 0.79,
        neutral: 0.72,
        positive: 0.89
      },
      comments: [
        { text: "This is easily the most lucid explanation of cyclic state machines in LangGraph on the entire internet. Subscribed!", label: 2, confidence: 0.99, likes: 520 },
        { text: "The diagram showing state persistence with Postgres checkpointing cleared up weeks of confusion for our team.", label: 2, confidence: 0.96, likes: 230 },
        { text: "Is the memory management in AutoGen still prone to prompt bloat during multi-turn chats?", label: 1, confidence: 0.75, likes: 38 },
        { text: "Tried running the GitHub repo and hit dependency conflicts with pydantic v1 vs v2. Documentation needs update.", label: 0, confidence: 0.91, likes: 64 },
        { text: "Both libraries have their trade-offs. LangGraph gives precise control, while AutoGen allows faster conversational prototyping.", label: 1, confidence: 0.81, likes: 110 },
        { text: "Way too complicated for a simple RAG pipeline. Everyone is over-engineering agents when a 20-line script does the job.", label: 0, confidence: 0.87, likes: 194 },
        { text: "Phenomenal production quality and real production code examples rather than just toy hello worlds. Kudos!", label: 2, confidence: 0.95, likes: 185 },
        { text: "Can you do a follow up covering human-in-the-loop breakpoint approval workflows?", label: 1, confidence: 0.70, likes: 72 }
      ]
    }
  }
]

