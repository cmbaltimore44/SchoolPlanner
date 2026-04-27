import { getRecurringClassEventsForDate } from './courseSchedule'

function norm(s) {
  return String(s || '')
    .toLowerCase()
    .trim()
}

/**
 * Returns matching tasks, courses, and static + synthetic recurring events for search.
 */
export function searchAllSaved(query, { tasks, courses, scheduleEvents }) {
  const q = norm(query)
  if (!q) {
    return { taskRows: [], courseRows: [], eventRows: [], total: 0 }
  }

  const courseById = Object.fromEntries((courses || []).map((c) => [c.id, c]))

  const taskRows = (tasks || [])
    .filter((t) => {
      const courseLabel = courseById[t.courseId]?.name || courseById[t.courseId]?.code || ''
      const hay = norm(`${t.title} ${t.status} ${t.dueDate} ${t.courseId} ${courseLabel}`)
      return hay.includes(q)
    })
    .map((t) => ({
      id: t.id,
      title: t.title,
      dueDate: t.dueDate,
      status: t.status,
      courseLabel: courseById[t.courseId]?.name || courseById[t.courseId]?.code || '',
    }))

  const courseRows = (courses || []).filter((c) => {
    const hay = norm(
      `${c.name} ${c.code} ${c.schedule} ${c.repeating ? 'repeating weekly' : 'one time'}`,
    )
    return hay.includes(q)
  })

  // Static events
  const staticEventRows = (scheduleEvents || [])
    .filter((e) => {
      const hay = norm(`${e.title} ${e.date} ${e.time} ${e.type || ''} class assignment`)
      return hay.includes(q)
    })
    .map((e) => ({ ...e, kind: e.type || 'class' }))

  // Recurring: sample next 8 weeks of occurrences for any course with repeating
  const recurringMatches = []
  const start = new Date()
  for (let d = 0; d < 56; d++) {
    const day = new Date(start)
    day.setDate(start.getDate() + d)
    const y = day.getFullYear()
    const m = String(day.getMonth() + 1).padStart(2, '0')
    const da = String(day.getDate()).padStart(2, '0')
    const dateKey = `${y}-${m}-${da}`
    const evs = getRecurringClassEventsForDate(dateKey, courses || [])
    for (const e of evs) {
      const hay = norm(`${e.title} ${e.date} ${e.time} class`)
      if (hay.includes(q)) {
        recurringMatches.push({
          id: e.id,
          title: e.title,
          date: e.date,
          time: e.time,
          type: 'class',
          kind: 'class',
        })
      }
    }
  }
  const eventKeys = new Set()
  const eventRows = []
  for (const e of [...staticEventRows, ...recurringMatches]) {
    const k = `${e.id}|${e.date}`
    if (eventKeys.has(k)) continue
    eventKeys.add(k)
    eventRows.push(e)
  }

  const total = taskRows.length + courseRows.length + eventRows.length
  return { taskRows, courseRows, eventRows, total }
}
