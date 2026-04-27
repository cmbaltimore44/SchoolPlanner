import { useEffect, useState } from 'react'

/**
 * Persisted state. `parse` runs only when loading from localStorage to repair legacy shapes;
 * in-memory updates are stored as-is (avoids accidental resets from reference churn).
 */
export function useLocalStorage(key, defaultValue, parse) {
  const [state, setState] = useState(() => readKey(key, defaultValue, parse))

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state))
    } catch {
      // ignore
    }
  }, [key, state])

  return [state, setState]
}

function readKey(key, defaultValue, parse) {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw == null) return defaultValue
    const parsed = JSON.parse(raw)
    if (parse) {
      const out = parse(parsed)
      return out == null ? defaultValue : out
    }
    return parsed
  } catch {
    return defaultValue
  }
}
