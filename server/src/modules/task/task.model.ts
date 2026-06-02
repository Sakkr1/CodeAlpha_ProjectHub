import mongoose, { Schema, Document } from 'mongoose';

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface ITaskDoc extends Document {
  title: string;
  description: string;
  status: TaskStatus;
  project: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITaskDoc>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITaskDoc>('Task', taskSchema);
