import React, { useState, useRef, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { X } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import { ArrowRight } from './Doodles';

/**
 * Saarthi — a small assistant that answers questions about Shrutik.
 * It lives on a sticky note in the corner and opens into a notepad.
 * Presentation only; the request flow is unchanged.
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
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    inputRef.current?.focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

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
      {/* The sticky note */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? 'Close chat' : 'Ask Saarthi, the assistant'}
        aria-expanded={isOpen}
        className="fixed bottom-[calc(var(--dock)+1rem)] right-4 z-[75] flex rotate-3 items-center gap-2 border-2 bg-highlight px-3.5 py-2 shadow-hard transition-transform duration-300 ease-spring hover:-translate-y-1 hover:rotate-0 active:translate-y-0.5 sm:right-6 lg:bottom-6"
        style={{ color: 'rgb(var(--marker-ink))', borderColor: 'rgb(var(--marker-ink))', boxShadow: '4px 4px 0 rgb(var(--marker-ink))' }}
      >
        {isOpen ? (
          <>
            <X className="h-4 w-4" aria-hidden="true" />
            <span className="hand text-[1.35rem]">close</span>
          </>
        ) : (
          <span className="hand text-[1.2rem] sm:text-[1.35rem]">
            ask<span className="hidden sm:inline"> me anything</span>
            <span className="sm:hidden"> me</span>
          </span>
        )}
      </button>

      {/* The notepad */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Chat with Saarthi"
          className="paper fixed bottom-[calc(var(--dock)+4.75rem)] right-4 z-[74] flex h-[min(28rem,calc(100svh-var(--dock)-7rem))] w-[min(22rem,calc(100vw-2rem))] animate-pop-in flex-col border-2 border-text-primary shadow-hard sm:right-6 lg:bottom-[5.25rem]"
        >
          <div className="flex items-baseline justify-between border-b-2 border-text-primary px-4 py-3">
            <span className="font-display text-fluid-1 font-semibold">Saarthi</span>
            <span className="label text-text-muted">Knows about Shrutik</span>
          </div>

          <div data-lenis-prevent className="flex-1 overflow-y-auto px-4 py-4">
            <div className="flex flex-col gap-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.author === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <p
                    className={`max-w-[88%] whitespace-pre-wrap text-fluid--1 leading-relaxed ${
                      msg.author === 'user'
                        ? 'bg-highlight px-3 py-2 text-text-primary'
                        : 'border-l-2 border-accent-primary pl-3 text-text-primary'
                    }`}
                  >
                    {msg.content}
                  </p>
                </div>
              ))}
              {pending && <p className="hand text-text-muted">thinking…</p>}
              <div ref={scrollRef} />
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-3 border-t-2 border-text-primary px-4 py-3"
          >
            <input
              ref={inputRef}
              type="text"
              className="field py-1.5 text-fluid--1"
              placeholder="Ask something…"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              aria-label="Message"
            />
            <button
              type="submit"
              disabled={pending}
              aria-label="Send message"
              className="grid h-9 w-11 shrink-0 place-items-center border-2 border-text-primary bg-accent-primary text-text-inverse transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-50"
            >
              <ArrowRight className="h-4 w-6" />
            </button>
          </form>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={3000} theme="light" />
    </>
  );
}
