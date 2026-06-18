const LYZR_URL   = 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/'
const TAVILY_URL = 'https://api.tavily.com/search'

const LYZR_API_KEY    = process.env.LYZR_API_KEY    ?? ''
const LYZR_AGENT_ID   = process.env.LYZR_AGENT_ID   ?? ''
const LYZR_USER_ID    = process.env.LYZR_USER_ID    ?? ''
const LYZR_SESSION_ID = process.env.LYZR_SESSION_ID ?? ''
const TAVILY_KEY      = process.env.TAVILY_API_KEY   ?? ''

// ── Tavily research ───────────────────────────────────────────
async function tavilySearch(query: string, opts: Record<string, unknown> = {}) {
  const res = await fetch(TAVILY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: TAVILY_KEY, query, search_depth: 'basic', max_results: 6, include_answer: true, ...opts }),
  })
  if (!res.ok) throw new Error('tavily ' + res.status)
  return res.json() as Promise<{ answer?: string; results?: { title: string; content: string; url: string }[] }>
}

async function researchIdea(idea: string): Promise<string> {
  if (!TAVILY_KEY) return ''
  const q = idea.slice(0, 220)
  try {
    const [market, signals] = await Promise.all([
      tavilySearch(`${q} startup competitors existing products market landscape`, {
        include_domains: ['techcrunch.com', 'producthunt.com', 'crunchbase.com', 'g2.com', 'capterra.com', 'ycombinator.com', 'forbes.com'],
      }),
      tavilySearch(`${q} startup criticism failure problems funding 2024 2025`, {
        include_domains: ['x.com', 'twitter.com', 'reddit.com', 'news.ycombinator.com', 'techcrunch.com', 'theverge.com', 'wired.com'],
      }),
    ])

    const parts: string[] = ['', '=== REAL INTERNET RESEARCH (reference these facts, names, and data in your roast) ===']

    if (market.answer) parts.push(`Market overview: ${market.answer}`)
    if (market.results?.length) {
      parts.push('Real existing competitors and products:')
      market.results.slice(0, 5).forEach(r => parts.push(`  • ${r.title} — ${r.content.slice(0, 200)}`))
    }
    if (signals.answer) parts.push(`What people are saying (X, Reddit, HN): ${signals.answer}`)
    if (signals.results?.length) {
      parts.push('Real news and community signals:')
      signals.results.slice(0, 4).forEach(r => {
        try { parts.push(`  • [${new URL(r.url).hostname}] ${r.title} — ${r.content.slice(0, 200)}`) }
        catch { parts.push(`  • ${r.title} — ${r.content.slice(0, 200)}`) }
      })
    }
    parts.push('=== END RESEARCH — cite real competitor names and market facts in every claim ===')
    return parts.join('\n')
  } catch {
    return ''
  }
}

// ── JSON format instruction ───────────────────────────────────
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

// ── Handler ───────────────────────────────────────────────────
export default async function handler(
  req: { method: string; body: { idea?: string } },
  res: { status: (code: number) => { json: (data: unknown) => void }; json: (data: unknown) => void }
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const idea = req.body?.idea
  if (!idea || typeof idea !== 'string') {
    return res.status(400).json({ error: 'idea is required' })
  }

  const research = await researchIdea(idea)

  const lyzrRes = await fetch(LYZR_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': LYZR_API_KEY },
    body: JSON.stringify({
      user_id:    LYZR_USER_ID,
      agent_id:   LYZR_AGENT_ID,
      session_id: LYZR_SESSION_ID,
      message:    idea + research + JSON_FORMAT,
    }),
  })

  if (!lyzrRes.ok) {
    const body = await lyzrRes.text().catch(() => '')
    return res.status(502).json({ error: `Lyzr ${lyzrRes.status}${body ? ': ' + body.slice(0, 120) : ''}` })
  }

  const response = await lyzrRes.json()
  const raw =
    response.response       ??
    response.message        ??
    response.output         ??
    response?.data?.message ??
    (typeof response === 'string' ? response : JSON.stringify(response, null, 2))

  res.json({ raw })
}
