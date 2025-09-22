// client/src/Components/Sidebar.jsx
import React from 'react';
import { useChat } from '../context/ChatContext';
import { PlusIcon, ChatBubbleLeftIcon, TrashIcon } from '@heroicons/react/24/outline';

function Sidebar() {
  const { chats, currentChat, createNewChat, selectChat, deleteChat, isSidebarOpen } = useChat();

  const handleNewChat = async () => {
    const newChat = await createNewChat();
    if (newChat) {
      selectChat(newChat);
    }
  };

  return (
    <div
      className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-dark-secondary flex flex-col transition-transform duration-300 ease-in-out border-r border-gray-200 dark:border-gray-700
                 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                 lg:translate-x-0`}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent-blue hover:bg-accent-hover text-white rounded-lg transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <h2 className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Recent Chats</h2>
        <div className="mt-2 space-y-1">
          {chats.map((chat) => (
            <div
              key={chat._id}
              className={`group flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                currentChat?._id === chat._id
                  ? 'bg-gray-200 dark:bg-dark-tertiary'
                  : 'hover:bg-gray-100 dark:hover:bg-dark-tertiary/50'
              }`}
              onClick={() => selectChat(chat)}
            >
              <ChatBubbleLeftIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              <span className="flex-1 text-gray-800 dark:text-white truncate text-sm">
                {chat.title}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat._id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full transition-opacity"
              >
                <TrashIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;