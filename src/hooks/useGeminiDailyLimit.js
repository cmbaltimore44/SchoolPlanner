import { useCallback, useMemo, useState } from 'react'
import { GEMINI_DAILY_PROMPT_LIMIT } from '../config/studyPlannerGemini'

const STORAGE_KEY = 'schoolplanner_gemini_usage_v1'

function todayKey() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function readUsage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { date: todayKey(), count: 0 }
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed.date !== 'string' || typeof parsed.count !== 'number') {
      return { date: todayKey(), count: 0 }
    }
    return parsed
  } catch {
    return { date: todayKey(), count: 0 }
  }
}

/**
 * Tracks successful Gemini generations per calendar day (browser profile = "user").
 */
export function useGeminiDailyLimit() {
  const [usage, setUsage] = useState(() => readUsage())

  const { remaining, isExhausted } = useMemo(() => {
    const today = todayKey()
    const count = usage.date === today ? usage.count : 0
    const remaining = Math.max(0, GEMINI_DAILY_PROMPT_LIMIT - count)
    return { remaining, isExhausted: remaining <= 0 }
  }, [usage])

  const refresh = useCallback(() => {
    setUsage(readUsage())
  }, [])

  /** Call after a successful API response. */
  const recordSuccess = useCallback(() => {
    const today = todayKey()
    setUsage((prev) => {
      const base = prev.date === today ? prev.count : 0
      const next = { date: today, count: base + 1 }
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  return { remaining, isExhausted, recordSuccess, refresh }
}
