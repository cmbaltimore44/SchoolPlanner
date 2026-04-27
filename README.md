# School Planner

A single-page **school planner** for keeping coursework organized in one place. It uses **React** and **Tailwind CSS** with a simple dashboard layout: a sidebar switches views, and the main panel updates to match.

## What it does

- **Dashboard** — Greeting, workload snapshot, upcoming tasks, and a quick look at the week’s schedule.
- **Calendar** — Week, month, or day grid; tap a date to see classes and assignment due dates together.
- **Tasks** — Kanban columns (Not Started, In Progress, Completed) with drag-and-drop, plus add/edit/delete.
- **Courses** — Course cards with schedule text; optional weekly repeat for calendar; tie tasks to a course.
- **Study AI** — Describe an assignment and get a structured day-by-day plan (Gemini when configured, otherwise a local demo). You can edit the model’s system context, save plans to a small in-browser library, and push study blocks onto the calendar.

## How it works (basics)

State for tasks, courses, and calendar events lives in **React** and is written to **`localStorage`**, so your data stays on this browser until you clear site data. There is no sign-in or server database—everything runs in the client after the app loads.
