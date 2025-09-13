import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

function MessageInput() {
  const [input, setInput] = useState('');
  const { sendMessage, loading, currentChat } = useChat();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading || !currentChat) return;

    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 relative z-10">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Shift+Enter for new line)"
          className="flex-1 resize-none border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white min-h-[50px] max-h-32 pointer-events-auto"
          disabled={loading || !currentChat}  // or just remove disabled entirely for testing
          rows={1}
          autoFocus
        />
      <button
        type="submit"
        disabled={loading || !input.trim() || !currentChat}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center justify-center pointer-events-auto"
      >
        <PaperAirplaneIcon className="w-5 h-5" />
      </button>

      </form>
    </div>
  );
}

export default MessageInput;