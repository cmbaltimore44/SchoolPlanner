import {
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Sparkles,
  SquareCheckBig,
} from 'lucide-react'

const items = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'calendar', label: 'Calendar', icon: CalendarDays },
  { key: 'tasks', label: 'Tasks', icon: SquareCheckBig },
  { key: 'courses', label: 'Courses', icon: BookOpen },
  { key: 'study', label: 'Study AI', icon: Sparkles },
]

function Sidebar({ isOpen, activeView, setActiveView, onToggle, onQuickAdd }) {
  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } hidden rounded-[2.2rem] bg-[#f2f4f6] p-4 transition-all duration-300 lg:flex lg:flex-col`}
    >
      <div className="mb-7 flex items-center justify-between px-2">
        <div className={isOpen ? 'block' : 'hidden'}>
          <p className="font-semibold text-[#24389c]">School Study Planner</p>
          <p className="text-xs text-[#6b7280]">Academic Workspace</p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="rounded-xl bg-white p-2 text-[#24389c] transition hover:shadow-[0_12px_40px_rgba(25,28,30,0.06)]"
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = item.key === activeView
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveView(item.key)}
              className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                isActive
                  ? 'bg-white text-[#24389c] shadow-[0_12px_40px_rgba(25,28,30,0.06)]'
                  : 'text-[#4b5563] hover:bg-white/80'
              }`}
            >
              <Icon size={18} />
              <span className={isOpen ? 'block text-sm font-medium' : 'hidden'}>{item.label}</span>
            </button>
          )
        })}
      </nav>
      <button
        type="button"
        onClick={onQuickAdd}
        className="mt-auto rounded-2xl bg-gradient-to-br from-[#24389c] to-[#3f51b5] p-4 text-left text-white transition hover:shadow-[0_12px_40px_rgba(25,28,30,0.06)]"
      >
        <p className={isOpen ? 'text-sm font-semibold' : 'hidden'}>New Assignment</p>
        <p className={isOpen ? 'mt-1 text-xs text-white/80' : 'hidden'}>Stay on top of deadlines.</p>
      </button>
    </aside>
  )
}

export default Sidebar
