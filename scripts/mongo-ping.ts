import clientPromise, { getDb } from "@/lib/db";

async function main() {
  const client = await clientPromise;
  const db = await getDb();

  await db.command({ ping: 1 });
  const cols = await db.listCollections().toArray();

  console.log("Connected OK (shared lib/db.ts).");
  console.log("Default database:", db.databaseName);
  console.log(
    "Collections:",
    cols.length ? cols.map((c) => c.name).join(", ") : "(none)",
  );

  await client.close();
}

main().catch((err) => {
  console.error("Connection failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
