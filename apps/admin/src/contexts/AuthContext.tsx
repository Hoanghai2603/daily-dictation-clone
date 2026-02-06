import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

type AuthContextType = {
    session: Session | null;
    loading: boolean;
    isAdmin: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    session: null,
    loading: true,
    isAdmin: false,
    signInWithGoogle: async () => { },
    signOut: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const lastCheckedEmail = useRef<string | null>(null);

    const checkAdminStatus = async (email: string | undefined) => {
        if (!email) {
            setIsAdmin(false);
            lastCheckedEmail.current = null;
            return;
        }

        // Prevent duplicate checks for the same email
        if (email === lastCheckedEmail.current) {
            return;
        }

        const { data } = await supabase
            .from('app_admins')
            .select('email')
            .eq('email', email)
            .single();

        setIsAdmin(!!data);
        lastCheckedEmail.current = email;
    };

    useEffect(() => {
        let mounted = true;

        const initSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!mounted) return;
            setSession(session);
            if (session?.user?.email) {
                checkAdminStatus(session.user.email);
            }
            setLoading(false);
        };

        initSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!mounted) return;
            setSession(session);
            if (session?.user?.email) {
                checkAdminStatus(session.user.email);
            } else {
                setIsAdmin(false);
                lastCheckedEmail.current = null;
            }
            setLoading(false);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const signInWithGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
            },
        });
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setIsAdmin(false);
        lastCheckedEmail.current = null;
    };

    return (
        <AuthContext.Provider value={{ session, loading, isAdmin, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
