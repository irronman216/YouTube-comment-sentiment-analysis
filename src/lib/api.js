import { SAMPLE_VIDEOS, extractVideoId } from './utils'

/**
 * BACKEND CONFIGURATION
 * Simply paste your Hugging Face Space URL below when ready (or define VITE_API_URL in .env).
 * Example: 'https://username-sentimentlens.hf.space'
 */
export const HUGGINGFACE_BACKEND_URL = import.meta.env.VITE_API_URL || ''

// Main Analyze Function
export async function analyzeYouTube({ url, maxComments = 500, sort = 'top', onProgress }) {
  const backendUrl = HUGGINGFACE_BACKEND_URL.trim().replace(/\/+$/, '')

  // 1. If backend URL is defined in the project, route to Hugging Face backend
  if (backendUrl) {
    try {
      if (onProgress) onProgress(0) // Fetching comments
      
      const response = await fetch(`${backendUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          url,
          max_comments: Number(maxComments),
          sort: sort
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || errorData.message || `Backend error: ${response.status}`)
      }

      const result = await response.json()
      return normalizeBackendResponse(result, maxComments)
    } catch (err) {
      console.warn('Backend request failed, checking demo fallback:', err)
      const isSample = SAMPLE_VIDEOS.some(s => s.url === url)
      if (!isSample) {
        throw new Error(`Failed to connect to backend (${backendUrl}): ${err.message}`)
      }
    }
  }

  // 2. Demo Engine (active by default until HF URL is configured, or when clicking sample chips)
  return simulateMockAnalysis({ url, maxComments, sort, onProgress })
}

// Simulate realistic 4-step loading with sample data
async function simulateMockAnalysis({ url, maxComments, sort, onProgress }) {
  // Step 0: Fetching comments
  if (onProgress) onProgress(0)
  await new Promise(r => setTimeout(r, 600))

  // Step 1: Cleaning text
  if (onProgress) onProgress(1)
  await new Promise(r => setTimeout(r, 500))

  // Step 2: Running model (DistilRoBERTa)
  if (onProgress) onProgress(2)
  await new Promise(r => setTimeout(r, 700))

  // Step 3: Building charts
  if (onProgress) onProgress(3)
  await new Promise(r => setTimeout(r, 400))

  // Check if matches known samples
  const matchedSample = SAMPLE_VIDEOS.find(s => s.url === url)
  if (matchedSample) {
    return JSON.parse(JSON.stringify(matchedSample.data))
  }

  // Dynamic simulation for any YouTube URL
  const videoId = extractVideoId(url) || 'dQw4w9WgXcQ'
  const total = Number(maxComments) || 500

  // Realistic sentiment distribution
  const posCount = Math.round(total * 0.52)
  const neuCount = Math.round(total * 0.28)
  const negCount = total - posCount - neuCount

  const baseComments = [
    { text: "This is easily the cleanest explanation I've seen on the topic. Invaluable resource!", label: 2, confidence: 0.97, likes: 412 },
    { text: "Outstanding breakdown of the transformer fine-tuning nuances. Saved me days of debugging.", label: 2, confidence: 0.95, likes: 289 },
    { text: "The audio quality around 4:20 was slightly muffled, but the content itself was top tier.", label: 1, confidence: 0.72, likes: 45 },
    { text: "Could you share the notebook and weights used for the Stage C benchmark?", label: 1, confidence: 0.68, likes: 88 },
    { text: "Still not convinced that an MLP head outperforms a simple linear probe in low-data regimes.", label: 1, confidence: 0.76, likes: 34 },
    { text: "Why is everyone using DistilRoBERTa when modern smaller quantized LLMs exist?", label: 0, confidence: 0.84, likes: 67 },
    { text: "Completely skipped over the data preprocessing pipeline. Disappointing lack of depth there.", label: 0, confidence: 0.92, likes: 145 },
    { text: "The visualization of the confusion matrix and middle-class leakage is brilliant.", label: 2, confidence: 0.96, likes: 198 },
    { text: "What learning rate did you use for the Adam optimizer on the encoder layers?", label: 1, confidence: 0.64, likes: 18 },
    { text: "Terrible presentation pace, skipped through half of it.", label: 0, confidence: 0.95, likes: 82 },
    { text: "Super crisp delivery and great visual slides. Subscribed!", label: 2, confidence: 0.98, likes: 310 },
    { text: "Interesting that test accuracy reached 77.57% on a 3-class balanced dataset.", label: 2, confidence: 0.91, likes: 73 }
  ]

  // Expand comments list
  const comments = []
  for (let i = 0; i < Math.min(total, 60); i++) {
    const template = baseComments[i % baseComments.length]
    comments.push({
      ...template,
      likes: Math.max(0, Math.floor(template.likes * (1 - (i * 0.015)))),
      confidence: Number((Math.min(0.99, template.confidence + (Math.random() * 0.04 - 0.02))).toFixed(2))
    })
  }

  return {
    video: {
      title: `Analysis of YouTube Video (${videoId})`,
      channel: 'Creator Channel',
      thumbnail: `https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80`,
      total
    },
    counts: {
      negative: negCount,
      neutral: neuCount,
      positive: posCount
    },
    avg_confidence: {
      negative: 0.82,
      neutral: 0.68,
      positive: 0.87
    },
    comments
  }
}

// Normalize incoming backend payload
function normalizeBackendResponse(res, requestedTotal) {
  if (!res) throw new Error('Empty response from backend')

  return {
    video: {
      title: res.video?.title || 'YouTube Video',
      channel: res.video?.channel || 'YouTube Channel',
      thumbnail: res.video?.thumbnail || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80',
      total: res.video?.total || res.comments?.length || requestedTotal || 0
    },
    counts: {
      negative: res.counts?.negative ?? 0,
      neutral: res.counts?.neutral ?? 0,
      positive: res.counts?.positive ?? 0
    },
    avg_confidence: {
      negative: res.avg_confidence?.negative ?? 0.8,
      neutral: res.avg_confidence?.neutral ?? 0.7,
      positive: res.avg_confidence?.positive ?? 0.85
    },
    comments: (res.comments || []).map(c => ({
      text: c.text || '',
      label: typeof c.label === 'number' ? c.label : (c.label === 'positive' ? 2 : c.label === 'neutral' ? 1 : 0),
      confidence: typeof c.confidence === 'number' ? c.confidence : 0.85,
      likes: c.likes ?? 0
    }))
  }
}
