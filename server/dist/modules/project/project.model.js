import mongoose, { Schema } from 'mongoose';
const projectSchema = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
}, { timestamps: true });
export const Project = mongoose.model('Project', projectSchema);
//# sourceMappingURL=project.model.js.map