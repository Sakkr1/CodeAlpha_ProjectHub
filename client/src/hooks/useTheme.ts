import { useEffect } from 'react';
import { useAuthStore } from '../features/auth/auth.store';
import { applyTheme, getInitialTheme } from '../theme';
import api from '../api/client';

export function useTheme() {
  const { user, setUser } = useAuthStore();
  const theme = user?.theme || getInitialTheme();

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (user) {
      try {
        const { data } = await api.patch('/auth/theme', { theme: newTheme });
        setUser(data);
      } catch {
        // theme still applies locally
      }
    }
  };

  return { theme, toggleTheme };
}
