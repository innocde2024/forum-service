import { Schema, model, Document } from "mongoose";

export interface ILike extends Document {
  postId: Schema.Types.ObjectId;
  userId: string;
  createdAt: Date;
}

const likeSchema = new Schema<ILike>({
  postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Like = model<ILike>("Like", likeSchema);
export default Like;
