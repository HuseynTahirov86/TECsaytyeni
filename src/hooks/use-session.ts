'use client'

import { useState, useEffect, useCallback } from 'react'

export interface SessionUser {
    id: string;
    // The following properties might not always be available
    // depending on the session type (admin vs user)
    email?: string;
    name?: string;
    role?: 'admin';
    userType?: 'user' | 'teti';
}

export interface Session {
  user: SessionUser
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const sessionData = await response.json();
        // Ensure that we have a user object with an id or role.
        if (sessionData && (sessionData.id || sessionData.role === 'admin')) {
           setSession({ user: sessionData });
        } else {
           setSession(null);
        }
      } else {
        setSession(null);
      }
    } catch (error) {
      console.error('Failed to fetch session:', error);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return { session, loading, refetch: fetchSession }
}
