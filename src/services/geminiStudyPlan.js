import {
  getGeminiApiKey,
  getGeminiModelId,
  STUDY_PLAN_RESPONSE_SCHEMA,
} from '../config/studyPlannerGemini'

/**
 * Calls Gemini generateContent with JSON schema. Throws on HTTP errors or invalid JSON.
 */
export async function fetchGeminiStudyPlan({ systemContext, userPrompt }) {
  const apiKey = getGeminiApiKey()
  if (!apiKey) {
    throw new Error('Missing VITE_GEMINI_API_KEY. Add it to .env.local (not committed).')
  }

  const model = getGeminiModelId()
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`

  const body = {
    systemInstruction: {
      parts: [{ text: systemContext }],
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }],
      },
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: STUDY_PLAN_RESPONSE_SCHEMA,
    },
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  let data
  try {
    data = await res.json()
  } catch {
    throw new Error('Invalid response from Gemini endpoint')
  }

  if (!res.ok) {
    const msg = data?.error?.message || JSON.stringify(data)
    throw new Error(msg || `Gemini request failed (${res.status})`)
  }

  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (typeof rawText !== 'string') {
    throw new Error('Unexpected Gemini response shape (no text part)')
  }

  let plan
  try {
    plan = JSON.parse(rawText)
  } catch {
    throw new Error('Model did not return valid JSON text')
  }

  return normalizeStudyPlan(plan)
}

export function normalizeStudyPlan(raw) {
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.days)) {
    throw new Error('Plan JSON missing required fields')
  }
  const planTitle = String(raw.planTitle || 'Study plan')
  const summary = typeof raw.summary === 'string' ? raw.summary : ''
  const days = raw.days.map((d, i) => ({
    day: Number(d.dayNumber) || i + 1,
    focus: String(d.focus || ''),
    duration: String(d.durationText || ''),
    checklist: Array.isArray(d.checklist) ? d.checklist.map(String) : [],
  }))
  return { planTitle, summary, days }
}
