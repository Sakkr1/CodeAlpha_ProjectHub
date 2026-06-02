import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../features/auth/auth.store';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (!token) return;
    const socket = io({ auth: { token } });
    socketRef.current = socket;
    return () => { socket.close(); socketRef.current = null; };
  }, [token]);

  return socketRef;
}
