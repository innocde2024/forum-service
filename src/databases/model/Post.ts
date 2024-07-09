import { Schema, model, Document } from "mongoose";

export interface IPost extends Document {
  content: string;
  author: string;
  fileUrl: string;
  topic: string;
  likes: Schema.Types.ObjectId[];
  comments: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    content: { type: String, required: true },
    fileUrl: { type: String, required: true },
    author: { type: String, required: true },
    topic: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "Like" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

const Post = model<IPost>("Post", postSchema);
export default Post;
