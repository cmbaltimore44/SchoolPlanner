function DashboardView({ tasks, courses, scheduleEvents, upcomingTasks, onGoToCalendar, onGoToTasks }) {
  const completed = tasks.filter((task) => task.status === 'Completed').length
  const completionPct = tasks.length ? Math.round((completed / tasks.length) * 100) : 0

  return (
    <section className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
      <article className="rounded-3xl bg-white p-5">
        <h2 className="text-lg font-semibold">Workload Overview</h2>
        <div className="mt-5 flex items-center gap-6">
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-[#f2f4f6]">
            <div className="absolute inset-0 rounded-full border-[10px] border-[#24389c]/20" />
            <div
              className="absolute inset-0 rounded-full border-[10px] border-[#24389c] [clip-path:polygon(0_0,100%_0,100%_100%,0_100%)]"
              style={{ transform: `rotate(${(completionPct / 100) * 360}deg)` }}
            />
            <span className="text-lg font-semibold">{completionPct}%</span>
          </div>
          <div className="space-y-2 text-sm text-[#4b5563]">
            <p>Courses: {courses.length}</p>
            <p>Total Tasks: {tasks.length}</p>
            <p>Completed: {completed}</p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onGoToTasks}
                className="rounded-xl bg-gradient-to-br from-[#24389c] to-[#3f51b5] px-3 py-1.5 text-xs font-semibold text-white"
              >
                Manage Tasks
              </button>
            </div>
          </div>
        </div>
      </article>

      <article className="rounded-3xl bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Upcoming Tasks</h2>
          <span className="text-xs text-[#6b7280]">Sorted by date</span>
        </div>
        <div className="space-y-2">
          {upcomingTasks.length ? (
            upcomingTasks.map((task) => (
              <div key={task.id} className="rounded-2xl bg-[#f2f4f6] p-3">
                <p className="font-medium">{task.title}</p>
                <p className="mt-1 text-sm text-[#6b7280]">{new Date(task.dueDate).toDateString()}</p>
              </div>
            ))
          ) : (
            <p className="rounded-2xl bg-[#f2f4f6] p-3 text-sm text-[#6b7280]">No matching tasks found.</p>
          )}
        </div>
      </article>

      <article className="rounded-3xl bg-white p-5 xl:col-span-2">
        <h2 className="text-lg font-semibold">Weekly Class Schedule Preview</h2>
        <button
          type="button"
          onClick={onGoToCalendar}
          className="mt-2 rounded-xl bg-[#f2f4f6] px-3 py-1.5 text-xs font-semibold text-[#374151]"
        >
          Open Calendar
        </button>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => {
            const events = scheduleEvents.filter((event) =>
              new Date(event.date)
                .toLocaleDateString('en-US', { weekday: 'short' })
                .startsWith(day),
            )

            return (
              <div key={day} className="rounded-2xl bg-[#f2f4f6] p-3">
                <p className="mb-2 text-sm font-semibold text-[#24389c]">{day}</p>
                {events.length ? (
                  events.map((event) => (
                    <p key={event.id} className="mb-1 rounded-xl bg-white px-2 py-1 text-xs">
                      {event.time} {event.title}
                    </p>
                  ))
                ) : (
                  <p className="text-xs text-[#9ca3af]">No classes</p>
                )}
              </div>
            )
          })}
        </div>
      </article>
    </section>
  )
}

export default DashboardView
