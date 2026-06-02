import mongoose, { Schema } from 'mongoose';
const taskSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
export const Task = mongoose.model('Task', taskSchema);
//# sourceMappingURL=task.model.js.map