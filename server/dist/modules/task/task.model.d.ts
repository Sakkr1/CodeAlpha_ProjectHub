import mongoose, { Document } from 'mongoose';
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
export declare const Task: mongoose.Model<ITaskDoc, {}, {}, {}, mongoose.Document<unknown, {}, ITaskDoc, {}, mongoose.DefaultSchemaOptions> & ITaskDoc & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ITaskDoc>;
//# sourceMappingURL=task.model.d.ts.map