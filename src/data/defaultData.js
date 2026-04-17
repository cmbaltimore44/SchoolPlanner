export const defaultCourses = [
  { id: 'course-1', name: 'Modern History', code: 'HIST 101', schedule: 'Mon/Wed 9:00 AM' },
  { id: 'course-2', name: 'Calculus II', code: 'MATH 202', schedule: 'Tue/Thu 10:30 AM' },
  { id: 'course-3', name: 'Chemistry Lab', code: 'CHEM LAB', schedule: 'Tue 2:00 PM' },
  { id: 'course-4', name: 'Digital Design', code: 'ART 130', schedule: 'Fri 11:00 AM' },
]

export const defaultTasks = [
  {
    id: 'task-1',
    title: 'Modern History Essay',
    dueDate: '2026-04-20',
    courseId: 'course-1',
    status: 'Not Started',
  },
  {
    id: 'task-2',
    title: 'Calculus Problem Set #4',
    dueDate: '2026-04-19',
    courseId: 'course-2',
    status: 'In Progress',
  },
  {
    id: 'task-3',
    title: 'Lab Report: Organic Synthesis',
    dueDate: '2026-04-18',
    courseId: 'course-3',
    status: 'Not Started',
  },
  {
    id: 'task-4',
    title: 'Design Moodboard Submission',
    dueDate: '2026-04-17',
    courseId: 'course-4',
    status: 'Completed',
  },
]

export const defaultScheduleEvents = [
  {
    id: 'event-1',
    type: 'class',
    title: 'Intro to Ethics',
    date: '2026-04-20',
    time: '09:00',
  },
  {
    id: 'event-2',
    type: 'class',
    title: 'Calculus II',
    date: '2026-04-21',
    time: '10:30',
  },
  {
    id: 'event-3',
    type: 'class',
    title: 'Chem Lab',
    date: '2026-04-21',
    time: '14:00',
  },
  {
    id: 'event-4',
    type: 'class',
    title: 'Seminar',
    date: '2026-04-24',
    time: '11:00',
  },
]
