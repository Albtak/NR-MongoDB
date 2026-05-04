# Database workshop — MongoDB + Next.js

This repo is a **small teaching stack** for a **non-relational (document) database**: connect once, define **models** (schemas bound to **collections**), optionally **seed** data, add **controllers** for logic, expose **HTTP APIs**, then build **frontend** that talks only to the API.

MongoDB does not use SQL tables or joins the way relational databases do. Think **collections** of **documents** (JSON-shaped records), with optional validation enforced in your app (here via **Mongoose** schemas).

## What you will learn (order of layers)

1. **Database setup** — Create a cluster (e.g. [MongoDB Atlas](https://www.mongodb.com/atlas)), create a database, note your **`MONGODB_URI`** (same string works for the native driver and Mongoose). Put it in `.env` as `MONGODB_URI=...`.

2. **One shared connection** — The server should open **one** pooled connection and reuse it across requests (especially important in Next.js with hot reload).
   - **Mongoose (ODM):** [`lib/mongoose.ts`](lib/mongoose.ts) — cached `mongoose.connect` for models and controllers.
   - **Native driver (optional):** [`lib/db.ts`](lib/db.ts) — shared `MongoClient` if you teach raw queries without Mongoose.

3. **Models** — [`models/`](models/) — Define **schemas** (fields, types, validation) and compile **models** that map to collection names (example: [`models/Mango.ts`](models/Mango.ts) → collection `mangoes`). [`models/index.ts`](models/index.ts) re-exports models for a single import surface.

4. **Seed** — [`scripts/seed.ts`](scripts/seed.ts) — Insert repeatable demo documents after models exist. Run once when the collection is empty:
   ```bash
   npm run seed
   ```

5. **Controllers** — [`controllers/`](controllers/) — Functions that call `dbConnect()` and use models (`find`, `create`, `findByIdAndUpdate`, etc.). Keeps route files thin and mirrors how larger backends separate “HTTP” from “business logic.”

6. **API** — [`app/api/`](app/api/) — Route handlers (`GET` / `POST` / `PATCH` / `DELETE`) that validate the request shape lightly and delegate to controllers (example: [`app/api/mangoes/route.ts`](app/api/mangoes/route.ts), [`app/api/mangoes/[id]/route.ts`](app/api/mangoes/[id]/route.ts)).

7. **Frontend (content / UI)** — Pages and client components that **`fetch` your own API** — not the database directly (example: [`app/mangoes/page.tsx`](app/mangoes/page.tsx), [`app/mangoes/MangoesClient.tsx`](app/mangoes/MangoesClient.tsx)).

Together this is a **full CRUD path** on a document database: Create, Read, Update, Delete through HTTP and UI.

## Scripts

| Command | Purpose |
|--------|---------|
| `npm run dev` | Start [Next.js](https://nextjs.org/) dev server → [http://localhost:3000](http://localhost:3000) |
| `npm run mongo:ping` | Smoke-test Atlas using the shared native helper ([`scripts/mongo-ping.ts`](scripts/mongo-ping.ts)) |
| `npm run seed` | Insert starter documents via Mongoose ([`scripts/seed.ts`](scripts/seed.ts)) |
| `npm run build` | Production build |

## Quick path for students

1. Create `.env` in the project root with `MONGODB_URI=your_connection_string`.
2. `npm install`
3. `npm run mongo:ping` — confirm connectivity.
4. `npm run seed` — optional starter data.
5. `npm run dev` — open [http://localhost:3000/mangoes](http://localhost:3000/mangoes) for the demo UI.

## Deploy

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying). Set `MONGODB_URI` in your host’s environment (never commit secrets).
