import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import TaskList from '../tasks/TaskList';
import type { IProject } from '../../shared/types';

export default function ExploreDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get(`/projects/explore/${id}`).then(({ data }) => { setProject(data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

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
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate('/explore')} className="flex items-center gap-1 text-sm text-(--text-secondary) hover:text-(--accent) transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to explore
        </button>
        <button onClick={() => navigate('/')} className="flex items-center gap-1 text-sm text-(--text-secondary) hover:text-(--accent) transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Home
        </button>
      </div>

      <div className="rounded-xl border border-(--border) bg-(--bg-primary) p-8 mb-8 animate-fade-in">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-3 h-3 rounded-full bg-(--accent)" />
              <h1 className="text-2xl font-bold">{project.name}</h1>
            </div>
            {project.description && <p className="text-(--text-secondary) ml-6">{project.description}</p>}
            <p className="text-xs text-(--text-secondary) ml-6 mt-1">by {project.ownerName || 'Unknown'}</p>
          </div>
        </div>
      </div>

      <TaskList projectId={project._id} readOnly />
    </div>
  );
}
