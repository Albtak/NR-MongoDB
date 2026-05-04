import mongoose, { Schema } from "mongoose";

/**
 * Schema = shape + validation rules Mongoose applies before MongoDB.
 * Model = compiled Schema bound to a collection (here we pin collection name "mangoes").
 */
const MangoSchema = new Schema(
  {
    variety: { type: String, required: true, trim: true },
    qtyKg: { type: Number, required: true, min: 0 },
    pricePerKg: { type: Number, required: false, min: 0 },
  },
  { timestamps: true },
);

export const Mango =
  mongoose.models.Mango ??
  mongoose.model("Mango", MangoSchema, "mangoes");
