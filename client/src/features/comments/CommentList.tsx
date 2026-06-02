import { useEffect, useState, FormEvent } from 'react';
import api from '../../api/client';
import { useCommentsStore } from './comments.store';
import { useSocket } from '../../hooks/useSocket';
import { useAuthStore } from '../auth/auth.store';

interface Props { taskId: string }

export default function CommentList({ taskId }: Props) {
  const { commentsByTask, setComments, addComment } = useCommentsStore();
  const comments = commentsByTask[taskId] || [];
  const [content, setContent] = useState('');
  const socketRef = useSocket();
  const user = useAuthStore((s) => s.user);
  const [live, setLive] = useState(false);

  useEffect(() => {
    api.get(`/tasks/${taskId}/comments`).then(({ data }) => setComments(taskId, data));
  }, [taskId, setComments]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.emit('join-task', taskId);
    setLive(true);

    const handler = (comment: any) => {
      if (comment.task === taskId) addComment(taskId, comment);
    };
    socket.on('comment:created', handler);

    return () => {
      socket.emit('leave-task', taskId);
      socket.off('comment:created', handler);
      setLive(false);
    };
  }, [taskId, socketRef, addComment]);

  const submitComment = (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    const socket = socketRef.current;
    if (socket) {
      socket.emit('comment:new', { taskId, content });
    } else {
      api.post(`/tasks/${taskId}/comments`, { content }).then(({ data }) => addComment(taskId, data));
    }
    setContent('');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-(--text-secondary) uppercase">Comments ({comments.length})</span>
        {live && <span className="flex items-center gap-1 text-xs text-(--success)"><span className="w-1.5 h-1.5 rounded-full bg-(--success) animate-pulse" /> Live</span>}
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {comments.length === 0 && (
          <p className="text-xs text-(--text-secondary) py-2 text-center">No comments yet. Start the conversation!</p>
        )}
        {comments.map((c) => (
          <div key={c._id} className="flex gap-2 animate-fade-in">
            <div className="w-6 h-6 rounded-full bg-(--accent-light) flex items-center justify-center text-[10px] font-semibold text-(--accent) shrink-0 mt-0.5">
              {c.author?.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-(--text-primary)">{c.author?.name || 'Unknown'}</span>
                <span className="text-[10px] text-(--text-secondary)">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-sm text-(--text-secondary) break-words">{c.content}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={submitComment} className="flex gap-3 items-end">
        <div className="flex-1">
          <input
            className="w-full rounded-lg border border-(--border) bg-(--bg-primary) px-4 py-2.5 text-sm outline-none focus:border-(--accent) focus:ring-1 focus:ring-(--accent) transition-colors placeholder:text-(--text-secondary)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
          />
        </div>
        <button
          type="submit"
          disabled={!content.trim()}
          className="rounded-lg bg-(--accent) text-white px-4 py-2.5 text-sm font-medium hover:bg-(--accent-hover) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
}
