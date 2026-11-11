import { SAMPLE_VIDEOS, extractVideoId } from './utils'

/**
 * BACKEND CONFIGURATION
 * Connected directly to your Hugging Face Space:
 * https://huggingface.co/spaces/Avinash159-159/yt-comment-sentiment-demo
 */
export const HUGGINGFACE_BACKEND_URL =
  import.meta.env.VITE_API_URL ||
  'https://avinash159-159-yt-comment-sentiment-demo.hf.space'

/**
 * Main Analyze Function
 * Queries the live DistilRoBERTa model on Hugging Face Spaces.
 */
export async function analyzeYouTube({ url, maxComments = 200, sort = 'top', onProgress }) {
  // Check if user clicked one of the instant pre-cached sample chips
  const matchedSample = SAMPLE_VIDEOS.find(s => s.url === url.trim())
  if (matchedSample) {
    return simulateMockAnalysis({ url, maxComments, onProgress, sampleData: matchedSample.data })
  }

  // Call the live Hugging Face Gradio Space
  try {
    return await callHuggingFaceBackend(url, maxComments, onProgress)
  } catch (err) {
    console.error('Hugging Face backend request failed:', err)
    throw new Error(err.message || 'Unable to connect to Hugging Face backend.')
  }
}

/**
 * Call the live Hugging Face Gradio backend
 */
async function callHuggingFaceBackend(url, maxComments = 200, onProgress) {
  // Gradio slider accepts between 10 and 500 comments
  const safeCount = Math.min(500, Math.max(10, Math.round(Number(maxComments) || 200)))
  const videoId = extractVideoId(url)

  if (onProgress) onProgress(0) // Step 0: Fetching comments from YouTube API

  const baseUrl = HUGGINGFACE_BACKEND_URL.trim().replace(/\/+$/, '')
  const callUrl = `${baseUrl}/gradio_api/call/analyze_video`

  // 1. Initiate job on Gradio endpoint
  const postRes = await fetch(callUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      data: [url.trim(), safeCount]
    })
  })

  if (!postRes.ok) {
    const errorText = await postRes.text().catch(() => '')
    throw new Error(`Failed to initiate backend job (${postRes.status}): ${errorText || 'Server error'}`)
  }

  const { event_id } = await postRes.json()
  if (!event_id) {
    throw new Error('Backend did not return an event ID.')
  }

  // Smooth UI progress stepper while the transformer processes
  if (onProgress) {
    setTimeout(() => onProgress(1), 700)  // Step 1: Cleaning text
    setTimeout(() => onProgress(2), 1800) // Step 2: Running DistilRoBERTa model
  }

  // 2. Fetch results from Gradio SSE stream
  const sseUrl = `${baseUrl}/gradio_api/call/analyze_video/${event_id}`
  const getRes = await fetch(sseUrl)

  if (!getRes.ok) {
    throw new Error(`Failed to fetch backend stream (${getRes.status})`)
  }

  const streamText = await getRes.text()

  let completeData = null
  let errorMessage = null

  const lines = streamText.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.startsWith('event: error')) {
      const nextDataLine = lines.slice(i).find(l => l.startsWith('data:'))
      if (nextDataLine) {
        try {
          const errObj = JSON.parse(nextDataLine.replace(/^data:\s*/, ''))
          errorMessage = errObj.error || errObj.message || JSON.stringify(errObj)
        } catch (_) {
          errorMessage = nextDataLine.replace(/^data:\s*/, '')
        }
      }
      break
    }

    if (line.startsWith('data:')) {
      try {
        const parsed = JSON.parse(line.replace(/^data:\s*/, ''))
        if (Array.isArray(parsed) && parsed.length >= 3) {
          completeData = parsed
        }
      } catch (_) {}
    }
  }

  if (errorMessage) {
    throw new Error(errorMessage)
  }

  if (!completeData) {
    throw new Error('Backend completed without returning results. The video may have comments disabled or restricted.')
  }

  if (onProgress) onProgress(3) // Step 3: Building charts

  const [summary, share, df] = completeData

  // Normalize dataframe comments: [comment, prediction, confidence, p_Negative, p_Neutral, p_Positive, likes]
  const rawRows = df?.data || []
  const comments = rawRows.map(row => {
    const text = String(row[0] || '')
    const pred = String(row[1] || '').toLowerCase()
    let label = 1 // neutral default
    if (pred === 'positive') label = 2
    else if (pred === 'negative') label = 0

    const confidence = typeof row[2] === 'number' ? Number(row[2].toFixed(3)) : 0.85
    const likes = typeof row[6] === 'number' ? row[6] : 0

    return {
      text,
      label,
      confidence,
      likes
    }
  })

  const negCount = summary.distribution?.Negative?.count ?? 0
  const neuCount = summary.distribution?.Neutral?.count ?? 0
  const posCount = summary.distribution?.Positive?.count ?? 0
  const totalAnalyzed = summary.comments_analyzed || comments.length || safeCount

  // Live YouTube thumbnail
  const thumbnail = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80'

  return {
    video: {
      title: summary.video_title || 'YouTube Video',
      channel: 'YouTube Video Analysis',
      thumbnail,
      total: totalAnalyzed
    },
    counts: {
      negative: negCount,
      neutral: neuCount,
      positive: posCount
    },
    avg_confidence: {
      negative: summary.distribution?.Negative?.avg_confidence ?? 0.81,
      neutral: summary.distribution?.Neutral?.avg_confidence ?? 0.72,
      positive: summary.distribution?.Positive?.avg_confidence ?? 0.85
    },
    comments
  }
}

/**
 * Fast simulated mock analysis for instant sample preview chips
 */
async function simulateMockAnalysis({ url, maxComments, onProgress, sampleData }) {
  if (onProgress) onProgress(0)
  await new Promise(r => setTimeout(r, 400))
  if (onProgress) onProgress(1)
  await new Promise(r => setTimeout(r, 400))
  if (onProgress) onProgress(2)
  await new Promise(r => setTimeout(r, 500))
  if (onProgress) onProgress(3)
  await new Promise(r => setTimeout(r, 300))

  return JSON.parse(JSON.stringify(sampleData))
}
