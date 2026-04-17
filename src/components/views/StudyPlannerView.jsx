import { useState } from 'react'

function parseDays(input) {
  const match = input.match(/(\d+)\s*day/i)
  return match ? Number(match[1]) : 5
}

async function mockGeminiStudyPlan(assignmentInput) {
  const days = parseDays(assignmentInput)
  const plan = Array.from({ length: days }, (_, index) => ({
    day: index + 1,
    focus:
      index === 0
        ? 'Research and collect references'
        : index === days - 1
          ? 'Final review and submission prep'
          : 'Draft and refine core sections',
    duration: `${Math.max(1, 2 - Math.floor(index / 3))} hrs`,
  }))
  return new Promise((resolve) => {
    setTimeout(() => resolve(plan), 500)
  })
}

function StudyPlannerView({ setTasks, setScheduleEvents }) {
  const [prompt, setPrompt] = useState('')
  const [plan, setPlan] = useState([])
  const [loading, setLoading] = useState(false)

  const generatePlan = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    const generatedPlan = await mockGeminiStudyPlan(prompt)
    setPlan(generatedPlan)
    setLoading(false)
  }

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
    if (!plan.length) return
    const today = new Date()
    const newEvents = plan.map((item) => {
      const nextDay = new Date(today)
      nextDay.setDate(today.getDate() + item.day - 1)
      return {
        id: `event-${crypto.randomUUID()}`,
        type: 'assignment',
        title: `Study Block: ${item.focus}`,
        date: nextDay.toISOString().split('T')[0],
        time: '16:00',
      }
    })
    setScheduleEvents((current) => [...current, ...newEvents])
  }

  return (
    <section className="space-y-4">
      <article className="rounded-3xl bg-white p-5">
        <h2 className="text-lg font-semibold">AI Study Planner</h2>
        <p className="mt-1 text-sm text-[#6b7280]">
          Describe your assignment and generate a day-by-day plan.
        </p>
        <textarea
          rows={4}
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Example: 10-page essay due in 5 days"
          className="mt-4 w-full rounded-2xl bg-[#f2f4f6] px-4 py-3 text-sm outline-none"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={generatePlan}
            className="rounded-xl bg-gradient-to-br from-[#24389c] to-[#3f51b5] px-4 py-2 text-sm font-semibold text-white"
          >
            {loading ? 'Generating...' : 'Generate Study Plan'}
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
        </div>
      </article>

      <article className="rounded-3xl bg-white p-5">
        <h3 className="text-lg font-semibold">Generated Plan</h3>
        <div className="mt-4 space-y-2">
          {plan.length ? (
            plan.map((item) => (
              <div key={item.day} className="rounded-2xl bg-[#f2f4f6] p-3">
                <p className="font-medium">Day {item.day}</p>
                <p className="text-sm text-[#4b5563]">{item.focus}</p>
                <p className="text-xs text-[#6b7280]">Estimated time: {item.duration}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-[#6b7280]">No plan generated yet.</p>
          )}
        </div>
      </article>
    </section>
  )
}

export default StudyPlannerView
