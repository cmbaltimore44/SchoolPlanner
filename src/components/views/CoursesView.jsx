import { useEffect, useMemo, useState } from 'react'
import { createOneOffCourseEvents } from '../../utils/courseSchedule'

function CoursesView({
  courses,
  tasks,
  setCourses,
  setScheduleEvents,
  focusCourseId,
  onFocusCourseHandled,
}) {
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '')
  const [draft, setDraft] = useState({ name: '', code: '', schedule: '', repeating: false })

  useEffect(() => {
    if (!focusCourseId) return
    if (!courses.some((c) => c.id === focusCourseId)) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- apply focus from parent (search)
    setSelectedCourseId(focusCourseId)
    onFocusCourseHandled?.()
  }, [focusCourseId, courses, onFocusCourseHandled])

  const selectedTasks = useMemo(
    () => tasks.filter((task) => task.courseId === selectedCourseId),
    [selectedCourseId, tasks],
  )

  const addCourse = (event) => {
    event.preventDefault()
    if (!draft.name || !draft.code || !draft.schedule) return
    const newCourse = {
      id: `course-${crypto.randomUUID()}`,
      name: draft.name,
      code: draft.code,
      schedule: draft.schedule,
      repeating: draft.repeating,
    }
    setCourses((current) => [...current, newCourse])
    if (!newCourse.repeating) {
      setScheduleEvents((current) => [...current, ...createOneOffCourseEvents(newCourse)])
    }
    setSelectedCourseId(newCourse.id)
    setDraft({ name: '', code: '', schedule: '', repeating: false })
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_340px]">
      <article className="rounded-3xl bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold">Course Cards</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {courses.map((course) => (
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
              {course.repeating && (
                <p className="mt-1 text-xs text-emerald-700">Repeats every week</p>
              )}
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
          <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#f2f4f6] px-3 py-2 text-sm text-[#374151]">
            <input
              type="checkbox"
              checked={draft.repeating}
              onChange={(event) =>
                setDraft((current) => ({ ...current, repeating: event.target.checked }))
              }
              className="h-4 w-4 rounded border-[#cbd5e1] text-[#24389c] focus:ring-[#24389c]"
            />
            <span>Repeating weekly</span>
          </label>
          <p className="text-xs text-[#6b7280]">
            If not repeating, a one-time class is added on the next scheduled weekday.
          </p>
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
