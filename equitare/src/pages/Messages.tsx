import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMessages } from '../context/MessageContext';
import { useAuth } from '../context/AuthContext';

const Messages: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const { 
    conversations, 
    currentConversation, 
    loading, 
    error, 
    fetchConversations, 
    fetchConversation, 
    sendMessage 
  } = useMessages();
  
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch conversations on component mount
  useEffect(() => {
    fetchConversations();
  }, []);
  
  // Load conversation when userId changes
  useEffect(() => {
    if (userId) {
      fetchConversation(userId);
    }
  }, [userId]);

  useEffect(() => {
    console.log(user?.id);
    console.log()
  }, []);
  
  // Scroll to bottom of messages when conversation updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentConversation]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId || !messageText.trim()) return;
    
    const success = await sendMessage(userId, messageText.trim());
    
    if (success) {
      setMessageText('');
    }
  };
  
  // Format date for display
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Same day format: "2:30 PM"
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Yesterday format: "Yesterday, 2:30 PM"
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Older format: "Mar 15, 2:30 PM"
    return date.toLocaleString([], { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary-dark">Messages</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg flex h-[calc(80vh-100px)]">
        {/* Conversations list (left sidebar) */}
        <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Conversations</h2>
          </div>
          
          {loading && !conversations.length ? (
            <div className="p-4 text-center text-gray-500">Loading conversations...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No conversations yet</div>
          ) : (
            <ul>
              {conversations.map(conversation => (
                <li key={conversation.userId}>
                  <Link
                    to={`/messages/${conversation.userId}`}
                    className={`block p-4 border-b border-gray-100 hover:bg-gray-50 ${
                      userId === conversation.userId ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-medium">{conversation.name}</div>
                      <div className="text-xs text-gray-500">
                        {formatMessageDate(conversation.lastMessageDate)}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mt-1 truncate">
                      {conversation.lastMessage}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Message thread (right side) */}
        <div className="w-2/3 flex flex-col">
          {!userId ? (
            <div className="flex-grow flex items-center justify-center text-gray-500">
              Select a conversation to start messaging
            </div>
          ) : (
            <>
              {/* Conversation header */}
              <div className="p-4 border-b border-gray-200 flex items-center">
                <h3 className="text-lg font-semibold">
                  {conversations.find(c => c.userId === userId)?.name || 'Chat'}
                </h3>
              </div>
              
              {/* Messages */}
              <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
                {loading && !currentConversation.length ? (
                  <div className="text-center py-4 text-gray-500">Loading messages...</div>
                ) : currentConversation.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No messages yet. Send a message to start the conversation.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentConversation.map(message => (
                      <div
                        key={message._id}
                        className={`flex ${
                          message.sender._id !== userId
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                            message.sender._id !== userId
                              ? 'bg-primary text-white rounded-br-none'
                              : 'bg-white border border-gray-200 rounded-bl-none'
                          }`}
                        >
                          <div className="text-sm">{message.content}</div>
                          <div className={`text-xs mt-1 ${
                            message.sender._id !== userId
                              ? 'text-blue-100'
                              : 'text-gray-500'
                          }`}>
                            {formatMessageDate(message.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
              
              {/* Message input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                <div className="flex">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    disabled={!messageText.trim() || loading}
                    className="bg-primary hover:bg-primary-dark text-white px-4 rounded-r transition duration-200 disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages; 