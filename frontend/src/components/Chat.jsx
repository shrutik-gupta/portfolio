import React, { useState, useRef, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { MessageCircleQuestion, X, ArrowUp } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import Magnetic from './Magnetic';

/**
 * Saarthi — a small assistant that answers questions about Shrutik.
 * Presentation only has been reworked; the request flow is unchanged.
 */
export default function ChatCircle() {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      author: 'assistant',
      content:
        "Hey! I’m Saarthi, the personal chat assistant for Shrutik. What would you like to know?",
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [pending, setPending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || pending) return;

    setMessages((prev) => [...prev, { author: 'user', content: trimmed }]);
    setInputText('');
    setPending(true);

    try {
      const resp = await fetch(`${BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: trimmed }),
      });
      const data = await resp.json();
      if (!resp.ok || data.error) {
        throw new Error(data.error || 'Failed to fetch');
      }
      setMessages((prev) => [...prev, { author: 'assistant', content: data.botReply }]);
    } catch (err) {
      console.error('Chat API error:', err);
      toast.error('Error contacting server. Please try again.');
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[75]">
        <Magnetic strength={0.45}>
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            data-cursor="link"
            data-cursor-label={isOpen ? 'Close' : 'Ask'}
            aria-label={isOpen ? 'Close chat' : 'Open chat'}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-border-hover bg-bg-card/80 text-text-primary backdrop-blur-md transition-colors duration-500 hover:border-accent-primary hover:text-accent-primary"
          >
            <span data-magnetic-inner className="flex">
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <MessageCircleQuestion className="h-5 w-5" />
              )}
            </span>
          </button>
        </Magnetic>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[74] flex h-[26rem] w-[min(21rem,calc(100vw-3rem))] flex-col border border-border-hover bg-bg-card/95 shadow-lift backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-border-default px-5 py-4">
            <span className="text-fluid--2 uppercase tracking-[0.24em] text-text-secondary">
              Saarthi
            </span>
            <span className="flex items-center gap-2 text-fluid--2 uppercase tracking-[0.2em] text-text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Online
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            <div className="flex flex-col gap-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.author === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <p
                    className={`max-w-[85%] px-3 py-2 text-fluid--1 leading-relaxed ${
                      msg.author === 'user'
                        ? 'bg-accent-primary text-text-inverse'
                        : 'border border-border-default text-text-secondary'
                    }`}
                  >
                    {msg.content}
                  </p>
                </div>
              ))}
              {pending && (
                <p className="text-fluid--2 uppercase tracking-[0.2em] text-text-muted">
                  Thinking…
                </p>
              )}
              <div ref={scrollRef} />
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 border-t border-border-default px-5 py-4"
          >
            <input
              type="text"
              className="field py-2 text-fluid--1"
              placeholder="Ask something…"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              aria-label="Message"
            />
            <button
              type="submit"
              disabled={pending}
              data-cursor="link"
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-default text-text-secondary transition-colors duration-500 hover:border-accent-primary hover:text-accent-primary disabled:opacity-50"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
    </>
  );
}
