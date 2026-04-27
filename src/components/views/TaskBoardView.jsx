import { useMemo, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'

const columns = ['Not Started', 'In Progress', 'Completed']

function emptyForm() {
  return {
    title: '',
    dueDate: '',
    courseId: '',
    status: 'Not Started',
  }
}

function TaskBoardView({ tasks, setTasks, courses }) {
  const [draft, setDraft] = useState(emptyForm())
  const [editingId, setEditingId] = useState('')

  const groupedTasks = useMemo(
    () =>
      columns.reduce((acc, column) => {
        acc[column] = tasks.filter((task) => task.status === column)
        return acc
      }, {}),
    [tasks],
  )

  const onSubmit = (event) => {
    event.preventDefault()
    if (!draft.title || !draft.dueDate || !draft.courseId) return

    if (editingId) {
      setTasks((current) => current.map((task) => (task.id === editingId ? { ...task, ...draft } : task)))
      setEditingId('')
    } else {
      setTasks((current) => [...current, { id: `task-${crypto.randomUUID()}`, ...draft }])
    }
    setDraft(emptyForm())
  }

  const onDragStart = (event, taskId) => event.dataTransfer.setData('text/plain', taskId)
  const onDrop = (event, nextStatus) => {
    const taskId = event.dataTransfer.getData('text/plain')
    setTasks((current) => current.map((task) => (task.id === taskId ? { ...task, status: nextStatus } : task)))
  }

  const startEdit = (task) => {
    setEditingId(task.id)
    setDraft(task)
  }

  return (
    <section className="space-y-4">
      <article className="rounded-3xl bg-white p-5">
        <h2 className="text-lg font-semibold">{editingId ? 'Edit Task' : 'Add Task'}</h2>
        <form onSubmit={onSubmit} className="mt-4 grid gap-2 md:grid-cols-4">
          <input
            value={draft.title}
            onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
            placeholder="Task title"
            className="rounded-xl bg-[#f2f4f6] px-3 py-2 text-sm outline-none"
          />
          <input
            type="date"
            value={draft.dueDate}
            onChange={(event) => setDraft((current) => ({ ...current, dueDate: event.target.value }))}
            className="rounded-xl bg-[#f2f4f6] px-3 py-2 text-sm outline-none"
          />
          <select
            value={draft.courseId}
            onChange={(event) => setDraft((current) => ({ ...current, courseId: event.target.value }))}
            className="rounded-xl bg-[#f2f4f6] px-3 py-2 text-sm outline-none"
          >
            <option value="">Select course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#24389c] to-[#3f51b5] px-4 py-2 text-sm font-semibold text-white"
          >
            <Plus size={14} />
            {editingId ? 'Update Task' : 'Create Task'}
          </button>
        </form>
      </article>

      <article className="grid gap-4 xl:grid-cols-3">
        {columns.map((column) => (
          <div
            key={column}
            className="rounded-3xl bg-white p-4"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => onDrop(event, column)}
          >
            <h3 className="mb-3 font-semibold">{column}</h3>
            <div className="space-y-2">
              {groupedTasks[column].map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(event) => onDragStart(event, task.id)}
                  className="rounded-2xl bg-[#f2f4f6] p-3"
                >
                  <p className="font-medium">{task.title}</p>
                  <p className="mt-1 text-xs text-[#6b7280]">
                    {new Date(task.dueDate).toDateString()} •{' '}
                    {courses.find((course) => course.id === task.courseId)?.name || 'No Course'}
                  </p>
                  <div className="mt-3 flex gap-1">
                    <button
                      type="button"
                      onClick={() => startEdit(task)}
                      className="rounded-lg bg-white p-1.5 text-[#24389c]"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setTasks((current) => current.filter((item) => item.id !== task.id))}
                      className="rounded-lg bg-white p-1.5 text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </article>
    </section>
  )
}

export default TaskBoardView
