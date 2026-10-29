<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Standing Agent Rules for EduFlow

- Before building any feature, read the relevant file(s) in docs/ — especially STRUCTURE.md for file locations, API.md for endpoint contracts, and CONTRIBUTING.md for the component and API route templates, which must be followed exactly.
- Every file goes exactly where docs/STRUCTURE.md says. Never invent new folder structures.
- After completing each feature: verify it works in the browser, then commit with the commit format from docs/CONTRIBUTING.md.
- Never modify, log, or display values from .env.local. Never commit it.
- Never expose SUPABASE_SERVICE_ROLE_KEY to the browser — it stays server-side only, and any file importing it must never be a client component.
- Fix only what the current task asks. Do not refactor unrelated code.
- If an instruction in docs/ conflicts with a current library API, use the current API and note the deviation.
