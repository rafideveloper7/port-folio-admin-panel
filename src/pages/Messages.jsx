import React, { useState, useEffect, useCallback } from 'react';
import { messageService } from '../services/messageService';
import MessageList from '../components/Messages/MessageList';
import MessageFilters from '../components/Messages/MessageFilters';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { RefreshCw, MessageSquare, AlertCircle } from 'lucide-react';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    startDate: '',
    endDate: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    replied: 0,
  });

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      console.log('📥 Fetching messages...');
      const result = await messageService.getMessages(
        pagination.page,
        pagination.limit,
        filters
      );
      
      console.log('✅ Messages fetched:', result.messages?.length);
      setMessages(result.messages || []);
      setPagination(prev => ({
        ...prev,
        total: result.total,
        totalPages: result.totalPages,
      }));
    } catch (err) {
      console.error('❌ Error fetching messages:', err);
      setError(err.message || 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  const fetchStats = useCallback(async () => {
    try {
      console.log('📊 Fetching statistics...');
      const statsData = await messageService.getStatistics();
      console.log('✅ Statistics:', statsData);
      setStats(statsData);
    } catch (err) {
      console.error('❌ Error fetching stats:', err);
      // Don't set error here, just log it
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchMessages();
        await fetchStats();
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    };
    
    loadData();
  }, [fetchMessages, fetchStats]);

  const handleFilterChange = (newFilters) => {
    console.log('🎛️ Filter changed:', newFilters);
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleRefresh = () => {
    console.log('🔄 Refreshing data...');
    fetchMessages();
    fetchStats();
  };

  if (loading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner text="Loading messages..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Messages</h1>
          <p className="text-gray-400 mt-1">
            Total: {stats.total} • Unread: {stats.unread} • Replied: {stats.replied}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-green-500/30 text-green-400 px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div>
              <p className="text-red-400 font-medium">Error loading messages</p>
              <p className="text-red-400/80 text-sm mt-1">{error}</p>
              <button
                onClick={handleRefresh}
                className="mt-2 text-sm text-red-300 hover:text-red-200 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <MessageFilters filters={filters} onChange={handleFilterChange} />

      {/* Messages List */}
      {messages.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/30 border border-gray-700/50 rounded-xl">
          <MessageSquare size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No messages found</h3>
          <p className="text-gray-500">No contact form submissions match your filters</p>
          <button
            onClick={() => {
              setFilters({ status: '', search: '', startDate: '', endDate: '' });
              handleRefresh();
            }}
            className="mt-4 text-green-400 hover:text-green-300 underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <MessageList messages={messages} />
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
              >
                Previous
              </button>
              <span className="text-gray-300">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Messages;