import { useEffect, useState } from 'react';
import { DndContext, useDraggable, useDroppable, DragOverlay, useSensor, useSensors, PointerSensor, closestCorners } from '@dnd-kit/core';
import api from '../../api/client';
import { useTasksStore } from './tasks.store';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useToastStore } from '../../components/ui/Toast';
import CommentList from '../comments/CommentList';
import type { TaskStatus, ITask } from '../../shared/types';

interface Props { projectId: string; readOnly?: boolean }

const statusConfig: Record<TaskStatus, { label: string; color: string; badge: string; light: string }> = {
  todo: { label: 'To Do', color: 'border-t-(--warning)', badge: 'bg-(--warning)/10 text-(--warning)', light: 'bg-amber-50 dark:bg-amber-900/10' },
  in_progress: { label: 'In Progress', color: 'border-t-(--accent)', badge: 'bg-(--accent-light) text-(--accent)', light: 'bg-blue-50 dark:bg-blue-900/10' },
  done: { label: 'Done', color: 'border-t-(--success)', badge: 'bg-(--success-light) text-(--success)', light: 'bg-green-50 dark:bg-green-900/10' },
};

function DroppableColumn({ status, count, children }: { status: TaskStatus; count: number; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl p-5 ${statusConfig[status].light} border border-(--border) transition-all duration-200 ${isOver ? 'ring-2 ring-(--accent) shadow-lg scale-[1.02]' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusConfig[status].badge}`}>{statusConfig[status].label}</span>
        <span className="text-xs text-(--text-secondary)">{count}</span>
      </div>
      <div className="space-y-2 min-h-[60px]">{children}</div>
    </div>
  );
}

function DraggableCard({ task, isExpanded, onToggle, onDelete }: {
  task: ITask; isExpanded: boolean; onToggle: () => void; onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task._id,
    data: { status: task.status, task },
  });
  const style = isDragging ? { opacity: 0.3 } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`rounded-lg border border-(--border) bg-(--bg-primary) transition-all duration-200 hover:shadow-sm ${statusConfig[task.status].color} border-t-2 animate-slide-up ${isDragging ? 'ring-2 ring-(--accent)/30' : ''}`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <span
              className={`text-sm font-medium cursor-pointer hover:text-(--accent) transition-colors ${task.status === 'done' ? 'line-through text-(--text-secondary)' : ''}`}
              onClick={onToggle}
            >
              {task.title}
            </span>
          </div>
          <button
            onClick={onDelete}
            onPointerDown={(e) => e.stopPropagation()}
            className="text-xs text-(--danger) hover:underline shrink-0"
          >
            &times;
          </button>
        </div>
        {isExpanded && (
          <div className="mt-4 border-t border-(--border) pt-4 animate-fade-in">
            {task.description && <p className="text-sm text-(--text-secondary) mb-4">{task.description}</p>}
            <CommentList taskId={task._id} />
          </div>
        )}
      </div>
    </div>
  );
}

function PlainColumn({ status, count, children }: { status: TaskStatus; count: number; children: React.ReactNode }) {
  return (
    <div className={`rounded-xl p-5 ${statusConfig[status].light} border border-(--border)`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusConfig[status].badge}`}>{statusConfig[status].label}</span>
        <span className="text-xs text-(--text-secondary)">{count}</span>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function TaskCard({ task, isExpanded, onToggle }: {
  task: ITask; isExpanded: boolean; onToggle: () => void;
}) {
  return (
    <div className={`rounded-lg border border-(--border) bg-(--bg-primary) transition-all duration-200 hover:shadow-sm ${statusConfig[task.status].color} border-t-2 animate-slide-up`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <span
              className={`text-sm font-medium cursor-pointer hover:text-(--accent) transition-colors ${task.status === 'done' ? 'line-through text-(--text-secondary)' : ''}`}
              onClick={onToggle}
            >
              {task.title}
            </span>
          </div>
        </div>
        {isExpanded && (
          <div className="mt-4 border-t border-(--border) pt-4 animate-fade-in">
            {task.description && <p className="text-sm text-(--text-secondary) mb-4">{task.description}</p>}
            <CommentList taskId={task._id} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function TaskList({ projectId, readOnly }: Props) {
  const { tasks, setTasks, addTask, updateTask, removeTask } = useTasksStore();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<ITask | null>(null);
  const addToast = useToastStore((s) => s.addToast);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    api.get(`/projects/${projectId}/tasks`).then(({ data }) => { setTasks(data); setLoading(false); });
  }, [projectId, setTasks]);

  const createTask = async () => {
    if (!title.trim()) return;
    const { data } = await api.post(`/projects/${projectId}/tasks`, { title, description });
    addTask(data);
    addToast('Task created', 'success');
    setTitle('');
    setDescription('');
    setShowModal(false);
  };

  const deleteTask = async () => {
    if (!confirmDelete) return;
    try {
      await api.delete(`/projects/${projectId}/tasks/${confirmDelete}`);
      removeTask(confirmDelete);
      if (expandedTask === confirmDelete) setExpandedTask(null);
      addToast('Task deleted', 'success');
    } catch {
      addToast('Failed to delete task', 'error');
    }
    setConfirmDelete(null);
  };

  const handleDragStart = (event: any) => {
    setActiveTask(event.active.data.current?.task ?? null);
  };

  const handleDragEnd = async (event: any) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    const newStatus = over.id as TaskStatus;
    const previousStatus = active.data.current?.status as TaskStatus;
    if (newStatus === previousStatus) return;
    updateTask(active.id as string, { status: newStatus });
    try {
      const { data } = await api.put(`/projects/${projectId}/tasks/${active.id}`, { status: newStatus });
      updateTask(active.id as string, data);
      addToast(`Task moved to ${statusConfig[newStatus].label}`, 'success');
    } catch {
      updateTask(active.id as string, { status: previousStatus });
      addToast('Failed to move task', 'error');
    }
  };

  const grouped = { todo: tasks.filter((t) => t.status === 'todo'), in_progress: tasks.filter((t) => t.status === 'in_progress'), done: tasks.filter((t) => t.status === 'done') };
  const progress = tasks.length > 0 ? Math.round((grouped.done.length / tasks.length) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Tasks</h2>
          {tasks.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 w-32 bg-(--bg-secondary) rounded-full overflow-hidden">
                <div className="h-full bg-(--success) rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs text-(--text-secondary)">{grouped.done.length}/{tasks.length} done</span>
            </div>
          )}
        </div>
        {!readOnly && <Button onClick={() => setShowModal(true)}>Add Task</Button>}
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl p-5 bg-(--bg-secondary) animate-pulse">
              <div className="h-4 bg-(--bg-primary) rounded w-20 mb-4" />
              <div className="space-y-2">
                <div className="h-12 bg-(--bg-primary) rounded-lg" />
                <div className="h-12 bg-(--bg-primary) rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : readOnly ? (
        <div className="grid gap-6 md:grid-cols-3">
          {(Object.keys(grouped) as TaskStatus[]).map((status) => (
            <PlainColumn key={status} status={status} count={grouped[status].length}>
              {grouped[status].length === 0 ? (
                <div className="text-center py-6 text-xs text-(--text-secondary)">No tasks</div>
              ) : (
                grouped[status].map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    isExpanded={expandedTask === task._id}
                    onToggle={() => setExpandedTask(expandedTask === task._id ? null : task._id)}
                  />
                ))
              )}
            </PlainColumn>
          ))}
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="grid gap-6 md:grid-cols-3">
            {(Object.keys(grouped) as TaskStatus[]).map((status) => (
              <DroppableColumn key={status} status={status} count={grouped[status].length}>
                {grouped[status].length === 0 ? (
                  <div className="text-center py-6 text-xs text-(--text-secondary)">No tasks</div>
                ) : (
                  grouped[status].map((task, i) => (
                    <DraggableCard
                      key={task._id}
                      task={task}
                      isExpanded={expandedTask === task._id}
                      onToggle={() => setExpandedTask(expandedTask === task._id ? null : task._id)}
                      onDelete={() => setConfirmDelete(task._id)}
                    />
                  ))
                )}
              </DroppableColumn>
            ))}
          </div>
          <DragOverlay dropAnimation={null}>
            {activeTask ? (
              <div className={`rounded-lg border border-(--border) bg-(--bg-primary) shadow-2xl border-t-2 ${statusConfig[activeTask.status].color} p-4`}>
                <span className="text-sm font-medium">{activeTask.title}</span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="New Task">
        <div className="space-y-4">
          <Input label="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs to be done?" autoFocus />
          <Input label="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Details..." />
          <Button onClick={createTask} className="w-full">Create Task</Button>
        </div>
      </Modal>

      <Modal open={confirmDelete !== null} onClose={() => setConfirmDelete(null)} title="Delete Task">
        <p className="text-sm text-(--text-secondary) mb-4">This will permanently delete this task and all its comments. This action cannot be undone.</p>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button variant="danger" onClick={deleteTask}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
