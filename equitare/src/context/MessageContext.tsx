import { createContext, useState, ReactNode, useContext } from 'react';
import { useAuth } from './AuthContext';

interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
  };
  recipient: {
    _id: string;
    name: string;
  };
  content: string;
  rideId?: {
    _id: string;
    departureDate: string;
    departureTime: string;
    airport: string;
  };
  createdAt: string;
}

interface Conversation {
  userId: string;
  name: string;
  lastMessage: string;
  lastMessageDate: string;
}

interface MessageContextType {
  messages: Message[];
  conversations: Conversation[];
  currentConversation: Message[];
  loading: boolean;
  error: string | null;
  fetchMessages: () => Promise<void>;
  fetchConversations: () => Promise<void>;
  fetchConversation: (userId: string) => Promise<void>;
  sendMessage: (recipientId: string, content: string, rideId?: string) => Promise<boolean>;
  clearError: () => void;
}

interface MessageProviderProps {
  children: ReactNode;
}

export const MessageContext = createContext<MessageContextType>({
  messages: [],
  conversations: [],
  currentConversation: [],
  loading: false,
  error: null,
  fetchMessages: async () => {},
  fetchConversations: async () => {},
  fetchConversation: async () => {},
  sendMessage: async () => false,
  clearError: () => {},
});

export const MessageProvider = ({ children }: MessageProviderProps) => {
  const { token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all messages for the logged-in user
  const fetchMessages = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3001/api/messages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch messages');
      }
      
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching messages');
    } finally {
      setLoading(false);
    }
  };

  // Fetch conversation list summary
  const fetchConversations = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3001/api/messages/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch conversations');
      }
      
      const data = await response.json();
      setConversations(data);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching conversations');
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages with a specific user
  const fetchConversation = async (userId: string) => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:3001/api/messages/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch conversation');
      }
      
      const data = await response.json();
      setCurrentConversation(data);
      
      // After loading conversation, refresh conversations list
      fetchConversations();
    } catch (err) {
      console.error('Error fetching conversation:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching conversation');
    } finally {
      setLoading(false);
    }
  };

  // Send a new message
  const sendMessage = async (recipientId: string, content: string, rideId?: string): Promise<boolean> => {
    if (!token) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      const payload: any = { recipientId, content };
      if (rideId) payload.rideId = rideId;
      
      const response = await fetch('http://localhost:3001/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }
      
      const newMessage = await response.json();
      
      // Update current conversation
      setCurrentConversation(prev => [...prev, newMessage]);
      
      // Refresh conversations list
      fetchConversations();
      
      return true;
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while sending message');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <MessageContext.Provider
      value={{
        messages,
        conversations,
        currentConversation,
        loading,
        error,
        fetchMessages,
        fetchConversations,
        fetchConversation,
        sendMessage,
        clearError
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

// Custom hook for using message context
export const useMessages = () => useContext(MessageContext); 