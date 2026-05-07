 import { NextResponse } from "next/server";
 import { createProduct } from "@/controllers/products";

 export async function POST(request: Request) {
    try {
        const body = await request.json();
        const product = await createProduct(body);
        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
 }