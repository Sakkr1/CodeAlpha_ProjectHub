import mongoose, { Schema } from 'mongoose';
const commentSchema = new Schema({
    content: { type: String, required: true, maxlength: 5000 },
    task: { type: Schema.Types.ObjectId, ref: 'Task', required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
export const Comment = mongoose.model('Comment', commentSchema);
//# sourceMappingURL=comment.model.js.map