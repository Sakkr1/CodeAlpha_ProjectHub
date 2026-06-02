import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { useProjectsStore } from './projects.store';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useToastStore } from '../../components/ui/Toast';

export default function ProjectList() {
  const navigate = useNavigate();
  const { projects, setProjects, addProject, removeProject } = useProjectsStore();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    api.get('/projects').then(({ data }) => { setProjects(data); setLoading(false); });
  }, [setProjects]);

  const createProject = async () => {
    if (!name.trim()) return;
    const { data } = await api.post('/projects', { name, description });
    addProject(data);
    addToast('Project created', 'success');
    setName('');
    setDescription('');
    setShowModal(false);
  };

  const deleteProject = async (id: string) => {
    try {
      await api.delete(`/projects/${id}`);
      removeProject(id);
      addToast('Project deleted', 'success');
    } catch {
      addToast('Failed to delete project', 'error');
    }
    setConfirmDelete(null);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Projects</h1>
          <Button disabled>New Project</Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-(--border) bg-(--bg-primary) p-6 animate-pulse">
              <div className="h-5 bg-(--bg-secondary) rounded w-3/4 mb-3" />
              <div className="h-3 bg-(--bg-secondary) rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-sm text-(--text-secondary) mt-1">{projects.length} {projects.length === 1 ? 'project' : 'projects'}</p>
        </div>
        <Button onClick={() => setShowModal(true)}>New Project</Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <div className="text-4xl mb-3 text-(--text-secondary)">{'\ud83d\udcc1'}</div>
          <p className="text-(--text-secondary) mb-4">No projects yet</p>
          <Button onClick={() => setShowModal(true)}>Create your first project</Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <div
              key={p._id}
              onClick={() => navigate(`/projects/${p._id}`)}
              className="rounded-xl border border-(--border) bg-(--bg-primary) p-6 cursor-pointer hover:shadow-md hover:border-(--accent)/30 transition-all duration-200 active:scale-[0.99] animate-slide-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-(--accent) shrink-0" />
                    <h3 className="font-semibold truncate">{p.name}</h3>
                  </div>
                  {p.description && <p className="text-sm text-(--text-secondary) line-clamp-2">{p.description}</p>}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmDelete(p._id); }}
                  className="text-xs text-(--text-secondary) hover:text-(--danger) hover:underline shrink-0 px-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="New Project">
        <div className="space-y-4">
          <Input label="Project Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="My project" autoFocus />
          <Input label="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What's this about?" />
          <Button onClick={createProject} className="w-full">Create Project</Button>
        </div>
      </Modal>

      <Modal open={confirmDelete !== null} onClose={() => setConfirmDelete(null)} title="Delete Project">
        <p className="text-sm text-(--text-secondary) mb-4">This will permanently delete this project and all its tasks and comments. This action cannot be undone.</p>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => confirmDelete && deleteProject(confirmDelete)}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
