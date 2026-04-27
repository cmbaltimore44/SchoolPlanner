import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { parseSavedStudyPlansList } from '../utils/savedStudyPlansParse'

const STORAGE_KEY = 'schoolplanner_saved_study_plans_v1'
const MAX_PLANS = 50

/**
 * All saved study plans live in one localStorage key (newest first).
 */
export function useSavedStudyPlans() {
  const [plans, setPlans] = useLocalStorage(STORAGE_KEY, [], parseSavedStudyPlansList)

  const savePlan = useCallback(
    (prompt, plan) => {
      if (!plan?.days?.length) return null
      const entry = {
        id: `saved-plan-${crypto.randomUUID()}`,
        savedAt: new Date().toISOString(),
        prompt: String(prompt || '').trim(),
        plan: {
          planTitle: plan.planTitle,
          summary: plan.summary || '',
          days: plan.days.map((d) => ({
            day: d.day,
            focus: d.focus,
            duration: d.duration,
            checklist: d.checklist || [],
          })),
        },
      }
      setPlans((prev) => [entry, ...prev].slice(0, MAX_PLANS))
      return entry.id
    },
    [setPlans],
  )

  const removePlan = useCallback(
    (id) => {
      setPlans((prev) => prev.filter((p) => p.id !== id))
    },
    [setPlans],
  )

  return { plans, savePlan, removePlan }
}
