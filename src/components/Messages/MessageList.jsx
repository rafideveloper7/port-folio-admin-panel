import React from 'react';
import MessageCard from './MessageCard';
import { Mail, Clock, User, MessageSquare } from 'lucide-react';

const MessageList = ({ messages, onStatusUpdate, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'unread': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'read': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'replied': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'archived': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className="bg-gray-800/30 border border-gray-700/50 rounded-xl overflow-hidden hover:border-green-500/30 transition-all duration-300"
        >
          <MessageCard
            message={message}
            statusColor={getStatusColor(message.status)}
            onStatusUpdate={onStatusUpdate}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
};

export default MessageList;