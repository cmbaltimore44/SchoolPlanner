/**
 * Default system context for Gemini. Users can override in the Study Planner UI (stored in localStorage).
 * The model also receives a fixed JSON output schema (see STUDY_PLAN_RESPONSE_SCHEMA).
 */
export const DEFAULT_STUDY_SYSTEM_CONTEXT = `You are an academic study coach inside a school planner web app.

Your job: produce a practical, realistic study plan from the student's free-text description of an assignment or exam prep.

What you will receive from the user each time:
- A single message describing what they are working on (topic, length, deadline, constraints, anxiety level, etc.).

Rules:
- Be concise and actionable; prefer concrete steps over generic advice.
- Respect the timeline implied in the user's message; if unclear, assume about one week.
- Output MUST follow the JSON schema the app requests (structured output). No markdown outside JSON.
- Use the student's wording in planTitle when it helps them recognize the plan.`

/** Gemini REST `responseSchema` (subset of Schema). */
export const STUDY_PLAN_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    planTitle: {
      type: 'STRING',
      description: 'Short title for this study plan',
    },
    summary: {
      type: 'STRING',
      description: 'One or two sentences overview',
    },
    days: {
      type: 'ARRAY',
      description: 'Ordered day-by-day breakdown',
      items: {
        type: 'OBJECT',
        properties: {
          dayNumber: { type: 'INTEGER', description: '1-based day index in the plan' },
          focus: { type: 'STRING', description: 'Main objective for that day' },
          durationText: { type: 'STRING', description: 'Estimated time, e.g. "2 hours"' },
          checklist: {
            type: 'ARRAY',
            items: { type: 'STRING' },
            description: 'Optional bullet steps',
          },
        },
        required: ['dayNumber', 'focus', 'durationText'],
      },
    },
  },
  required: ['planTitle', 'days'],
}

export const GEMINI_DAILY_PROMPT_LIMIT = 5

export function getGeminiModelId() {
  return import.meta.env.VITE_GEMINI_MODEL?.trim() || 'gemini-2.0-flash'
}

export function getGeminiApiKey() {
  const key = import.meta.env.VITE_GEMINI_API_KEY
  return typeof key === 'string' && key.trim() ? key.trim() : ''
}
