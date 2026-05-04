import mongoose, { Schema } from "mongoose";

const PostSchema = new Schema({
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export const Post = mongoose.models.Post ?? mongoose.model("Post", PostSchema, "posts");