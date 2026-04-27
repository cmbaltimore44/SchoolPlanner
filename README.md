# School Planner

Modern React + Tailwind school planner app (Dashboard, Calendar, Task Kanban, Courses, AI Study Planner).

## Local Development

This project uses Vite, so **VS Code Live Preview/Live Server will not render source JSX directly**.

Use:

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

For production preview:

```bash
npm run build
npm run preview
```

## GitHub Pages (Automatic)

This repo includes `.github/workflows/deploy-gh-pages.yml`, which:

- builds on every push to `main`
- deploys `dist/` to GitHub Pages automatically

No ongoing terminal maintenance is needed after pushing changes.

### One-time GitHub setup

In your GitHub repo settings:

1. Go to **Settings > Pages**
2. Set **Source** to **GitHub Actions**

After that, each push to `main` redeploys the site.

## Gemini (Study Planner)

The API key is **not** stored in the repo. Use a local env file that Git ignores:

1. Copy `.env.example` to `.env.local`
2. Set `VITE_GEMINI_API_KEY=` to your key from [Google AI Studio](https://aistudio.google.com/apikey)
3. Restart `npm run dev`

Optional: `VITE_GEMINI_MODEL` (defaults to `gemini-2.0-flash`).

**GitHub Pages / CI:** `VITE_*` variables are baked in at build time. To ship a key with Actions, add a repository secret named `VITE_GEMINI_API_KEY` and pass it as an environment variable on the `npm run build` step (never commit the value).

**Limits:** the app allows **5 successful Gemini generations per calendar day** per browser profile (localStorage). Editable system context is stored only in **localStorage** on the device.

**Security note:** any `VITE_` key is visible in the downloaded JavaScript bundle. For a course project this is often acceptable; for production you would proxy requests through your own backend.
