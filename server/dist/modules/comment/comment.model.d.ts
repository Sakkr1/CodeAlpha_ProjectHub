import mongoose, { Document } from 'mongoose';
export interface ICommentDoc extends Document {
    content: string;
    task: mongoose.Types.ObjectId;
    author: mongoose.Types.ObjectId;
}
export declare const Comment: mongoose.Model<ICommentDoc, {}, {}, {}, mongoose.Document<unknown, {}, ICommentDoc, {}, mongoose.DefaultSchemaOptions> & ICommentDoc & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICommentDoc>;
//# sourceMappingURL=comment.model.d.ts.map