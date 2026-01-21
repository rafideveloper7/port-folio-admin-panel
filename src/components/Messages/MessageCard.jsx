import React, { useState } from 'react';
import { 
  Mail, 
  Clock, 
  User, 
  MessageSquare, 
  Eye, 
  Reply, 
  Archive, 
  Trash2,
  ChevronDown,
  ChevronUp,
  Copy
} from 'lucide-react';
import { format } from 'date-fns';

const MessageCard = ({ message, statusColor, onStatusUpdate, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy • hh:mm a');
    } catch {
      return dateString;
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(message.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleStatusAction = (action) => {
    onStatusUpdate(message.id, action);
  };

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColor}`}>
              {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
            </div>
            <span className="text-lg font-semibold text-white truncate">
              {message.subject || 'No Subject'}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <User size={14} />
              <span className="font-medium text-gray-300">{message.name}</span>
            </div>
            <div 
              className="flex items-center gap-2 hover:text-green-400 cursor-pointer transition-colors"
              onClick={handleCopyEmail}
              title={copied ? 'Copied!' : 'Copy email'}
            >
              <Mail size={14} />
              <span className="truncate max-w-[200px]">{message.email}</span>
              <Copy size={12} />
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} />
              <span>{formatDate(message.created_at)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
            title={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Message Preview */}
      <div className="mt-4">
        <p className="text-gray-300 line-clamp-2">
          {message.message}
        </p>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="mt-6 pt-6 border-t border-gray-700/50">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Full Message</h4>
              <div className="bg-gray-900/50 rounded-lg p-4">
                <p className="text-gray-300 whitespace-pre-wrap">{message.message}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Submission Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Submitted:</span>
                    <span className="text-gray-300">{formatDate(message.created_at)}</span>
                  </div>
                  {message.updated_at && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Last Updated:</span>
                      <span className="text-gray-300">{formatDate(message.updated_at)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Message ID:</span>
                    <span className="text-gray-300 font-mono text-xs">{message.id.substring(0, 8)}...</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Quick Actions</h4>
                <div className="space-y-2">
                  <a
                    href={`mailto:${message.email}?subject=Re: ${message.subject || 'Your Message'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 w-full px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                  >
                    <Reply size={14} />
                    Reply via Email
                  </a>
                  <button
                    onClick={() => handleCopyEmail()}
                    className="flex items-center gap-2 w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                  >
                    <Copy size={14} />
                    {copied ? 'Email Copied!' : 'Copy Email Address'}
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-700/50">
              {message.status !== 'read' && (
                <button
                  onClick={() => handleStatusAction('read')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                >
                  <Eye size={14} />
                  Mark as Read
                </button>
              )}
              
              {message.status !== 'replied' && (
                <button
                  onClick={() => handleStatusAction('replied')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
                >
                  <Reply size={14} />
                  Mark as Replied
                </button>
              )}
              
              {message.status !== 'archived' && (
                <button
                  onClick={() => handleStatusAction('archived')}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors"
                >
                  <Archive size={14} />
                  Archive
                </button>
              )}
              
              <button
                onClick={() => onDelete(message.id)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors ml-auto"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Actions */}
      {!expanded && (
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-700/50">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleStatusAction('read')}
              className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
            >
              <Eye size={12} />
              Read
            </button>
            <button
              onClick={() => handleStatusAction('replied')}
              className="flex items-center gap-1 px-3 py-1 text-xs bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded transition-colors"
            >
              <Reply size={12} />
              Replied
            </button>
            <button
              onClick={() => window.open(`mailto:${message.email}`, '_blank')}
              className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded transition-colors"
            >
              <Mail size={12} />
              Reply
            </button>
          </div>
          
          <button
            onClick={() => setExpanded(true)}
            className="text-sm text-green-400 hover:text-green-300 transition-colors"
          >
            View Details →
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageCard;