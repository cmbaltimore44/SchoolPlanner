import { useCallback, useMemo, useState } from 'react'
import Header from './components/Header'
import SearchResults from './components/SearchResults'
import Sidebar from './components/Sidebar'
import CalendarView from './components/views/CalendarView'
import CoursesView from './components/views/CoursesView'
import DashboardView from './components/views/DashboardView'
import StudyPlannerView from './components/views/StudyPlannerView'
import TaskBoardView from './components/views/TaskBoardView'
import { defaultCourses, defaultScheduleEvents, defaultTasks } from './data/defaultData'
import { useLocalStorage } from './hooks/useLocalStorage'
import { parseCoursesList, parseScheduleList, parseTasksList } from './utils/storageNormalize'

const VIEWS = {
  dashboard: 'dashboard',
  calendar: 'calendar',
  tasks: 'tasks',
  courses: 'courses',
  study: 'study',
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function App() {
  const [activeView, setActiveView] = useState(VIEWS.dashboard)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [focusCourseId, setFocusCourseId] = useState(null)
  const [calendarJumpDate, setCalendarJumpDate] = useState(null)

  const clearCourseFocus = useCallback(() => setFocusCourseId(null), [])
  const clearCalendarJump = useCallback(() => setCalendarJumpDate(null), [])

  const [tasks, setTasks] = useLocalStorage('schoolplanner_tasks', defaultTasks, parseTasksList)
  const [courses, setCourses] = useLocalStorage('schoolplanner_courses', defaultCourses, parseCoursesList)
  const [scheduleEvents, setScheduleEvents] = useLocalStorage(
    'schoolplanner_schedule',
    defaultScheduleEvents,
    parseScheduleList,
  )

  // Upcoming list is not filtered by search (search has its own results panel; filtering hid tasks before).
  const upcomingTasks = useMemo(
    () =>
      [...tasks]
        .filter((task) => task.status !== 'Completed')
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5),
    [tasks],
  )

  const userName = 'Cooper'
  const greeting = `${getGreeting()}, ${userName}`

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e]">
      <div className="mx-auto flex min-h-screen max-w-[1500px] gap-4 p-3 sm:p-5">
        <Sidebar
          isOpen={sidebarOpen}
          activeView={activeView}
          setActiveView={setActiveView}
          onToggle={() => setSidebarOpen((current) => !current)}
          onQuickAdd={() => setActiveView(VIEWS.tasks)}
        />

        <main className="min-w-0 flex-1 rounded-[2rem] bg-[#f2f4f6] p-4 sm:p-6">
          <Header
            greeting={greeting}
            activeView={activeView}
            onMenuClick={() => setSidebarOpen((current) => !current)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <SearchResults
            query={searchQuery}
            tasks={tasks}
            courses={courses}
            scheduleEvents={scheduleEvents}
            onSelectTask={() => {
              setActiveView(VIEWS.tasks)
            }}
            onSelectCourse={(id) => {
              setActiveView(VIEWS.courses)
              setFocusCourseId(id)
            }}
            onSelectCalendar={(dateKey) => {
              setActiveView(VIEWS.calendar)
              setCalendarJumpDate(dateKey)
            }}
          />

          <div className="mt-5">
            {activeView === VIEWS.dashboard && (
              <DashboardView
                tasks={tasks}
                courses={courses}
                scheduleEvents={scheduleEvents}
                upcomingTasks={upcomingTasks}
                onGoToCalendar={() => setActiveView(VIEWS.calendar)}
                onGoToTasks={() => setActiveView(VIEWS.tasks)}
              />
            )}
            {activeView === VIEWS.calendar && (
              <CalendarView
                tasks={tasks}
                scheduleEvents={scheduleEvents}
                courses={courses}
                jumpToDateKey={calendarJumpDate}
                onJumpHandled={clearCalendarJump}
              />
            )}
            {activeView === VIEWS.tasks && (
              <TaskBoardView tasks={tasks} setTasks={setTasks} courses={courses} />
            )}
            {activeView === VIEWS.courses && (
              <CoursesView
                courses={courses}
                tasks={tasks}
                setCourses={setCourses}
                setScheduleEvents={setScheduleEvents}
                focusCourseId={focusCourseId}
                onFocusCourseHandled={clearCourseFocus}
              />
            )}
            {activeView === VIEWS.study && (
              <StudyPlannerView setTasks={setTasks} setScheduleEvents={setScheduleEvents} />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
