import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const ChatContext = createContext();

const initialState = {
  chats: [],
  currentChat: null,
  messages: [],
  loading: false,
  darkMode: localStorage.getItem('darkMode') === 'true',
  userId: 'default-user' // In a real app, this would come from authentication
};

function chatReducer(state, action) {
  switch (action.type) {
    case 'SET_CHATS':
      return { ...state, chats: action.payload };
    case 'SET_CURRENT_CHAT':
      return { ...state, currentChat: action.payload };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'ADD_CHAT':
      return { ...state, chats: [action.payload, ...state.chats] };
    case 'DELETE_CHAT':
      return {
        ...state,
        chats: state.chats.filter(chat => chat._id !== action.payload),
        currentChat: state.currentChat?._id === action.payload ? null : state.currentChat
      };
    default:
      return state;
  }
}

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const API_BASE_URL = 'http://localhost:5000/api';

  // Load chats on mount
  useEffect(() => {
    loadChats();
  }, []);

  // Handle dark mode
  useEffect(() => {
    localStorage.setItem('darkMode', state.darkMode);
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  const loadChats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chats/${state.userId}`);
      dispatch({ type: 'SET_CHATS', payload: response.data });
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  const createNewChat = async (title = 'New Chat') => {
    try {
      const response = await axios.post(`${API_BASE_URL}/chats`, {
        userId: state.userId,
        title
      });
      dispatch({ type: 'ADD_CHAT', payload: response.data });
      return response.data;
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const selectChat = async (chat) => {
    dispatch({ type: 'SET_CURRENT_CHAT', payload: chat });
    try {
      const response = await axios.get(`${API_BASE_URL}/messages/${chat._id}`);
      dispatch({ type: 'SET_MESSAGES', payload: response.data });
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async (content) => {
    if (!state.currentChat) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await axios.post(`${API_BASE_URL}/messages`, {
        chatId: state.currentChat._id,
        content,
        userId: state.userId
      });

      dispatch({ type: 'ADD_MESSAGE', payload: response.data.userMessage });
      dispatch({ type: 'ADD_MESSAGE', payload: response.data.assistantMessage });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteChat = async (chatId) => {
    try {
      await axios.delete(`${API_BASE_URL}/chats/${chatId}`);
      dispatch({ type: 'DELETE_CHAT', payload: chatId });
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  const value = {
    ...state,
    loadChats,
    createNewChat,
    selectChat,
    sendMessage,
    deleteChat,
    toggleDarkMode
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};