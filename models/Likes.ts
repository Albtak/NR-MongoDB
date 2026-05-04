import mongoose, { Schema } from "mongoose";

const LikeSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
}, { timestamps: true });

export const Like = mongoose.models.Like ?? mongoose.model("Like", LikeSchema, "likes");