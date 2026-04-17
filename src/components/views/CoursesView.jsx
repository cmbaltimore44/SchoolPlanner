import { useMemo, useState } from 'react'

const weekdayMap = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
}

function parseTimeTo24Hour(timeText) {
  const match = timeText.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
  if (!match) return '09:00'
  let hour = Number(match[1]) % 12
  const minute = match[2]
  const ampm = match[3].toUpperCase()
  if (ampm === 'PM') hour += 12
  return `${String(hour).padStart(2, '0')}:${minute}`
}

function nextDateForWeekday(targetWeekday) {
  const current = new Date()
  const today = current.getDay()
  const delta = (targetWeekday - today + 7) % 7
  current.setDate(current.getDate() + delta)
  return current.toISOString().split('T')[0]
}

function createCourseEvents(course) {
  const dayMatches = course.schedule.match(/Mon|Tue|Wed|Thu|Fri|Sat|Sun/g) || []
  const uniqueDays = [...new Set(dayMatches)]
  const time = parseTimeTo24Hour(course.schedule)
  return uniqueDays.map((day) => ({
    id: `event-${crypto.randomUUID()}`,
    type: 'class',
    title: course.name,
    date: nextDateForWeekday(weekdayMap[day]),
    time,
  }))
}

function CoursesView({ courses, tasks, setCourses, setScheduleEvents, searchQuery }) {
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '')
  const [draft, setDraft] = useState({ name: '', code: '', schedule: '' })

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses
    return courses.filter((course) =>
      `${course.name} ${course.code} ${course.schedule}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    )
  }, [courses, searchQuery])

  const selectedTasks = useMemo(
    () =>
      tasks.filter((task) => {
        if (task.courseId !== selectedCourseId) return false
        if (!searchQuery.trim()) return true
        return task.title.toLowerCase().includes(searchQuery.toLowerCase())
      }),
    [searchQuery, selectedCourseId, tasks],
  )

  const addCourse = (event) => {
    event.preventDefault()
    if (!draft.name || !draft.code || !draft.schedule) return
    const newCourse = { id: `course-${crypto.randomUUID()}`, ...draft }
    setCourses((current) => [...current, newCourse])
    setScheduleEvents((current) => [...current, ...createCourseEvents(newCourse)])
    setSelectedCourseId(newCourse.id)
    setDraft({ name: '', code: '', schedule: '' })
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_340px]">
      <article className="rounded-3xl bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold">Course Cards</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {filteredCourses.map((course) => (
            <button
              key={course.id}
              type="button"
              onClick={() => setSelectedCourseId(course.id)}
              className={`rounded-3xl p-4 text-left transition ${
                selectedCourseId === course.id ? 'bg-[#e8ecff]' : 'bg-[#f2f4f6]'
              }`}
            >
              <p className="text-sm text-[#24389c]">{course.code}</p>
              <h3 className="mt-1 font-semibold">{course.name}</h3>
              <p className="mt-2 text-sm text-[#6b7280]">{course.schedule}</p>
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-[#f2f4f6] p-4">
          <h3 className="font-semibold">Assignments for selected course</h3>
          <div className="mt-3 space-y-2">
            {selectedTasks.length ? (
              selectedTasks.map((task) => (
                <div key={task.id} className="rounded-xl bg-white p-3">
                  <p className="font-medium">{task.title}</p>
                  <p className="text-xs text-[#6b7280]">
                    Due {new Date(task.dueDate).toDateString()} • {task.status}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#6b7280]">No tasks assigned to this course yet.</p>
            )}
          </div>
        </div>
      </article>

      <aside className="rounded-3xl bg-white p-5">
        <h3 className="text-lg font-semibold">Add Course</h3>
        <form onSubmit={addCourse} className="mt-4 space-y-2">
          <input
            placeholder="Course name"
            value={draft.name}
            onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
            className="w-full rounded-xl bg-[#f2f4f6] px-3 py-2 text-sm outline-none"
          />
          <input
            placeholder="Course code"
            value={draft.code}
            onChange={(event) => setDraft((current) => ({ ...current, code: event.target.value }))}
            className="w-full rounded-xl bg-[#f2f4f6] px-3 py-2 text-sm outline-none"
          />
          <input
            placeholder="Schedule (e.g., Mon/Wed 9:00 AM)"
            value={draft.schedule}
            onChange={(event) => setDraft((current) => ({ ...current, schedule: event.target.value }))}
            className="w-full rounded-xl bg-[#f2f4f6] px-3 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-br from-[#24389c] to-[#3f51b5] px-4 py-2 text-sm font-semibold text-white"
          >
            Save Course
          </button>
        </form>
      </aside>
    </section>
  )
}

export default CoursesView
