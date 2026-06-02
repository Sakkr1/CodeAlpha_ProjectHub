import mongoose, { Schema, Document } from 'mongoose';

export interface IProjectDoc extends Document {
  name: string;
  description: string;
  owner: mongoose.Types.ObjectId;
}

const projectSchema = new Schema<IProjectDoc>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProjectDoc>('Project', projectSchema);
