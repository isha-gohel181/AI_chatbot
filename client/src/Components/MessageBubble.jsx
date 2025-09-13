import React, { useState } from 'react';
import { UserIcon, CpuChipIcon, ClipboardIcon, CheckIcon } from '@heroicons/react/24/solid';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const CodeBlock = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : 'text';
      const codeText = String(children).replace(/\n$/, '');

      return !inline ? (
        <div className="relative my-2 rounded-md bg-gray-900 text-white font-sans">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-700 rounded-t-md">
            <span className="text-xs text-gray-300">{language}</span>
            <CopyToClipboard text={codeText} onCopy={handleCopy}>
              <button className="flex items-center text-xs text-gray-300 hover:text-white">
                {isCopied ? (
                  <>
                    <CheckIcon className="w-4 h-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <ClipboardIcon className="w-4 h-4 mr-1" />
                    Copy code
                  </>
                )}
              </button>
            </CopyToClipboard>
          </div>
          <SyntaxHighlighter
            style={materialDark}
            language={language}
            PreTag="div"
            {...props}
          >
            {codeText}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className="bg-gray-200 dark:bg-gray-700 rounded px-1 py-0.5 text-sm" {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className={`flex gap-3 my-2 animate-fade-in-up ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-accent-blue flex items-center justify-center flex-shrink-0">
          <CpuChipIcon className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div
        className={`max-w-3xl rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-accent-blue text-white'
            : 'bg-white dark:bg-dark-secondary text-gray-800 dark:text-white'
        }`}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            components={CodeBlock}
            remarkPlugins={[remarkGfm]}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        <span className="text-xs opacity-70 mt-1 block text-right">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center flex-shrink-0">
          <UserIcon className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
}

export default MessageBubble;