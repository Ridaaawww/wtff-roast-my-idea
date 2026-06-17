import { useState } from 'react'

// ── Lyzr agent ────────────────────────────────────────────────
const API_URL    = 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/'
const API_KEY    = (import.meta.env.VITE_LYZR_API_KEY    as string | undefined) ?? ''
const AGENT_ID   = (import.meta.env.VITE_LYZR_AGENT_ID   as string | undefined) ?? ''
const USER_ID    = (import.meta.env.VITE_LYZR_USER_ID    as string | undefined) ?? ''
const SESSION_ID = (import.meta.env.VITE_LYZR_SESSION_ID as string | undefined) ?? ''

// ── Tavily web research ───────────────────────────────────────
// Get a free key at tavily.com then add VITE_TAVILY_API_KEY to your .env
const TAVILY_KEY = (import.meta.env.VITE_TAVILY_API_KEY  as string | undefined) ?? ''
const TAVILY_URL = 'https://api.tavily.com/search'

interface TavilyResult   { title: string; content: string; url: string }
interface TavilyResponse { answer?: string; results?: TavilyResult[] }

async function tavilySearch(query: string, opts: Record<string, unknown> = {}): Promise<TavilyResponse> {
  const res = await fetch(TAVILY_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: TAVILY_KEY, query, search_depth: 'basic', max_results: 6, include_answer: true, ...opts }),
  })
  if (!res.ok) throw new Error('tavily ' + res.status)
  return res.json() as Promise<TavilyResponse>
}

async function researchIdea(idea: string): Promise<string> {
  if (!TAVILY_KEY) return ''
  const q = idea.slice(0, 220)

  try {
    const [market, signals] = await Promise.all([
      tavilySearch(`${q} startup competitors existing products market landscape`, {
        include_domains: [
          'techcrunch.com', 'producthunt.com', 'crunchbase.com',
          'g2.com', 'capterra.com', 'ycombinator.com', 'forbes.com',
        ],
      }),
      tavilySearch(`${q} startup criticism failure problems funding 2024 2025`, {
        include_domains: [
          'x.com', 'twitter.com', 'reddit.com', 'news.ycombinator.com',
          'techcrunch.com', 'theverge.com', 'wired.com',
        ],
      }),
    ])

    const parts: string[] = [
      '',
      '=== REAL INTERNET RESEARCH (you MUST reference these facts, names, and data in your roast) ===',
    ]

    if (market.answer) {
      parts.push(`Market overview: ${market.answer}`)
    }
    if (market.results?.length) {
      parts.push('Real existing competitors and products found on the web:')
      market.results.slice(0, 5).forEach(r => {
        parts.push(`  • ${r.title} — ${r.content.slice(0, 200)}`)
      })
    }

    if (signals.answer) {
      parts.push(`What people are saying (X, Reddit, HN): ${signals.answer}`)
    }
    if (signals.results?.length) {
      parts.push('Real news and community signals:')
      signals.results.slice(0, 4).forEach(r => {
        parts.push(`  • [${new URL(r.url).hostname}] ${r.title} — ${r.content.slice(0, 200)}`)
      })
    }

    parts.push('=== END RESEARCH — use REAL competitor names from above, cite actual market facts, reference real signals ===')
    return parts.join('\n')
  } catch {
    return ''
  }
}

// ── Types ─────────────────────────────────────────────────────
export interface RoastLine { emoji: string; text: string }
export interface Pivot     { title: string; description: string }

export interface RoastData {
  verdict:              string
  verdict_emoji:        string
  survival_probability: number
  roast_lines:          RoastLine[]
  competitors:          string[]
  cause_of_death:       string
  redeeming_quality:    string
  real_talk:            string
  pivots:               Pivot[]
}

export interface RoastState {
  loading:     boolean
  researching: boolean
  data:        RoastData | null
  raw:         string | null
  error:       string | null
}

// ── JSON output format ────────────────────────────────────────
const JSON_FORMAT = `

You are a brutal but honest startup analyst. Use the real research above — actual competitor names, real market data, real community signals — to ground every claim. Do not make up vague generic competitors; use the real ones found in the research.

Respond ONLY with a single valid JSON object — no markdown, no explanation, just raw JSON:
{
  "verdict": "2-5 WORD HARSH VERDICT IN CAPS",
  "verdict_emoji": "single emoji matching the verdict",
  "survival_probability": <integer 0-100>,
  "roast_lines": [
    {"emoji": "🔥", "text": "brutal one-liner referencing a real competitor or real market fact"},
    {"emoji": "💀", "text": "brutal one-liner grounded in real data"},
    {"emoji": "🗑️", "text": "brutal one-liner"},
    {"emoji": "⚰️", "text": "brutal one-liner"}
  ],
  "competitors": ["Real Competitor A", "Real Competitor B", "Real Competitor C"],
  "cause_of_death": "the single most likely reason this idea fails, grounded in real market evidence",
  "redeeming_quality": "one honest positive thing, if any",
  "real_talk": "3-4 sentences of honest analysis citing real market conditions, real competitor moves, or real community feedback found in the research",
  "pivots": [
    {"title": "Pivot direction name", "description": "5-8 word description"},
    {"title": "Pivot direction name", "description": "5-8 word description"},
    {"title": "Pivot direction name", "description": "5-8 word description"}
  ]
}`

// ── JSON parser ───────────────────────────────────────────────
function tryParseData(text: string): RoastData | null {
  try {
    const cleaned = text
      .replace(/^```(?:json)?\s*/m, '')
      .replace(/\s*```\s*$/m, '')
      .trim()
    const parsed = JSON.parse(cleaned)
    if (parsed && parsed.verdict && typeof parsed.survival_probability === 'number') {
      return parsed as RoastData
    }
    return null
  } catch {
    return null
  }
}

// ── Hook ──────────────────────────────────────────────────────
export function useRoast() {
  const [state, setState] = useState<RoastState>({
    loading:     false,
    researching: false,
    data:        null,
    raw:         null,
    error:       null,
  })

  const roast = async (idea: string) => {
    setState({ loading: true, researching: true, data: null, raw: null, error: null })

    let research = ''
    try {
      research = await researchIdea(idea)
    } catch {
      // silently skip research if it fails
    }

    setState(s => ({ ...s, researching: false }))

    try {
      const res = await fetch(API_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
        body: JSON.stringify({
          user_id:    USER_ID,
          agent_id:   AGENT_ID,
          session_id: SESSION_ID,
          message:    idea + research + JSON_FORMAT,
        }),
      })

      if (!res.ok) {
        const body = await res.text().catch(() => '')
        throw new Error(`${res.status}${body ? ': ' + body.slice(0, 120) : ''}`)
      }

      const response = await res.json()
      const reply =
        response.response       ??
        response.message        ??
        response.output         ??
        response?.data?.message ??
        (typeof response === 'string' ? response : JSON.stringify(response, null, 2))

      const data = tryParseData(reply)
      setState({ loading: false, researching: false, data, raw: reply, error: null })
    } catch (err) {
      setState({
        loading:     false,
        researching: false,
        data:        null,
        raw:         null,
        error:       err instanceof Error ? err.message : 'Something exploded. Try again.',
      })
    }
  }

  const reset = () => setState({ loading: false, researching: false, data: null, raw: null, error: null })

  return { ...state, roast, reset }
}
