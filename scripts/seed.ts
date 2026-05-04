import mongoose from "mongoose";
import { Mango } from "@/models/Mango";

/** Layer 2 — Seed sample documents (run after models exist). */

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Missing MONGODB_URI (use: node --env-file=.env …)");
  process.exit(1);
}
const MONGODB_URI = uri;

async function main() {
  await mongoose.connect(MONGODB_URI);

  const existing = await Mango.countDocuments();
  if (existing > 0) {
    console.log(`Seed skipped: collection already has ${existing} document(s).`);
    await mongoose.disconnect();
    return;
  }

  await Mango.insertMany([
    { variety: "Kent", qtyKg: 120, pricePerKg: 2.5 },
    { variety: "Tommy Atkins", qtyKg: 45, pricePerKg: 2.1 },
    { variety: "Honey Gold", qtyKg: 30 },
  ]);

  console.log("Seed complete: 3 mangoes inserted.");
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
