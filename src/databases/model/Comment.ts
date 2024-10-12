import { Schema, model, Document } from "mongoose";

export interface IComment extends Document {
  postId: Schema.Types.ObjectId;
  content: string;
  fileUrl: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    content: { type: String, required: true },
    fileUrl: { type: String },
    author: { type: String, required: true },
  },
  { timestamps: true }
);

const Comment = model<IComment>("Comment", commentSchema);
export default Comment;
