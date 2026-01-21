import { supabase } from './supabase';

export const authService = {
  // Sign in using Supabase Auth
  async signIn(email, password) {
    console.log('Attempting sign in with:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });
    
    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }
    
    console.log('Sign in successful:', data.user.email);
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current session
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Session error:', error);
      return null;
    }
    return data.session;
  },

  // Get current user
  async getUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Get user error:', error);
      return null;
    }
    return data.user;
  },

  // Check if user is admin (by email)
  async isAdmin() {
    try {
      const user = await this.getUser();
      if (!user) return false;
      
      // Check if email matches admin email
      const isAdmin = user.email === 'rafideveloper7@gmail.com';
      console.log('Admin check:', { email: user.email, isAdmin });
      return isAdmin;
    } catch (error) {
      console.error('Admin check error:', error);
      return false;
    }
  },

  // Listen for auth changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};