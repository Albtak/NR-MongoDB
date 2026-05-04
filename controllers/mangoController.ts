import mongoose from "mongoose";
import dbConnect from "@/lib/mongoose";
import { Mango } from "@/models/Mango";

/** Layer 3 — Business logic + DB access (your “controllers”). API routes stay thin. */

export async function listMangoes(limit = 50) {
  await dbConnect();
  return Mango.find().sort({ createdAt: -1 }).limit(limit).lean();
}

export async function getMangoById(id: string) {
  await dbConnect();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Mango.findById(id).lean();
}

export async function createMango(input: {
  variety: string;
  qtyKg: number;
  pricePerKg?: number;
}) {
  await dbConnect();
  const doc = await Mango.create(input);
  return doc.toObject();
}

export async function updateMango(
  id: string,
  patch: Partial<{ variety: string; qtyKg: number; pricePerKg: number }>,
) {
  await dbConnect();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Mango.findByIdAndUpdate(id, patch, { new: true }).lean();
}

export async function deleteMango(id: string) {
  await dbConnect();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Mango.findByIdAndDelete(id).lean();
}
