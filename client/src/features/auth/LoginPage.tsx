import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { useAuthStore } from './auth.store';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAuth(data.user, data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--bg-secondary) px-6">
      <div className="w-full max-w-sm animate-scale-in">
        <div className="flex justify-center mb-8">
          <button onClick={() => navigate('/')} className="w-14 h-14 rounded-xl bg-(--accent) flex items-center justify-center text-white text-2xl font-bold shadow-lg cursor-pointer hover:bg-(--accent-hover) transition-colors">P</button>
        </div>
        <form onSubmit={handleSubmit} className="rounded-xl bg-(--bg-primary) p-8 shadow-lg border border-(--border) space-y-5">
          <h1 className="text-xl font-bold text-center">Welcome back</h1>
          <p className="text-sm text-(--text-secondary) text-center -mt-2">Sign in to your account</p>
          {error && <div className="rounded-lg bg-(--danger-light) dark:bg-red-900/20 p-3 text-sm text-(--danger)">{error}</div>}
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" loading={loading} className="w-full">Sign In</Button>
          <p className="text-sm text-center text-(--text-secondary)">
            Don't have an account? <Link to="/register" className="text-(--accent) hover:underline font-medium">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
