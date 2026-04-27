const STATUSES = new Set(['Not Started', 'In Progress', 'Completed'])

export function normalizeTask(raw) {
  if (!raw || typeof raw !== 'object') return null
  return {
    id: typeof raw.id === 'string' ? raw.id : `task-${crypto.randomUUID()}`,
    title: String(raw.title != null ? raw.title : 'Untitled'),
    dueDate: String(raw.dueDate != null ? raw.dueDate : new Date().toISOString().split('T')[0]),
    courseId: String(raw.courseId != null ? raw.courseId : ''),
    status: STATUSES.has(raw.status) ? raw.status : 'Not Started',
  }
}

export function parseTasksList(parsed) {
  if (!Array.isArray(parsed) || parsed.length > 2000) return null
  const out = parsed.map((t) => normalizeTask(t)).filter(Boolean)
  return out
}

export function normalizeCourse(raw) {
  if (!raw || typeof raw !== 'object') return null
  // Legacy entries without this field: treat as repeating (previous behavior)
  const repeating = 'repeating' in raw ? raw.repeating === true : true
  return {
    id: typeof raw.id === 'string' ? raw.id : `course-${crypto.randomUUID()}`,
    name: String(raw.name != null ? raw.name : 'Course'),
    code: String(raw.code != null ? raw.code : ''),
    schedule: String(raw.schedule != null ? raw.schedule : ''),
    repeating,
  }
}

export function parseCoursesList(parsed) {
  if (!Array.isArray(parsed) || parsed.length > 500) return null
  return parsed.map((c) => normalizeCourse(c)).filter(Boolean)
}

export function normalizeScheduleEvent(raw) {
  if (!raw || typeof raw !== 'object') return null
  return {
    id: typeof raw.id === 'string' ? raw.id : `event-${crypto.randomUUID()}`,
    type: raw.type || 'class',
    title: String(raw.title != null ? raw.title : 'Event'),
    date: String(raw.date != null ? raw.date : new Date().toISOString().split('T')[0]),
    time: String(raw.time != null ? raw.time : '09:00'),
    courseId: raw.courseId ? String(raw.courseId) : undefined,
  }
}

export function parseScheduleList(parsed) {
  if (!Array.isArray(parsed) || parsed.length > 5000) return null
  return parsed.map((e) => normalizeScheduleEvent(e)).filter(Boolean)
}
