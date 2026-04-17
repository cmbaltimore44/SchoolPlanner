import { useEffect, useState } from 'react'

export function useLocalStorage(key, initialValue, isValid = () => true) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(key)
      if (!value) return initialValue
      const parsed = JSON.parse(value)
      return isValid(parsed) ? parsed : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    const nextValue = isValid(storedValue) ? storedValue : initialValue
    window.localStorage.setItem(key, JSON.stringify(nextValue))
  }, [initialValue, isValid, key, storedValue])

  return [storedValue, setStoredValue]
}
