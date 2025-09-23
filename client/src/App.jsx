import React from 'react';
import { ChatProvider, useChat } from './context/ChatContext';
import Sidebar from './Components/Sidebar';
import ChatArea from './Components/ChatArea';
import MessageInput from './Components/MessageInput';
import Header from './Components/Header';

function ChatLayout() {
  const { isSidebarOpen, toggleSidebar } = useChat();
  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-dark-primary">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar for desktop and mobile */}
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <ChatArea />
          <MessageInput />
        </main>

        {/* Overlay for mobile when sidebar is open */}
        {isSidebarOpen && (
          <div
            onClick={toggleSidebar}
            className="lg:hidden fixed inset-0 bg-black/60 z-20"
            aria-hidden="true"
          ></div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <ChatProvider>
      <ChatLayout />
    </ChatProvider>
  );
}

export default App;