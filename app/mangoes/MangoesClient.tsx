"use client";

import { useCallback, useEffect, useState } from "react";

type Mango = {
  _id: string;
  variety: string;
  qtyKg: number;
  pricePerKg?: number;
  createdAt?: string;
};

/** Layer 5 — UI calls the API only (not controllers/models directly). */

export default function MangoesClient() {
  const [items, setItems] = useState<Mango[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [variety, setVariety] = useState("");
  const [qtyKg, setQtyKg] = useState("");
  const [pricePerKg, setPricePerKg] = useState("");

  const load = useCallback(async () => {
    setError(null);
    const res = await fetch("/api/mangoes");
    if (!res.ok) {
      setError(await res.text());
      return;
    }
    setItems(await res.json());
  }, []);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const qty = Number(qtyKg);
    const price =
      pricePerKg.trim() === "" ? undefined : Number(pricePerKg);
    const body: { variety: string; qtyKg: number; pricePerKg?: number } = {
      variety: variety.trim(),
      qtyKg: qty,
    };
    if (price !== undefined && !Number.isNaN(price)) body.pricePerKg = price;

    const res = await fetch("/api/mangoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(typeof data.error === "string" ? data.error : await res.text());
      return;
    }
    setVariety("");
    setQtyKg("");
    setPricePerKg("");
    await load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this row?")) return;
    setError(null);
    const res = await fetch(`/api/mangoes/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(typeof data.error === "string" ? data.error : await res.text());
      return;
    }
    await load();
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-12">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Mangoes (full stack flow)
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Models → seed → controllers → API → this page.
        </p>
      </header>

      <form
        onSubmit={handleCreate}
        className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
      >
        <h2 className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
          Add mango (POST /api/mangoes)
        </h2>
        <input
          className="rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900"
          placeholder="Variety"
          value={variety}
          onChange={(e) => setVariety(e.target.value)}
          required
        />
        <input
          className="rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900"
          placeholder="Qty (kg)"
          type="number"
          min={0}
          step="any"
          value={qtyKg}
          onChange={(e) => setQtyKg(e.target.value)}
          required
        />
        <input
          className="rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900"
          placeholder="Price per kg (optional)"
          type="number"
          min={0}
          step="any"
          value={pricePerKg}
          onChange={(e) => setPricePerKg(e.target.value)}
        />
        <button
          type="submit"
          className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Save
        </button>
      </form>

      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : null}

      <section>
        <h2 className="mb-3 text-sm font-medium text-zinc-800 dark:text-zinc-200">
          Inventory (GET /api/mangoes)
        </h2>
        {loading ? (
          <p className="text-sm text-zinc-500">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-zinc-500">
            No rows. Run{" "}
            <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">
              npm run seed
            </code>{" "}
            or add one above.
          </p>
        ) : (
          <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            {items.map((m) => (
              <li
                key={m._id}
                className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
              >
                <div>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {m.variety}
                  </span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {" "}
                    — {m.qtyKg} kg
                    {m.pricePerKg != null
                      ? ` @ $${m.pricePerKg}/kg`
                      : ""}
                  </span>
                </div>
                <button
                  type="button"
                  className="text-red-600 hover:underline dark:text-red-400"
                  onClick={() => handleDelete(m._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
