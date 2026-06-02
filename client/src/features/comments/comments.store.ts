import { create } from 'zustand';
import type { IComment } from '../../shared/types';

interface CommentsState {
  commentsByTask: Record<string, IComment[]>;
  setComments: (taskId: string, comments: IComment[]) => void;
  addComment: (taskId: string, comment: IComment) => void;
}

export const useCommentsStore = create<CommentsState>((set) => ({
  commentsByTask: {},
  setComments: (taskId, comments) => set((s) => ({ commentsByTask: { ...s.commentsByTask, [taskId]: comments } })),
  addComment: (taskId, comment) => set((s) => ({
    commentsByTask: { ...s.commentsByTask, [taskId]: [...(s.commentsByTask[taskId] || []), comment] },
  })),
}));
