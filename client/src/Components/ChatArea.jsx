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
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Welcome to AI Chatbot
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Select a chat or create a new one to get started
          </p>
        </div>
      </div>
    );
  }

return (
  <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 relative">
    <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-4">
      {messages.map((message) => (
        <MessageBubble key={message._id} message={message} />
      ))}
      {loading && <LoadingDots />}
      <div ref={messagesEndRef} />
    </div>
  </div>
);
}

export default ChatArea;