import { useState } from 'react'

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

    // Small delay so the "researching" animation shows before the fetch resolves
    await new Promise(r => setTimeout(r, 800))
    setState(s => ({ ...s, researching: false }))

    try {
      const res = await fetch('/api/roast', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ idea }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: res.statusText }))
        throw new Error(body.error ?? `${res.status}`)
      }

      const { raw } = await res.json()
      const data = tryParseData(raw)
      setState({ loading: false, researching: false, data, raw, error: null })
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
