import mongoose, { Document } from 'mongoose';
export interface IUserDoc extends Document {
    email: string;
    password: string;
    name: string;
    theme: 'light' | 'dark';
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidate: string): Promise<boolean>;
}
export declare const User: mongoose.Model<IUserDoc, {}, {}, {}, mongoose.Document<unknown, {}, IUserDoc, {}, mongoose.DefaultSchemaOptions> & IUserDoc & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUserDoc>;
//# sourceMappingURL=auth.model.d.ts.map