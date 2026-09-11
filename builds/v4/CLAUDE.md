# Environment

You are building a small web application in this directory. It must run
without any human intervention after you finish.

- Stack: Next.js (App Router, TypeScript), SQLite through better-sqlite3
  and Drizzle ORM, Tailwind for styling, Vitest for tests, Playwright for
  end-to-end tests. Do not add other frameworks.
- `npm install` then `npm run dev` must serve the app on the port in the
  `PORT` environment variable (default 3000).
- `npm run seed` must load `seed.json` from this directory into the
  database. Run it yourself before you finish so the app starts with data.
- The database file lives at `./data.db`.
- Work autonomously. Do not ask questions. Where the spec is silent, make a
  reasonable choice and move on.
- When you are done, print a short summary of what you built, how to run
  it, and anything you did not do.

# Definition of done

- Every criterion under "Done when" in spec.md has at least one automated
  test that fails when the behaviour is removed.
- Provide `npm run typecheck`, `npm run lint`, `npm test` (Vitest) and
  `npm run test:e2e` (Playwright, chromium, against the dev server).
- Before you claim done, run every gate and paste each one's final line
  of output into your summary.
- If a gate cannot run in this environment (a browser is not installed
  and cannot be installed, a tool is denied, no network), do not skip it
  silently and do not claim done. Put a line `Waived: <gate> - <reason>`
  at the top of your summary and list which criteria are therefore
  unproven. A summary without a Waived line is a claim that every gate ran
  and passed.
- If a gate fails, fix the code, not the test. Never weaken, skip or
  delete an existing test to get a gate green.
