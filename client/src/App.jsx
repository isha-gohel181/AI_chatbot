import React from 'react';
import { ChatProvider } from './context/ChatContext';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import MessageInput from './components/MessageInput';
import Header from './components/Header';

function App() {
  return (
    <ChatProvider>
      <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
        <Header />
        <div className="flex-1 flex overflow-hidden relative">
          <Sidebar />
          <div className="flex-1 flex flex-col relative z-50">
            <ChatArea />
            <MessageInput />
          </div>
        </div>
      </div>
    </ChatProvider>
  );
}

export default App;