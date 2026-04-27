import { Menu, Moon, Search } from 'lucide-react'

const pageTitles = {
  dashboard: 'Dashboard',
  calendar: 'Calendar',
  tasks: 'Task Manager',
  courses: 'Courses',
  study: 'AI Study Assistant',
}

function Header({ greeting, activeView, onMenuClick, searchQuery, onSearchChange }) {
  return (
    <header className="rounded-3xl bg-white/70 p-4 backdrop-blur-xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-xl bg-white p-2 text-[#24389c] shadow-sm lg:hidden"
          >
            <Menu size={18} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-[#6b7280]">{greeting}</p>
            <h1 className="text-2xl font-semibold tracking-tight">{pageTitles[activeView]}</h1>
          </div>
        </div>
        <div className="flex w-full min-w-0 items-center gap-2 rounded-2xl bg-[#f2f4f6] px-3 py-2 sm:max-w-md sm:flex-1">
          <Search size={16} className="shrink-0 text-[#6b7280]" />
          <input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search tasks, courses, calendar…"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            aria-label="Search all saved data"
          />
        </div>
        <div className="hidden justify-end sm:flex sm:shrink-0">
          <button type="button" className="rounded-xl bg-white p-2 text-[#4b5563]">
            <Moon size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
