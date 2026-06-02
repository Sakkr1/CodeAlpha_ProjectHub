import mongoose, { Document } from 'mongoose';
export interface IProjectDoc extends Document {
    name: string;
    description: string;
    owner: mongoose.Types.ObjectId;
}
export declare const Project: mongoose.Model<IProjectDoc, {}, {}, {}, mongoose.Document<unknown, {}, IProjectDoc, {}, mongoose.DefaultSchemaOptions> & IProjectDoc & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IProjectDoc>;
//# sourceMappingURL=project.model.d.ts.map