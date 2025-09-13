import React, { useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import MessageBubble from './MessageBubble';
import LoadingDots from './LoadingDots';

function ChatArea() {
  const { currentChat, messages, loading } = useChat();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-dark-primary">
        <div className="text-center p-8">
          <div className="inline-block bg-blue-100 dark:bg-blue-900/50 p-4 rounded-full mb-4">
              <svg className="w-12 h-12 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            AI Chatbot
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Your personal AI assistant. Start a new chat to begin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((message) => (
        <MessageBubble key={message._id} message={message} />
      ))}
      {loading && <LoadingDots />}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatArea;