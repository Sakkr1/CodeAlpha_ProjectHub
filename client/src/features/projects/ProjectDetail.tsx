import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { useProjectsStore } from './projects.store';
import TaskList from '../tasks/TaskList';
import { useToastStore } from '../../components/ui/Toast';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = useProjectsStore((s) => s.projects.find((p) => p._id === id));
  const updateProject = useProjectsStore((s) => s.updateProject);
  const [loading, setLoading] = useState(!project);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    if (!project && id) {
      api.get(`/projects/${id}`).then(({ data }) => {
        useProjectsStore.getState().addProject(data);
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id, project]);

  const startEdit = () => {
    if (!project) return;
    setEditName(project.name);
    setEditDesc(project.description);
    setEditing(true);
  };

  const saveEdit = async () => {
    if (!project || !editName.trim()) return;
    const { data } = await api.put(`/projects/${project._id}`, { name: editName, description: editDesc });
    updateProject(project._id, data);
    setEditing(false);
    addToast('Project updated', 'success');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="h-8 bg-(--bg-secondary) rounded w-48 mb-6 animate-pulse" />
        <div className="h-4 bg-(--bg-secondary) rounded w-64 animate-pulse" />
      </div>
    );
  }

  if (!project) return <div className="text-center py-12 text-(--danger)">Project not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate('/')} className="flex items-center gap-1 text-sm text-(--text-secondary) hover:text-(--accent) transition-colors mb-4">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
        Back to projects
      </button>

      <div className="rounded-xl border border-(--border) bg-(--bg-primary) p-8 mb-8 animate-fade-in">
        {editing ? (
          <div className="space-y-3">
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full text-2xl font-bold bg-transparent border-b border-(--accent) outline-none pb-1"
              autoFocus
            />
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="w-full text-sm text-(--text-secondary) bg-(--bg-secondary) rounded-lg p-2 outline-none focus:ring-1 focus:ring-(--accent) resize-none"
              rows={3}
              placeholder="Description..."
            />
            <div className="flex gap-2">
              <button onClick={saveEdit} className="text-sm bg-(--accent) text-white px-3 py-1.5 rounded-lg hover:bg-(--accent-hover) transition-colors">Save</button>
              <button onClick={() => setEditing(false)} className="text-sm text-(--text-secondary) px-3 py-1.5 hover:bg-(--bg-secondary) rounded-lg transition-colors">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-3 h-3 rounded-full bg-(--accent)" />
                <h1 className="text-2xl font-bold">{project.name}</h1>
              </div>
              {project.description && <p className="text-(--text-secondary) ml-6">{project.description}</p>}
            </div>
            <button onClick={startEdit} className="text-sm text-(--accent) hover:underline shrink-0">Edit</button>
          </div>
        )}
      </div>

      <TaskList projectId={project._id} />
    </div>
  );
}
