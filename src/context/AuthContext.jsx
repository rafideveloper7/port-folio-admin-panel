import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔍 Initializing auth...');
        
        // Get session
        const session = await authService.getSession();
        console.log('📋 Session found:', !!session);
        
        if (session) {
          setUser(session.user);
          
          // Check if admin
          const adminCheck = await authService.isAdmin();
          console.log('👑 Admin check:', adminCheck);
          setIsAdmin(adminCheck);
          
          if (!adminCheck) {
            console.log('⚠️ Not admin, signing out...');
            await authService.signOut();
            setUser(null);
          }
        } else {
          console.log('❌ No session found');
          setUser(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('🚨 Auth init error:', error);
        setUser(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
        console.log('✅ Auth initialization complete');
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: authListener } = authService.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN') {
          const user = session?.user || null;
          setUser(user);
          
          if (user) {
            const adminCheck = await authService.isAdmin();
            setIsAdmin(adminCheck);
            
            if (!adminCheck) {
              await authService.signOut();
              setUser(null);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAdmin(false);
        } else if (event === 'TOKEN_REFRESHED') {
          // Session refreshed, update user
          const user = session?.user || null;
          setUser(user);
          
          if (user) {
            const adminCheck = await authService.isAdmin();
            setIsAdmin(adminCheck);
          }
        }
        
        setLoading(false);
      }
    );

    return () => {
      console.log('🧹 Cleaning up auth listener');
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      console.log('🔐 Attempting sign in...');
      const { user } = await authService.signIn(email, password);
      
      // Check if admin
      const adminCheck = await authService.isAdmin();
      console.log('Admin check after login:', adminCheck);
      
      if (!adminCheck) {
        console.log('❌ Not admin, signing out...');
        await authService.signOut();
        throw new Error('Access denied. Admin privileges required.');
      }
      
      setUser(user);
      setIsAdmin(true);
      console.log('✅ Sign in successful:', user.email);
      return user;
    } catch (error) {
      console.error('🚨 Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    console.log('🚪 Signing out...');
    await authService.signOut();
    setUser(null);
    setIsAdmin(false);
    console.log('✅ Signed out');
  };

  const value = {
    user,
    isAdmin,
    signIn,
    signOut,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};