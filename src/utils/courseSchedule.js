const weekdayToIndex = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
}

export function parseTimeTo24Hour(timeText) {
  const match = timeText?.match?.(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
  if (!match) return '09:00'
  let hour = Number(match[1]) % 12
  const minute = match[2]
  const ampm = match[3].toUpperCase()
  if (ampm === 'PM') hour += 12
  return `${String(hour).padStart(2, '0')}:${minute}`
}

function weekdaysFromSchedule(schedule) {
  const dayMatches = schedule?.match?.(/Mon|Tue|Wed|Thu|Fri|Sat|Sun/g) || []
  return [...new Set(dayMatches)]
}

/** YYYY-MM-DD in local time */
export function toDateStringLocal(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function parseYmd(ymd) {
  const [y, m, d] = ymd.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/**
 * Recurring class events for a given calendar date, from courses with repeating: true.
 */
export function getRecurringClassEventsForDate(dateKey, courses) {
  const day = parseYmd(dateKey).getDay()
  const results = []
  for (const course of courses) {
    if (course.repeating !== true) continue
    const days = weekdaysFromSchedule(course.schedule)
    for (const token of days) {
      if (weekdayToIndex[token] === day) {
        const time = parseTimeTo24Hour(course.schedule)
        results.push({
          id: `recurring-${course.id}-${dateKey}`,
          type: 'class',
          title: course.name,
          courseId: course.id,
          date: dateKey,
          time,
          source: 'recurring',
        })
      }
    }
  }
  return results
}

/**
 * One-off calendar entries when the course is not repeating (next occurrence of each listed weekday).
 */
export function createOneOffCourseEvents(course) {
  const dayMatches = course.schedule?.match?.(/Mon|Tue|Wed|Thu|Fri|Sat|Sun/g) || []
  const uniqueDays = [...new Set(dayMatches)]
  const time = parseTimeTo24Hour(course.schedule)
  const today = new Date()
  const todayDow = today.getDay()
  return uniqueDays.map((dayToken) => {
    const targetDow = weekdayToIndex[dayToken]
    const delta = (targetDow - todayDow + 7) % 7
    const d = new Date(today)
    d.setDate(today.getDate() + delta)
    return {
      id: `event-${crypto.randomUUID()}`,
      type: 'class',
      title: course.name,
      courseId: course.id,
      date: toDateStringLocal(d),
      time,
      source: 'one-off',
    }
  })
}

/**
 * Merged class-like events (static + weekly recurring) and assignment rows (tasks + schedule rows).
 */
export function getEventsForDate(
  dateKey,
  { scheduleEvents, courses, tasksForDate },
) {
  const forDay = (scheduleEvents || []).filter((e) => e.date === dateKey)
  const staticClassLike = forDay
    .filter((e) => (e.type || 'class') !== 'assignment')
    .map((e) => ({ ...e, eventType: 'Class' }))

  const staticAssignmentLike = forDay
    .filter((e) => (e.type || 'class') === 'assignment')
    .map((e) => ({ ...e, id: e.id, eventType: 'Schedule', kind: e.type }))

  const recurring = getRecurringClassEventsForDate(dateKey, courses).map((e) => ({
    ...e,
    eventType: 'Class',
  }))

  const byKey = new Map()
  const add = (row) => {
    const k = `${row.date}|${row.time}|${row.title}`
    if (!byKey.has(k)) byKey.set(k, row)
  }
  staticClassLike.forEach(add)
  recurring.forEach(add)

  const taskAssignments = (tasksForDate || []).map((task) => ({
    id: task.id,
    title: task.title,
    time: 'Due',
    eventType: 'Assignment',
  }))

  return {
    classes: Array.from(byKey.values()),
    scheduleAssignments: staticAssignmentLike,
    taskAssignments,
  }
}
