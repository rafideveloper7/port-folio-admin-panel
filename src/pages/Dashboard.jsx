import React, { useState, useEffect, Link } from 'react';
import { messageService } from '../services/messageService';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Users,
  Mail,
  MessageSquare,
  Eye,
  Calendar
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, subDays } from 'date-fns';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    replied: 0,
    last24Hours: 0,
    last7Days: 0,
  });
  const [recentMessages, setRecentMessages] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const statsData = await messageService.getStatistics();
      setStats(statsData);

      // Fetch recent messages
      const messages = await messageService.getMessages(1, 5);
      setRecentMessages(messages.messages || []);

      // Generate chart data (last 7 days)
      const chartData = generateChartData();
      setChartData(chartData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dayName = format(date, 'EEE');
      const count = Math.floor(Math.random() * 10); // Replace with actual data
      data.push({
        name: dayName,
        messages: count,
      });
    }
    
    return data;
  };

  const getStatusPercentage = (count) => {
    if (stats.total === 0) return 0;
    return Math.round((count / stats.total) * 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Overview of your contact form messages</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 border border-green-500/20 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Messages</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp size={14} className="text-green-500" />
                <span className="text-green-400 text-sm">+{stats.last7Days} this week</span>
              </div>
            </div>
            <MessageSquare className="text-green-500" size={28} />
          </div>
        </div>

        <div className="bg-gray-800/50 border border-blue-500/20 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Unread</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.unread}</p>
              <div className="mt-2">
                <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${getStatusPercentage(stats.unread)}%` }}
                  ></div>
                </div>
                <p className="text-blue-400 text-xs mt-1">{getStatusPercentage(stats.unread)}% of total</p>
              </div>
            </div>
            <Mail className="text-blue-500" size={28} />
          </div>
        </div>

        <div className="bg-gray-800/50 border border-emerald-500/20 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Replied</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.replied}</p>
              <div className="mt-2">
                <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${getStatusPercentage(stats.replied)}%` }}
                  ></div>
                </div>
                <p className="text-emerald-400 text-xs mt-1">{getStatusPercentage(stats.replied)}% of total</p>
              </div>
            </div>
            <Eye className="text-emerald-500" size={28} />
          </div>
        </div>

        <div className="bg-gray-800/50 border border-purple-500/20 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Last 24h</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.last24Hours}</p>
              <div className="flex items-center gap-2 mt-2">
                <Clock size={14} className="text-purple-500" />
                <span className="text-purple-400 text-sm">Active conversations</span>
              </div>
            </div>
            <Users className="text-purple-500" size={28} />
          </div>
        </div>
      </div>

      {/* Charts and Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Message Activity (Last 7 Days)</h2>
            <Calendar className="text-gray-400" size={20} />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="messages" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ stroke: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Recent Messages</h2>
            <MessageSquare className="text-gray-400" size={20} />
          </div>
          
          <div className="space-y-4">
            {recentMessages.length > 0 ? (
              recentMessages.map((message) => (
                <div 
                  key={message.id}
                  className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg hover:bg-gray-900/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white truncate">
                        {message.name}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        message.status === 'unread' 
                          ? 'bg-blue-500/20 text-blue-400'
                          : message.status === 'replied'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {message.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">
                      {message.subject || 'No subject'}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500 ml-4">
                    {format(new Date(message.created_at), 'MMM dd')}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageSquare size={32} className="mx-auto text-gray-600 mb-3" />
                <p className="text-gray-500">No recent messages</p>
              </div>
            )}
          </div>
{/* 
          <div className="mt-6 pt-6 border-t border-gray-700/50">
            <Link 
              to="/messages" 
              className="block w-full text-center py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
            >
              View All Messages →
            </Link>
            
          </div> */}
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Status Distribution</h2>
          <BarChart3 className="text-gray-400" size={20} />
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { name: 'Unread', value: stats.unread, color: '#3B82F6' },
              { name: 'Read', value: stats.total - stats.unread - stats.replied, color: '#6B7280' },
              { name: 'Replied', value: stats.replied, color: '#10B981' },
              { name: 'Archived', value: stats.total - stats.unread - stats.replied, color: '#8B5CF6' },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="value" 
                fill="#10B981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;