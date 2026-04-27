import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// In GitHub Actions, set base to /RepoName/ for https://<user>.github.io/<RepoName>/
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const useGithubPagesBase = process.env.GITHUB_ACTIONS === 'true' && repoName

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base:
    mode === 'production'
      ? useGithubPagesBase
        ? `/${repoName}/`
        : './'
      : '/',
  plugins: [react(), tailwindcss()],
}))
