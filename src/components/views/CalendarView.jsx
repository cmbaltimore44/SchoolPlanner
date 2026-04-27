import { useEffect, useMemo, useState } from 'react'
import { getEventsForDate, toDateStringLocal } from '../../utils/courseSchedule'

const modes = ['Month', 'Week', 'Day']

function CalendarView({ tasks, scheduleEvents, courses, jumpToDateKey, onJumpHandled }) {
  const [mode, setMode] = useState('Week')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(() => toDateStringLocal(new Date()))

  useEffect(() => {
    if (!jumpToDateKey) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedDate(jumpToDateKey)
    setCurrentDate(new Date(jumpToDateKey + 'T12:00:00'))
    onJumpHandled?.()
  }, [jumpToDateKey, onJumpHandled])

  const visibleDates = useMemo(() => {
    if (mode === 'Day') return [new Date(currentDate)]
    if (mode === 'Week') {
      const base = new Date(currentDate)
      const day = base.getDay()
      const monday = new Date(base)
      monday.setDate(base.getDate() - ((day + 6) % 7))
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday)
        d.setDate(monday.getDate() + i)
        return d
      })
    }

    const first = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const start = new Date(first)
    start.setDate(first.getDate() - first.getDay())
    return Array.from({ length: 35 }, (_, i) => {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      return d
    })
  }, [currentDate, mode])

  const selectedItems = useMemo(() => {
    const tasksForDay = tasks.filter((task) => task.dueDate === selectedDate)
    const { classes, scheduleAssignments, taskAssignments } = getEventsForDate(selectedDate, {
      scheduleEvents,
      courses,
      tasksForDate: tasksForDay,
    })
    return { classes, scheduleAssignments, taskAssignments }
  }, [selectedDate, scheduleEvents, tasks, courses])

  const movePeriod = (direction) => {
    setCurrentDate((current) => {
      const next = new Date(current)
      const amount = mode === 'Month' ? 30 : 7
      if (mode === 'Day') {
        next.setDate(current.getDate() + direction)
      } else {
        next.setDate(current.getDate() + amount * direction)
      }
      return next
    })
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <article className="rounded-3xl bg-white p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => movePeriod(-1)}
            className="rounded-xl bg-[#f2f4f6] px-3 py-2 text-sm text-[#4b5563]"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => movePeriod(1)}
            className="rounded-xl bg-[#f2f4f6] px-3 py-2 text-sm text-[#4b5563]"
          >
            Next
          </button>
          {modes.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMode(item)}
              className={`rounded-xl px-4 py-2 text-sm transition ${
                mode === item ? 'bg-[#24389c] text-white' : 'bg-[#f2f4f6] text-[#4b5563]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className={`grid gap-2 ${mode === 'Day' ? 'grid-cols-1' : 'grid-cols-7'}`}>
          {visibleDates.map((date) => {
            const dateKey = toDateStringLocal(date)
            const tasksForDay = tasks.filter((t) => t.dueDate === dateKey)
            const { classes } = getEventsForDate(dateKey, { scheduleEvents, courses, tasksForDay: [] })
            const classCount = classes.length
            const taskCount = tasksForDay.length
            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => setSelectedDate(dateKey)}
                className={`min-h-24 rounded-2xl p-3 text-left transition ${
                  selectedDate === dateKey ? 'bg-[#e8ecff]' : 'bg-[#f2f4f6] hover:bg-[#eef1f4]'
                }`}
              >
                <p className="text-sm font-semibold">{date.getDate()}</p>
                <div className="mt-2 space-y-1">
                  {!!classCount && (
                    <span className="inline-block rounded-md bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                      {classCount} classes
                    </span>
                  )}
                  {!!taskCount && (
                    <span className="ml-1 inline-block rounded-md bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                      {taskCount} assignments
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </article>

      <aside className="rounded-3xl bg-white p-5">
        <h3 className="text-lg font-semibold">Selected Day</h3>
        <p className="mt-1 text-sm text-[#6b7280]">{new Date(selectedDate + 'T12:00:00').toDateString()}</p>
        <div className="mt-4 space-y-2">
          {(() => {
            const rows = [
              ...selectedItems.classes.map((item) => (
                <div key={item.id} className="rounded-2xl bg-[#f2f4f6] p-3">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-[#6b7280]">Class {item.time ? `• ${item.time}` : ''}</p>
                </div>
              )),
              ...selectedItems.scheduleAssignments.map((item) => (
                <div key={item.id} className="rounded-2xl bg-[#f2f4f6] p-3">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-[#6b7280]">Scheduled · {item.time || ''}</p>
                </div>
              )),
              ...selectedItems.taskAssignments.map((item) => (
                <div key={item.id} className="rounded-2xl bg-[#f2f4f6] p-3">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-[#6b7280]">Assignment due</p>
                </div>
              )),
            ]
            if (!rows.length) {
              return (
                <p className="rounded-2xl bg-[#f2f4f6] p-3 text-sm text-[#6b7280]">
                  No classes or tasks for this day.
                </p>
              )
            }
            return rows
          })()}
        </div>
      </aside>
    </section>
  )
}

export default CalendarView
