import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import TextareaAutosize from 'react-textarea-autosize';

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
    <div className="bg-gray-100 dark:bg-dark-primary p-4 flex-shrink-0">
      <div className="max-w-4xl mx-auto">
        <form 
          onSubmit={handleSubmit} 
          className="flex items-end gap-2 bg-white dark:bg-dark-secondary p-2 rounded-xl shadow-md"
        >
          <TextareaAutosize
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 resize-none bg-transparent focus:outline-none p-2 dark:text-gray-200"
            disabled={loading || !currentChat}
            rows={1}
            maxRows={6}
            autoFocus
          />
          <button
            type="submit"
            disabled={loading || !input.trim() || !currentChat}
            className="w-10 h-10 bg-accent-blue hover:bg-accent-hover disabled:bg-gray-400 disabled:dark:bg-gray-600 text-white rounded-lg transition-all flex items-center justify-center flex-shrink-0"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default MessageInput;