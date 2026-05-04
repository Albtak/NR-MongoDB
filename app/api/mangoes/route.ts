import { NextResponse } from "next/server";
import * as mangoController from "@/controllers/mangoController";

/** Layer 4 — HTTP: list + create only. One doc = /api/mangoes/[id]. */

export async function GET() {
  try {
    const docs = await mangoController.listMangoes();
    return NextResponse.json(docs);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    if (
      !body ||
      typeof body !== "object" ||
      typeof (body as { variety?: unknown }).variety !== "string" ||
      typeof (body as { qtyKg?: unknown }).qtyKg !== "number"
    ) {
      return NextResponse.json(
        { error: "Body must include variety (string) and qtyKg (number)." },
        { status: 400 },
      );
    }
    const { variety, qtyKg, pricePerKg } = body as {
      variety: string;
      qtyKg: number;
      pricePerKg?: number;
    };
    const doc = await mangoController.createMango({
      variety,
      qtyKg,
      ...(pricePerKg !== undefined ? { pricePerKg } : {}),
    });
    return NextResponse.json(doc, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
