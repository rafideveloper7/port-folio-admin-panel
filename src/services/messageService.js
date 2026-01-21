import { supabase } from './supabase';

export const messageService = {
  // Check if user is authenticated
  async checkAuth() {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw new Error('Not authenticated');
    }
    return true;
  },

  // Get all messages
  async getMessages(page = 1, limit = 10, filters = {}) {
    // Check auth first
    await this.checkAuth();

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('contact_submissions')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    // Apply filters
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,subject.ilike.%${filters.search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Get messages error:', error);
      throw error;
    }
    
    return {
      messages: data || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    };
  },

  // Get statistics
  async getStatistics() {
    await this.checkAuth();

    const { data, error } = await supabase
      .from('contact_submissions')
      .select('status, created_at');

    if (error) {
      console.error('Statistics error:', error);
      throw error;
    }

    const messages = data || [];
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      total: messages.length,
      unread: messages.filter(m => m.status === 'unread').length,
      replied: messages.filter(m => m.status === 'replied').length,
      last24Hours: messages.filter(m => new Date(m.created_at) > last24Hours).length,
      last7Days: messages.filter(m => new Date(m.created_at) > last7Days).length,
    };
  },

  // Update message status
  async updateMessage(id, updates) {
    await this.checkAuth();

    const { data, error } = await supabase
      .from('contact_submissions')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update error:', error);
      throw error;
    }
    return data;
  },

  // Delete message
  async deleteMessage(id) {
    await this.checkAuth();

    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete error:', error);
      throw error;
    }
  },

  // Quick status updates
  async markAsRead(id) {
    return this.updateMessage(id, { status: 'read' });
  },

  async markAsReplied(id) {
    return this.updateMessage(id, { status: 'replied' });
  },

  async archiveMessage(id) {
    return this.updateMessage(id, { status: 'archived' });
  },
};