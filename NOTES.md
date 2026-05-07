# Workshop notes — MongoDB, Mongoose, controllers, API

Study guide aligned with this repo’s layers: **connection → models → controllers → API → frontend**.

---

## 1. MongoDB (the database)

| Idea | Meaning |
|------|--------|
| **Database** | Named bucket on your cluster (e.g. from your URI path). |
| **Collection** | Group of documents — often compared to a “table,” but Mongo is **document-based**, not relational-first. |
| **Document** | One JSON-like record with fields. |

Relationships are **not** enforced by SQL foreign keys. You design links using **stored IDs** (e.g. `ObjectId` pointing at another document).

---

## 2. What is Mongoose?

**Mongoose** is an **ODM** (Object Document Mapper) for Node.js.

- Sits between your app code and MongoDB.
- You define **schemas** (shape + rules) and use **models** to read/write data with validation.
- Uses the same **`MONGODB_URI`** as the raw driver; you connect with **`mongoose.connect(uri)`**.

In this project, connection is centralized in [`lib/mongoose.ts`](lib/mongoose.ts).

---

## 3. One shared connection (`dbConnect`)

[`lib/mongoose.ts`](lib/mongoose.ts) exports **`dbConnect()`**, which:

1. Calls **`mongoose.connect(MONGODB_URI)`** once.
2. **Caches** the connection (including on `globalThis` in development so Next.js hot reload does not open unlimited connections).

**Rule:** Before using any model in controllers (or route handlers that touch the DB), **`await dbConnect()`**.

---

## 4. Models — Schema vs Model (syntax you use)

| Piece | Role |
|-------|------|
| **`Schema`** | Blueprint: field names, types, `required`, `unique`, `trim`, `timestamps`, etc. |
| **`mongoose.model(name, schema, collectionName)`** | Builds the **Model** — what you call with **`User.create()`**, **`Post.find()`**, etc. |
| **Third argument** (`"users"`, `"posts"`, …) | **Pins the MongoDB collection name** so it does not depend on automatic pluralization. |

### Next.js / hot reload pattern

```ts
mongoose.models.User ?? mongoose.model("User", UserSchema, "users");
```

- First load: register the model with **`mongoose.model`**.
- After a dev reload: **`mongoose.models.User`** already exists — **reuse** it to avoid “Cannot overwrite model” errors.

### `timestamps: true`

Adds **`createdAt`** and **`updatedAt`** on each document automatically.

---

## 5. Your models (this repo)

| Model | Collection | Purpose |
|-------|------------|--------|
| **`User`** | `users` | `name`, `email` (**unique**), `password` |
| **`Post`** | `posts` | `title`, `content`, **`userId`** → links to a user |
| **`Like`** | `likes` | **`userId`** + **`postId`** → who liked which post |
| **`Mango`** | `mangoes` | Demo inventory fields |

### References (`ref` + `ObjectId`)

In **`Post`** and **`Like`**, fields like:

```ts
userId: { type: Schema.Types.ObjectId, ref: "User", required: true }
```

mean: “store an **`ObjectId`** that points at a document in the **`User`** model’s collection.” That is how Mongoose expresses a **logical link** between collections.

**Teaching note:** In production, passwords should be **hashed** (e.g. bcrypt) and not returned from APIs.

[`models/index.ts`](models/index.ts) **re-exports** models for cleaner imports.

---

## 6. Controllers (`controllers/`)

Controllers are **plain async functions** that:

1. **`await dbConnect()`**
2. Call the appropriate **Model** (`create`, `find`, `findByIdAndUpdate`, …)
3. Return data or a structured result (e.g. `{ success, error, status }` — see [`controllers/users.ts`](controllers/users.ts))

**Why separate controllers from API routes?**

- **Routes** = HTTP: parse body, status codes, JSON response.
- **Controllers** = domain logic + database access.

Keeps each layer small and easier to test or reuse.

---

## 7. API routes (`app/api/`)

- Implement **`GET`**, **`POST`**, **`PATCH`**, **`DELETE`** as needed.
- Parse **`request.json()`**, call **controllers**, return **`NextResponse.json(..., { status })`**.
- **Browsers and React** should call these URLs — they should **not** import Mongoose directly.

---

## 8. Frontend

- Use **`fetch('/api/...')`** from Client Components (or Server Components if you prefer server-side `fetch` to your own origin).
- Only server-side code (routes + controllers + Mongoose) talks to MongoDB.

---

## 9. Build order (mental checklist)

1. **Atlas + URI** → `.env` (`MONGODB_URI`)
2. **`dbConnect`** → single Mongoose connection
3. **Schemas + models** → collections + validation + `ref`s where needed
4. **Seed** (optional) → [`npm run seed`](package.json)
5. **Controllers** → DB operations + rules
6. **API routes** → HTTP boundary
7. **UI** → call API only

---

## 10. Related files

| Layer | Location |
|-------|----------|
| Connection | [`lib/mongoose.ts`](lib/mongoose.ts) |
| Native driver (optional) | [`lib/db.ts`](lib/db.ts) |
| Models | [`models/`](models/) |
| Controllers | [`controllers/`](controllers/) |
| HTTP API | [`app/api/`](app/api/) |
| Example UI | [`app/mangoes/`](app/mangoes/) |

For setup commands and scripts, see [`README.md`](README.md).
