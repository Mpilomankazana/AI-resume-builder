# AI Resume Builder

An AI-powered resume builder for job seekers — graduates, career switchers, and professionals. Built for CapaCiTi's AI Skills Accelerator Programme (ASA 9).

Enter your details through a multi-step form, let Gemini draft a professional summary, optimize your bullet points, and suggest role-relevant skills — then preview the result live and export it.

## Features

- **Multi-step intake form** — personal details, experience, education, skills, and target role
- **AI-generated professional summary** — tone adapts for graduates (academic projects, energy) vs. career switchers (explicit transferable-skill framing)
- **Bullet point optimizer** — rewrites weak bullets into 3 ATS-ready variations using the XYZ formula (`Accomplished [X] as measured by [Y], by doing [Z]`)
- **Smart skill suggestions** — top 10 role-relevant skills, ranked with a reason for each
- **Live template preview** — Modern and Executive layouts, updating instantly as content changes
- **Export** — download the finished resume

## Responsible AI

- Input is capped at 5,000 characters and validated before it reaches the model
- Basic prompt-injection screening on user input (e.g. "ignore prior instructions")
- Prompts are grounded in what the user actually entered — no fabricated employers, dates, or qualifications
- All AI output is a draft for the user to review and edit, not a final answer

## Tech stack

- **Frontend:** React + TypeScript + Vite
- **Backend:** Node.js + Express (TypeScript), bundled with esbuild
- **AI:** Gemini API (`@google/genai`), model `gemini-3.5-flash`
- **Deployment:** Railway (Nixpacks build)

## Running locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and set your key:
   ```bash
   GEMINI_API_KEY=your_key_here
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```

## Building for production

```bash
npm run build   # builds the frontend with Vite, bundles the server with esbuild
npm run start   # serves the built app from dist/
```

The server reads its port from `process.env.PORT` (falling back to `3000` locally), and serves the built frontend as static files when `NODE_ENV=production`.

## Deploying to Railway

1. Push this repo to GitHub and connect it as a new Railway project (**Deploy from GitHub repo**)
2. Railway auto-detects Node.js via Nixpacks and uses the included `Procfile` (`web: npm run start`) to run the app after `npm run build`
3. In the **Variables** tab, set:
   - `GEMINI_API_KEY` — your Gemini API key
   - `NODE_ENV=production` — ensures the server serves the built frontend instead of booting Vite's dev middleware
4. Under **Settings → Networking**, generate a public domain — Railway maps it to whatever port the app binds to via `process.env.PORT`, so no manual port configuration is needed once the app is deployed correctly

## Project structure

```
server.ts                        Express server + /api/generate route (Gemini calls)
src/
  App.tsx                        Main app: form steps, state, template switching
  components/ResumePreview.tsx   Live resume preview (Modern & Executive templates)
  types.ts                       Shared TypeScript types
  demoData.ts                    Sample data for quick local testing
```

## API

### `POST /api/generate`

| Field | Type | Description |
|---|---|---|
| `task` | `"summary" \| "bullet" \| "skills"` | Which AI generation task to run |
| `data` | object | Task-specific input (see `server.ts` for the shape per task) |

Returns `{ result: ... }`, or `{ error: "..." }` on failure (missing API key, invalid task, oversized input, or a detected prompt-injection attempt).

## Roadmap

- Additional resume templates
- Persistent draft saving
- ATS match scoring against a pasted job description
- Multi-language support
