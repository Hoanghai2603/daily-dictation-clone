import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
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

    // BYPASS LOGIN FOR DEVELOPMENT TESTING
    // Remove this logic in production when real auth is needed strict
    const IS_DEV = import.meta.env.DEV;

    const checkAdminStatus = useCallback(async (email: string | undefined) => {
        if (!email) {
            setIsAdmin(false);
            lastCheckedEmail.current = null;
            return;
        }

        // Prevent duplicate checks
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
    }, []);

    useEffect(() => {
        let mounted = true;

        if (IS_DEV) {
            console.log("DEV MODE: Auto-bypassing login...");
            const dummySession = {
                access_token: "dummy_token",
                refresh_token: "dummy_refresh",
                expires_in: 3600,
                token_type: "bearer",
                user: {
                    id: "dev-admin-id",
                    email: "dev@admin.com",
                    app_metadata: {},
                    user_metadata: {},
                    aud: "authenticated",
                    created_at: new Date().toISOString()
                }
            } as Session;

            setTimeout(() => {
                setSession(dummySession);
                setIsAdmin(true);
                setLoading(false);
            }, 0);
            return;
        }

        // Normal Production Auth Logic
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
    }, [IS_DEV, checkAdminStatus]);

    const signInWithGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
            },
        });
    };

    const signOut = async () => {
        if (IS_DEV) {
            alert("Sign out is disabled in DEV bypass mode.");
            return;
        }
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
