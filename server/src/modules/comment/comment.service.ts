import { Comment } from './comment.model.js';
import { NotFoundError } from '../../shared/errors.js';

function toJSON(comment: any) {
  return {
    _id: comment._id.toString(),
    content: comment.content,
    task: comment.task.toString(),
    author: comment.author ? { _id: comment.author._id.toString(), name: comment.author.name } : { _id: '', name: 'Unknown' },
    createdAt: comment.createdAt,
  };
}

export async function listByTask(taskId: string) {
  const comments = await Comment.find({ task: taskId }).populate('author', 'name').sort({ createdAt: 1 });
  return comments.map(c => toJSON(c));
}

export async function create(content: string, taskId: string, userId: string) {
  const comment = await (await Comment.create({ content, task: taskId, author: userId })).populate('author', 'name');
  return toJSON(comment);
}

export async function remove(commentId: string, userId: string) {
  const comment = await Comment.findOneAndDelete({ _id: commentId, author: userId });
  if (!comment) throw new NotFoundError('Comment');
}
