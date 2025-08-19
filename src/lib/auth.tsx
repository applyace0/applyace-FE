import { createContext, useContext, useEffect, useState } from 'react';
import { User, Provider } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  signInWithProvider: (provider: Provider) => Promise<{ provider: Provider; url: string }>;
  verifyEmail: (token: string) => Promise<void>;
}

const defaultContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  updatePassword: async () => {},
  signInWithProvider: async () => ({ provider: 'google', url: '' }),
  verifyEmail: async () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Successfully signed in!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      toast.success('Please check your email for verification link!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 Starting signOut process...');
      
      // Important: await this!
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log('✅ Supabase signOut successful');
      
      // Clear any app caches that might keep "admin" UI visible
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear any stored tokens or user data
      if (typeof window !== 'undefined') {
        // Clear any custom auth tokens
        localStorage.removeItem('authToken');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('supabase.auth.token');
        
        // Clear any other app-specific storage
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('admin');
      }
      
      console.log('🧹 Storage cleared successfully');
      
      // Force user state update
      setUser(null);
      
      toast.success('Successfully signed out!');
      console.log('🎉 SignOut completed successfully');
    } catch (error: any) {
      console.error('❌ SignOut error:', error);
      toast.error(error.message);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      toast.success('Password reset instructions sent to your email!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      toast.success('Password updated successfully!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const signInWithProvider = async (provider: Provider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Social login error:', error);
      toast.error(error.message || 'Failed to sign in with ' + provider);
      throw error;
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email',
      });
      if (error) throw error;
      toast.success('Email verified successfully!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    signInWithProvider,
    verifyEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 