import { useCallback, useState } from 'react'
import { Bookmark, Settings2, Trash2, X } from 'lucide-react'
import { GEMINI_DAILY_PROMPT_LIMIT, getGeminiApiKey } from '../../config/studyPlannerGemini'
import { useGeminiDailyLimit } from '../../hooks/useGeminiDailyLimit'
import { useSavedStudyPlans } from '../../hooks/useSavedStudyPlans'
import { useStudyPlannerContext } from '../../hooks/useStudyPlannerContext'
import { fetchGeminiStudyPlan } from '../../services/geminiStudyPlan'

function parseDays(input) {
  const match = input.match(/(\d+)\s*day/i)
  return match ? Number(match[1]) : 5
}

/** Offline fallback when no API key is configured (same shape as Gemini output). */
function mockStudyPlan(assignmentInput) {
  const days = parseDays(assignmentInput)
  const dayRows = Array.from({ length: days }, (_, index) => ({
    day: index + 1,
    focus:
      index === 0
        ? 'Research and collect references'
        : index === days - 1
          ? 'Final review and submission prep'
          : 'Draft and refine core sections',
    duration: `${Math.max(1, 2 - Math.floor(index / 3))} hours`,
    checklist: ['Skim rubric', 'Block calendar time'],
  }))
  return {
    planTitle: 'Demo study plan (add API key for Gemini)',
    summary: 'This is local mock data. Set VITE_GEMINI_API_KEY in .env.local to call Gemini.',
    days: dayRows,
  }
}

function StudyPlannerView({ setTasks, setScheduleEvents }) {
  const [prompt, setPrompt] = useState('')
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [contextOpen, setContextOpen] = useState(false)
  const [draftContext, setDraftContext] = useState('')
  const [activeLibraryId, setActiveLibraryId] = useState(null)

  const { context, setContext, resetToDefault, defaultContext } = useStudyPlannerContext()
  const { plans: savedPlans, savePlan, removePlan } = useSavedStudyPlans()
  const { remaining, isExhausted, recordSuccess } = useGeminiDailyLimit()
  const hasApiKey = Boolean(getGeminiApiKey())

  const openContextEditor = () => {
    setDraftContext(context)
    setContextOpen(true)
  }

  const saveContext = () => {
    setContext(draftContext.trim() || defaultContext)
    setContextOpen(false)
  }

  const generatePlan = useCallback(async () => {
    if (!prompt.trim()) return
    setError('')
    if (hasApiKey && isExhausted) {
      setError(`Daily limit reached (${GEMINI_DAILY_PROMPT_LIMIT} generations per day in this browser).`)
      return
    }
    setLoading(true)
    try {
      if (hasApiKey) {
        const builtUserMessage = [
          'Student assignment / study request:',
          prompt.trim(),
          '',
          'Produce the study plan as JSON matching the schema you were given.',
        ].join('\n')
        const result = await fetchGeminiStudyPlan({
          systemContext: context,
          userPrompt: builtUserMessage,
        })
        setPlan(result)
        setActiveLibraryId(null)
        recordSuccess()
      } else {
        await new Promise((r) => setTimeout(r, 400))
        setPlan(mockStudyPlan(prompt))
        setActiveLibraryId(null)
      }
    } catch (err) {
      setPlan(null)
      setActiveLibraryId(null)
      setError(err?.message || 'Could not generate a plan.')
    } finally {
      setLoading(false)
    }
  }, [context, hasApiKey, isExhausted, prompt, recordSuccess])

  const saveAsTask = () => {
    if (!prompt.trim()) return
    setTasks((current) => [
      ...current,
      {
        id: `task-${crypto.randomUUID()}`,
        title: prompt,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        courseId: '',
        status: 'Not Started',
      },
    ])
  }

  const addToSchedule = () => {
    if (!plan?.days?.length) return
    const today = new Date()
    const newEvents = plan.days.map((item) => {
      const nextDay = new Date(today)
      nextDay.setDate(today.getDate() + item.day - 1)
      const y = nextDay.getFullYear()
      const m = String(nextDay.getMonth() + 1).padStart(2, '0')
      const d = String(nextDay.getDate()).padStart(2, '0')
      return {
        id: `event-${crypto.randomUUID()}`,
        type: 'assignment',
        title: `Study: ${item.focus}`,
        date: `${y}-${m}-${d}`,
        time: '16:00',
      }
    })
    setScheduleEvents((current) => [...current, ...newEvents])
  }

  const savePlanToLibrary = () => {
    if (!plan?.days?.length) return
    const newId = savePlan(prompt, plan)
    if (newId) setActiveLibraryId(newId)
    setError('')
  }

  const loadPlanFromLibrary = (entry) => {
    setPrompt(entry.prompt)
    setPlan(entry.plan)
    setActiveLibraryId(entry.id)
    setError('')
  }

  return (
    <section className="space-y-4 lg:grid lg:grid-cols-[1fr_320px] lg:items-start lg:gap-4">
      <div className="min-w-0 space-y-4">
      <article className="rounded-3xl bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">AI Study Planner</h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              Describe your assignment; Gemini returns a structured day-by-day JSON plan.
            </p>
          </div>
          <button
            type="button"
            onClick={openContextEditor}
            className="inline-flex items-center gap-2 rounded-xl bg-[#f2f4f6] px-3 py-2 text-sm font-medium text-[#374151] transition hover:bg-[#e5e7eb]"
          >
            <Settings2 size={16} />
            Adjust Gemini context
          </button>
        </div>

        <div className="mt-3 rounded-2xl bg-[#f2f4f6] px-4 py-3 text-sm text-[#4b5563]">
          {hasApiKey ? (
            <p>
              <span className="font-medium text-[#24389c]">
                {remaining}/{GEMINI_DAILY_PROMPT_LIMIT}
              </span>{' '}
              Gemini generations left today in this browser.
            </p>
          ) : (
            <p>
              <span className="font-medium text-amber-800">Demo mode:</span> no{' '}
              <code className="text-xs">VITE_GEMINI_API_KEY</code> found. Copy{' '}
              <code className="text-xs">.env.example</code> to <code className="text-xs">.env.local</code> and add
              your key from{' '}
              <a
                href="https://aistudio.google.com/apikey"
                className="text-[#24389c] underline"
                target="_blank"
                rel="noreferrer"
              >
                Google AI Studio
              </a>
              , then restart <code className="text-xs">npm run dev</code>.
            </p>
          )}
        </div>

        {error && (
          <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {error}
          </p>
        )}

        <textarea
          rows={4}
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Example: 10-page essay on the Industrial Revolution due in 5 days"
          className="mt-4 w-full rounded-2xl bg-[#f2f4f6] px-4 py-3 text-sm outline-none"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={generatePlan}
            disabled={loading || (hasApiKey && isExhausted)}
            className="rounded-xl bg-gradient-to-br from-[#24389c] to-[#3f51b5] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Generating…' : hasApiKey ? 'Generate with Gemini' : 'Generate (demo)'}
          </button>
          <button
            type="button"
            onClick={saveAsTask}
            className="rounded-xl bg-[#f2f4f6] px-4 py-2 text-sm font-medium text-[#374151]"
          >
            Save as Task
          </button>
          <button
            type="button"
            onClick={addToSchedule}
            className="rounded-xl bg-[#f2f4f6] px-4 py-2 text-sm font-medium text-[#374151]"
          >
            Add Plan to Calendar
          </button>
          <button
            type="button"
            onClick={savePlanToLibrary}
            disabled={!plan?.days?.length}
            className="inline-flex items-center gap-2 rounded-xl bg-[#f2f4f6] px-4 py-2 text-sm font-medium text-[#374151] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Bookmark size={16} />
            Save plan to library
          </button>
        </div>
      </article>

      <article className="rounded-3xl bg-white p-5">
        <h3 className="text-lg font-semibold">Generated Plan</h3>
        {plan ? (
          <div className="mt-4 space-y-3">
            {activeLibraryId && (
              <p className="text-xs font-medium text-emerald-700">Loaded from your saved library</p>
            )}
            <div className="rounded-2xl bg-[#f2f4f6] p-4">
              <p className="font-semibold text-[#24389c]">{plan.planTitle}</p>
              {plan.summary ? <p className="mt-2 text-sm text-[#4b5563]">{plan.summary}</p> : null}
            </div>
            <div className="space-y-2">
              {plan.days.map((item) => (
                <div key={item.day} className="rounded-2xl bg-[#f2f4f6] p-3">
                  <p className="font-medium">Day {item.day}</p>
                  <p className="text-sm text-[#4b5563]">{item.focus}</p>
                  <p className="text-xs text-[#6b7280]">Estimated: {item.duration}</p>
                  {item.checklist?.length > 0 && (
                    <ul className="mt-2 list-inside list-disc text-sm text-[#374151]">
                      {item.checklist.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-[#6b7280]">No plan generated yet.</p>
        )}
      </article>
      </div>

      <aside className="rounded-3xl bg-white p-5 lg:sticky lg:top-4">
        <h3 className="text-lg font-semibold">Saved study plans</h3>
        <p className="mt-1 text-xs text-[#6b7280]">
          Stored in this browser only (<code className="text-[10px]">localStorage</code>).
        </p>
        <div className="mt-4 max-h-[70vh] space-y-2 overflow-y-auto">
          {savedPlans.length === 0 ? (
            <p className="rounded-2xl bg-[#f2f4f6] p-3 text-sm text-[#6b7280]">
              No saved plans yet. Generate a plan, then use &quot;Save plan to library&quot;.
            </p>
          ) : (
            savedPlans.map((entry) => (
              <div
                key={entry.id}
                className={`rounded-2xl p-3 ${
                  activeLibraryId === entry.id ? 'bg-[#e8ecff]' : 'bg-[#f2f4f6]'
                }`}
              >
                <p className="line-clamp-2 font-medium text-[#191c1e]">{entry.plan.planTitle}</p>
                <p className="mt-1 text-xs text-[#6b7280]">
                  {new Date(entry.savedAt).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-[#4b5563]">{entry.prompt || '—'}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => loadPlanFromLibrary(entry)}
                    className="rounded-lg bg-white px-2 py-1 text-xs font-semibold text-[#24389c]"
                  >
                    Load
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      removePlan(entry.id)
                      if (activeLibraryId === entry.id) {
                        setActiveLibraryId(null)
                      }
                    }}
                    className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-xs font-medium text-red-600"
                    aria-label="Delete saved plan"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {contextOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 sm:items-center"
          role="presentation"
          onClick={() => setContextOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="study-context-title"
            className="max-h-[85vh] w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#f2f4f6] px-5 py-3">
              <h2 id="study-context-title" className="text-lg font-semibold">
                Gemini system context
              </h2>
              <button
                type="button"
                onClick={() => setContextOpen(false)}
                className="rounded-lg p-2 text-[#6b7280] hover:bg-[#f2f4f6]"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 overflow-y-auto p-5">
              <p className="text-sm text-[#6b7280]">
                This text is sent as the model&apos;s system instruction together with your assignment
                description. It is saved in this browser only (localStorage), not on GitHub.
              </p>
              <textarea
                rows={12}
                value={draftContext}
                onChange={(e) => setDraftContext(e.target.value)}
                className="w-full rounded-2xl bg-[#f2f4f6] px-4 py-3 font-mono text-xs leading-relaxed outline-none sm:text-sm"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={saveContext}
                  className="rounded-xl bg-gradient-to-br from-[#24389c] to-[#3f51b5] px-4 py-2 text-sm font-semibold text-white"
                >
                  Save context
                </button>
                <button
                  type="button"
                  onClick={() => setDraftContext(defaultContext)}
                  className="rounded-xl bg-[#f2f4f6] px-4 py-2 text-sm font-medium text-[#374151]"
                >
                  Reset text to default
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetToDefault()
                    setDraftContext(defaultContext)
                    setContextOpen(false)
                  }}
                  className="rounded-xl bg-[#f2f4f6] px-4 py-2 text-sm font-medium text-[#374151]"
                >
                  Restore default &amp; save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default StudyPlannerView
