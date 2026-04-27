const MAX_PLANS = 50

function normalizeDay(d, index) {
  if (!d || typeof d !== 'object') return null
  return {
    day: Number(d.day) || index + 1,
    focus: String(d.focus || ''),
    duration: String(d.duration || ''),
    checklist: Array.isArray(d.checklist) ? d.checklist.map(String) : [],
  }
}

function normalizePlanShape(plan) {
  if (!plan || typeof plan !== 'object' || !Array.isArray(plan.days)) return null
  const days = plan.days.map((d, i) => normalizeDay(d, i)).filter(Boolean)
  if (!days.length) return null
  return {
    planTitle: String(plan.planTitle || 'Study plan'),
    summary: typeof plan.summary === 'string' ? plan.summary : '',
    days,
  }
}

/** Validates and repairs saved study plan entries from localStorage. */
export function parseSavedStudyPlansList(parsed) {
  if (!Array.isArray(parsed)) return null
  const out = []
  for (const row of parsed) {
    if (!row || typeof row !== 'object') continue
    const plan = normalizePlanShape(row.plan)
    if (!plan) continue
    out.push({
      id: typeof row.id === 'string' ? row.id : `saved-plan-${crypto.randomUUID()}`,
      savedAt: typeof row.savedAt === 'string' ? row.savedAt : new Date().toISOString(),
      prompt: String(row.prompt || ''),
      plan,
    })
  }
  return out
}
