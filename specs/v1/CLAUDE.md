# Environment

You are building a small web application in this directory. It must run
without any human intervention after you finish.

- Stack: Next.js (App Router, TypeScript), SQLite through better-sqlite3
  and Drizzle ORM, Tailwind for styling, Vitest for tests. Do not add
  other frameworks.
- `npm install` then `npm run dev` must serve the app on the port in the
  `PORT` environment variable (default 3000).
- Other servers belong to other people and run on this machine. If you
  start a server to test, pick a spare port, remember its PID, and stop it
  with `kill <pid>`. Never `pkill` or `killall` by name.
- `npm run seed` must load `seed.json` from this directory into the
  database. Run it yourself before you finish so the app starts with data.
- The database file lives at `./data.db`.
- Work autonomously. Do not ask questions. Where the spec is silent, make a
  reasonable choice and move on.
- When you are done, print a short summary of what you built, how to run
  it, and anything you did not do.
