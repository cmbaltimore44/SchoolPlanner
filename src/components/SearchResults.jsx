import { useMemo } from 'react'
import { BookOpen, Calendar, ListTodo } from 'lucide-react'
import { searchAllSaved } from '../utils/searchAll'

/**
 * Global search: tasks, courses, schedule, recurring course projections for labels.
 */
function SearchResults({ query, tasks, courses, scheduleEvents, onSelectTask, onSelectCourse, onSelectCalendar }) {
  const result = useMemo(
    () => searchAllSaved(query, { tasks, courses, scheduleEvents }),
    [query, tasks, courses, scheduleEvents],
  )

  if (!query?.trim()) {
    return null
  }

  const { taskRows, courseRows, eventRows, total } = result

  if (total === 0) {
    return <p className="mt-2 text-sm text-[#6b7280]">No matches for &quot;{query.trim()}&quot;.</p>
  }

  return (
    <div className="mt-3 max-h-72 space-y-3 overflow-y-auto rounded-2xl bg-[#f2f4f6] p-3">
      {taskRows.length > 0 && (
        <div>
          <p className="mb-2 flex items-center gap-1 text-xs font-semibold text-[#6b7280]">
            <ListTodo size={14} /> Tasks ({taskRows.length})
          </p>
          <ul className="space-y-1">
            {taskRows.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => onSelectTask(t.id)}
                  className="w-full rounded-xl bg-white px-3 py-2 text-left text-sm transition hover:shadow-[0_12px_40px_rgba(25,28,30,0.06)]"
                >
                  <span className="font-medium">{t.title}</span>
                  <span className="mt-0.5 block text-xs text-[#6b7280]">
                    {t.dueDate} · {t.status}
                    {t.courseLabel ? ` · ${t.courseLabel}` : ''}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {courseRows.length > 0 && (
        <div>
          <p className="mb-2 flex items-center gap-1 text-xs font-semibold text-[#6b7280]">
            <BookOpen size={14} /> Courses ({courseRows.length})
          </p>
          <ul className="space-y-1">
            {courseRows.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => onSelectCourse(c.id)}
                  className="w-full rounded-xl bg-white px-3 py-2 text-left text-sm transition hover:shadow-[0_12px_40px_rgba(25,28,30,0.06)]"
                >
                  <span className="font-medium">{c.name}</span>
                  <span className="mt-0.5 block text-xs text-[#6b7280]">
                    {c.code} · {c.schedule}
                    {c.repeating ? ' · Repeating weekly' : ''}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {eventRows.length > 0 && (
        <div>
          <p className="mb-2 flex items-center gap-1 text-xs font-semibold text-[#6b7280]">
            <Calendar size={14} /> Calendar ({eventRows.length})
          </p>
          <ul className="space-y-1">
            {eventRows.map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => onSelectCalendar(e.date)}
                  className="w-full rounded-xl bg-white px-3 py-2 text-left text-sm transition hover:shadow-[0_12px_40px_rgba(25,28,30,0.06)]"
                >
                  <span className="font-medium">{e.title}</span>
                  <span className="mt-0.5 block text-xs text-[#6b7280]">
                    {e.date} · {e.time}
                    {e.kind === 'class' ? ' · Class' : ' · ' + (e.type || 'Event')}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default SearchResults
