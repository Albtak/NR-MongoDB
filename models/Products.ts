import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema({

        name: { type: String, required: true, trim: true },
        category: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        description: { type: String, required: true, trim: true },
        image: { type: String, required: true, trim: true },
        stock: { type: Number, required: true, min: 0 },
    
}, { timestamps: true });

export const Product = mongoose.models.Product ?? mongoose.model("Product", ProductSchema, "products");