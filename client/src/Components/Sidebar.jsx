import React from 'react';
import { useChat } from '../context/ChatContext';
import { PlusIcon, ChatBubbleLeftIcon, TrashIcon } from '@heroicons/react/24/outline';

function Sidebar() {
  const { chats, currentChat, createNewChat, selectChat, deleteChat } = useChat();

  const handleNewChat = async () => {
    const newChat = await createNewChat();
    if (newChat) {
      selectChat(newChat);
    }
  };

  return (
    <div className="w-64 bg-gray-900 dark:bg-gray-800 h-full flex flex-col">
      <div className="p-4">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat._id}
            className={`group flex items-center gap-2 px-4 py-3 mx-2 rounded-lg cursor-pointer transition-colors ${
              currentChat?._id === chat._id
                ? 'bg-gray-700 dark:bg-gray-600'
                : 'hover:bg-gray-800 dark:hover:bg-gray-700'
            }`}
          >
            <ChatBubbleLeftIcon className="w-5 h-5 text-gray-400" />
            <span
              className="flex-1 text-white truncate text-sm"
              onClick={() => selectChat(chat)}
            >
              {chat.title}
            </span>
            <button
              onClick={() => deleteChat(chat._id)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-600 rounded transition-all"
            >
              <TrashIcon className="w-4 h-4 text-red-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;