import React, { useState, useRef, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import {MessageCircleQuestion} from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

export default function ChatCircle() {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { author: 'assistant', content: "Hey! I’m Saarthi, the personal chat assistant for Shrutik. What would you like to know?" }
  ]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { author: 'user', content: trimmed }]);
    setInputText('');

    try {
      const resp = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: trimmed })
      });
      const data = await resp.json();
      if (!resp.ok || data.error) {
        throw new Error(data.error || 'Failed to fetch');
      }
      setMessages((prev) => [...prev, { author: 'assistant', content: data.botReply }]);
    } catch (err) {
      console.error('Chat API error:', err);
      toast.error('Error contacting server. Please try again.');
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-accent-primary hover:bg-accent-primary-hover text-text-inverse rounded-full shadow-lg flex items-center justify-center transition-all duration-200 transform hover:scale-105"
          aria-label="Open chat"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-bg-surface border border-border-default rounded-lg shadow-xl z-40 flex flex-col">
          <div className="bg-bg-card flex gap-2 border-b border-border-default px-4 py-3 rounded-t-lg">
            <MessageCircleQuestion/>
            <h3 className="text-text-primary font-medium">Saarthi</h3>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3">
            <div className="space-y-3">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.author === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`rounded-lg p-2 max-w-[85%] text-sm
                      ${msg.author === 'user'
                        ? 'bg-accent-primary text-text-inverse'
                        : 'bg-bg-card text-text-primary'}`
                    }
                  >
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="border-t border-border-default px-3 py-3 flex items-center bg-bg-card rounded-b-lg"
          >
            <input
              type="text"
              className="flex-1 px-3 py-2 mr-2 border border-border-default rounded-lg bg-bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-border-focus transition"
              placeholder="Type your message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              type="submit"
              className="px-3 py-2 bg-accent-primary text-text-inverse rounded-lg hover:bg-accent-primary-hover transition text-sm"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}