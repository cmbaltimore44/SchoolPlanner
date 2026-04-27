import { useEffect, useState } from 'react'
import { DEFAULT_STUDY_SYSTEM_CONTEXT } from '../config/studyPlannerGemini'

const STORAGE_KEY = 'schoolplanner_study_system_context_v1'

export function useStudyPlannerContext() {
  const [context, setContext] = useState(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw != null && raw.trim()) return raw
    } catch {
      // ignore
    }
    return DEFAULT_STUDY_SYSTEM_CONTEXT
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, context)
    } catch {
      // ignore
    }
  }, [context])

  const resetToDefault = () => setContext(DEFAULT_STUDY_SYSTEM_CONTEXT)

  return { context, setContext, resetToDefault, defaultContext: DEFAULT_STUDY_SYSTEM_CONTEXT }
}
