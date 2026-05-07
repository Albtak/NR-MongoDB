
import dbConnect from "@/lib/mongoose";
import { ProductData } from "@/lib/types";
import { Product } from "@/models";



 export async function getAllProducts() {
    try {
        await dbConnect();
        const products = await Product.find();
            return { success: true, products: products, status: 200};
        } catch (error) {
        console.error("Error fetching products:", error);
        return { success: false, error: "Failed to fetch products" , status: 500};
    }
 }

 export async function createProduct(product: ProductData) {
    try {
        await dbConnect();
        const newProduct = await Product.create(product);
        return { success: true, product: newProduct, status: 201};
    } catch (error) {
        console.error("Error creating product:", error);
        return { success: false, error: "Failed to create product" , status: 500};
    }
 }