import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/auth.store';
import { ThemeToggle } from './ThemeToggle';
import { useEffect } from 'react';
import { ToastContainer } from './ui/Toast';

export default function Layout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  useEffect(() => { useAuthStore.getState().fetchUser(); }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-(--border) bg-(--bg-secondary)/80 backdrop-blur-sm px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-(--accent) flex items-center justify-center text-white text-sm font-bold shadow-sm">P</div>
          <button onClick={() => navigate('/')} className="text-lg font-bold hover:text-(--accent) transition-colors tracking-tight">
            ProjectHub
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/explore')} className="text-sm text-(--text-secondary) hover:text-(--accent) transition-colors font-medium">Explore</button>
          <ThemeToggle />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-(--accent-light) flex items-center justify-center text-xs font-semibold text-(--accent)">
              {user?.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <span className="text-sm text-(--text-secondary) hidden sm:inline">{user?.name}</span>
          </div>
          <button onClick={() => { logout(); navigate('/login'); }} className="text-sm text-(--text-secondary) hover:text-(--danger) transition-colors font-medium">
            Logout
          </button>
        </div>
      </header>
      <main className="flex-1 p-8 animate-fade-in">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  );
}
