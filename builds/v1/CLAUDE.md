# Environment

You are building a small web application in this directory. It must run
without any human intervention after you finish.

- Stack: Next.js (App Router, TypeScript), SQLite through better-sqlite3
  and Drizzle ORM, Tailwind for styling, Vitest for tests. Do not add
  other frameworks.
- `npm install` then `npm run dev` must serve the app on the port in the
  `PORT` environment variable (default 3000).
- `npm run seed` must load `seed.json` from this directory into the
  database. Run it yourself before you finish so the app starts with data.
- The database file lives at `./data.db`.
- Work autonomously. Do not ask questions. Where the spec is silent, make a
  reasonable choice and move on.
- When you are done, print a short summary of what you built, how to run
  it, and anything you did not do.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
