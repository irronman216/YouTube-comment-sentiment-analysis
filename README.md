# SentimentLens — YouTube Comment Sentiment Analysis Frontend

> 3-Class Sentiment Classification (`Negative`, `Neutral`, `Positive`) powered by a partially fine-tuned **DistilRoBERTa** achieving **77.57% test accuracy** on balanced benchmarks.

Built for the **Introduction to Machine Learning (IML)** End-Semester Research Project by **Krish Prajapati** & **Avinash A**.

---

## 🎨 Theme & UI Stack

- **Theme:** *"Calm Sky"* (Off-white `#FAF9F6`, Deep Ink `#1E1B4B`, Indigo `#4F46E5`, Positive Emerald `#10B981`, Neutral Amber `#F59E0B`, Negative Rose `#F43F5E`)
- **Typography:** *Plus Jakarta Sans* (headings) & *Inter* (body) via Google Fonts
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS (custom border, shadow, and rounded radii design system)
- **Charts:** Recharts (Half-circle net sentiment gauge, Donut distribution, Volume breakdown bar chart, Horizontal model confidence bars, Engagement vs. sentiment bar chart)
- **Icons:** Lucide React

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Local Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```

---

## 🔗 Hugging Face Backend Sync

The frontend is built to operate immediately out of the box with sample videos and simulated demo mode, and can effortlessly connect to your live Hugging Face Space endpoint once deployed.

### How to Connect:
1. In the web app navbar, click the **Sync HF** / **Backend Sync** button.
2. Enter your Hugging Face Space URL (e.g. `https://username-sentimentlens.hf.space`).
3. Click **Test Connection** and then **Save Configuration**.
4. The app will immediately route inference requests to your deployed model!

### Expected Hugging Face Backend Contract:

#### Endpoint: `POST /analyze`
**Request Payload:**
```json
{
  "url": "https://www.youtube.com/watch?v=...",
  "max_comments": 500,
  "sort": "top"
}
```

**Response Payload:**
```json
{
  "video": {
    "title": "Video Title",
    "channel": "Channel Name",
    "thumbnail": "https://...",
    "total": 500
  },
  "counts": {
    "negative": 130,
    "neutral": 130,
    "positive": 240
  },
  "avg_confidence": {
    "negative": 0.81,
    "neutral": 0.66,
    "positive": 0.84
  },
  "comments": [
    {
      "text": "Great explanation!",
      "label": 2,
      "confidence": 0.94,
      "likes": 12
    }
  ]
}
```
*Note: Label mapping: `0 = Negative`, `1 = Neutral`, `2 = Positive`.*

---

## 📊 Experimental Ladder Summary

| Stage | Model Architecture | Features / Input | Val Accuracy | Test Accuracy |
| :--- | :--- | :--- | :--- | :--- |
| **Stage A** | Linear SGD / Logistic Regression | Frozen 384-d embeddings | 65.23% | — |
| **Stage B** | PyTorch MLP Head | Frozen 384-d embeddings | **71.12%** | — |
| **Stage C** | DistilRoBERTa (Top 3 of 6 layers fine-tuned) | Raw text tokens (seq len 128) | **77.31%** | **77.57%** |

