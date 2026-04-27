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

## GitHub Pages (GitHub Actions)

This repo includes `.github/workflows/deploy-pages.yml`, which:

- runs on every push to **`main`** or **`master`**
- runs `npm ci` and `npm run build`
- publishes the **`dist/`** output to GitHub Pages (you do not pick `dist` in the Pages folder dropdown)

### One-time GitHub setup

1. Repo → **Settings** → **Pages**
2. Under **Build and deployment** → **Source**, choose **GitHub Actions** (not “Deploy from a branch”)
3. Push this workflow to your default branch; open the **Actions** tab and confirm the workflow succeeds
4. Your site URL is usually `https://<username>.github.io/<repository>/`

The build sets Vite `base` to `/<repository>/` automatically in CI so assets load under that path.

Optional: add repository secrets **`VITE_GEMINI_API_KEY`** and **`VITE_GEMINI_MODEL`** so the Study Planner can call Gemini from the deployed site (key is still visible in client JS).

## Gemini (Study Planner)

The API key is **not** stored in the repo. Use a local env file that Git ignores:

1. Copy `.env.example` to `.env.local`
2. Set `VITE_GEMINI_API_KEY=` to your key from [Google AI Studio](https://aistudio.google.com/apikey)
3. Restart `npm run dev`

Optional: `VITE_GEMINI_MODEL` (defaults to `gemini-2.0-flash`).

**GitHub Pages / CI:** `VITE_*` variables are baked in at build time. To ship a key with Actions, add a repository secret named `VITE_GEMINI_API_KEY` and pass it as an environment variable on the `npm run build` step (never commit the value).

**Limits:** the app allows **5 successful Gemini generations per calendar day** per browser profile (localStorage). Editable system context is stored only in **localStorage** on the device.

**Security note:** any `VITE_` key is visible in the downloaded JavaScript bundle. For a course project this is often acceptable; for production you would proxy requests through your own backend.
