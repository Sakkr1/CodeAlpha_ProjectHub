import { Comment } from './comment.model.js';
import { NotFoundError } from '../../shared/errors.js';
function toJSON(comment) {
    return {
        _id: comment._id.toString(),
        content: comment.content,
        task: comment.task.toString(),
        author: comment.author ? { _id: comment.author._id.toString(), name: comment.author.name } : { _id: '', name: 'Unknown' },
        createdAt: comment.createdAt,
    };
}
export async function listByTask(taskId) {
    const comments = await Comment.find({ task: taskId }).populate('author', 'name').sort({ createdAt: 1 });
    return comments.map(c => toJSON(c));
}
export async function create(content, taskId, userId) {
    const comment = await (await Comment.create({ content, task: taskId, author: userId })).populate('author', 'name');
    return toJSON(comment);
}
export async function remove(commentId, userId) {
    const comment = await Comment.findOneAndDelete({ _id: commentId, author: userId });
    if (!comment)
        throw new NotFoundError('Comment');
}
//# sourceMappingURL=comment.service.js.map