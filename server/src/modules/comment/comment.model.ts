import mongoose, { Schema, Document } from 'mongoose';

export interface ICommentDoc extends Document {
  content: string;
  task: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
}

const commentSchema = new Schema<ICommentDoc>(
  {
    content: { type: String, required: true, maxlength: 5000 },
    task: { type: Schema.Types.ObjectId, ref: 'Task', required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Comment = mongoose.model<ICommentDoc>('Comment', commentSchema);
