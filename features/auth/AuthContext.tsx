import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { isDemoMode } from '@/lib/env';
import { cacheClear } from '@/lib/storage';

type AuthResult = { error: string | null };

type AuthApi = {
  session: Session | null;
  user: User | null;
  initializing: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthApi | null>(null);

// Im Demo-Modus eine feste „angemeldete" Sitzung ohne echtes Backend.
const DEMO_USER = { id: 'demo-user', email: 'demo@dogai.app' } as User;
const DEMO_SESSION = { user: DEMO_USER } as Session;

/** Hält die Supabase-Session und stellt Auth-Aktionen App-weit bereit. */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(
    isDemoMode ? DEMO_SESSION : null,
  );
  const [initializing, setInitializing] = useState(!isDemoMode);

  useEffect(() => {
    if (isDemoMode) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setInitializing(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const api = useMemo<AuthApi>(
    () => ({
      session,
      user: session?.user ?? null,
      initializing,
      async signIn(email, password) {
        if (isDemoMode) return { error: null };
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error?.message ?? null };
      },
      async signUp(email, password) {
        if (isDemoMode) return { error: null };
        const { error } = await supabase.auth.signUp({ email, password });
        return { error: error?.message ?? null };
      },
      async signOut() {
        if (isDemoMode) return;
        await supabase.auth.signOut();
        await cacheClear();
      },
    }),
    [session, initializing],
  );

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthApi {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
