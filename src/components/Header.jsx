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
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl bg-white p-2 text-[#24389c] shadow-sm lg:hidden"
        >
          <Menu size={18} />
        </button>
        <div className="flex-1">
          <p className="text-sm text-[#6b7280]">{greeting}</p>
          <h1 className="text-2xl font-semibold tracking-tight">{pageTitles[activeView]}</h1>
        </div>
        <div className="hidden items-center gap-2 rounded-2xl bg-[#f2f4f6] px-3 py-2 md:flex">
          <Search size={16} className="text-[#6b7280]" />
          <input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search tasks or courses..."
            className="w-52 bg-transparent text-sm outline-none"
          />
        </div>
        <button type="button" className="rounded-xl bg-white p-2 text-[#4b5563]">
          <Moon size={18} />
        </button>
      </div>
    </header>
  )
}

export default Header
