import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import type { IProject } from '../../shared/types';

export default function ExploreProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/projects/explore').then(({ data }) => { setProjects(data); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Explore Projects</h1>
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
      <button onClick={() => navigate('/')} className="flex items-center gap-1 text-sm text-(--text-secondary) hover:text-(--accent) transition-colors mb-4">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        Home
      </button>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Explore Projects</h1>
        <p className="text-sm text-(--text-secondary) mt-1">{projects.length} {projects.length === 1 ? 'project' : 'projects'} from everyone</p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <p className="text-(--text-secondary) mb-4">No projects to explore yet</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <div
              key={p._id}
              onClick={() => navigate(`/explore/${p._id}`)}
              className="rounded-xl border border-(--border) bg-(--bg-primary) p-6 cursor-pointer hover:shadow-md hover:border-(--accent)/30 transition-all duration-200 active:scale-[0.99] animate-slide-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-(--accent) shrink-0" />
                    <h3 className="font-semibold truncate">{p.name}</h3>
                  </div>
                  {p.description && <p className="text-sm text-(--text-secondary) line-clamp-2 mb-2">{p.description}</p>}
                  <p className="text-xs text-(--text-secondary)">by {p.ownerName || 'Unknown'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
