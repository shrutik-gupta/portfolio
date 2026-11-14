import React, { useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import axios from 'axios';
import { useReveal } from '../lib/reveal';
import { useAudience } from '../lib/audience';
import KineticText from '../components/KineticText';
import Magnetic from '../components/Magnetic';
import { ArrowRight } from '../components/Doodles';
import { CONTACT } from '../helper/ProfileHelper';
import logo from '../assets/logo.png';

const STATUS_COPY = {
  idle: '',
  sending: 'Sending…',
  sent: 'Message sent. I’ll reply soon.',
  error: 'That didn’t go through. Try again, or email me directly.',
};

/** The same form, opened with the question each visitor came to ask. */
const VOICE = {
  default: {
    heading: 'Write to me.',
    intro: 'A project, a role, or a half-formed idea — send it over. I read everything.',
    placeholder: 'What’s on your mind?',
  },
  hire: {
    heading: 'Hiring? Let’s talk.',
    intro: 'Tell me about the role, the team, and what you’re building.',
    placeholder: 'The role, the team, and when you’d like to talk…',
  },
  freelance: {
    heading: 'Tell me about your project.',
    intro: 'A few plain lines is enough: what you need, who it’s for, and roughly when.',
    placeholder: 'I need a website / app that…',
  },
  wander: {
    heading: 'Say hello.',
    intro: 'No reason needed. If you liked something here, I’d love to hear it.',
    placeholder: 'Hi Shrutik…',
  },
};

/**
 * Contact, as a postcard: message on the left, stamp and "from" lines on
 * the right. The submission flow underneath is unchanged.
 */
const ContactMe = () => {
  const root = useRef(null);
  const { audience } = useAudience();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [localTime, setLocalTime] = useState('');

  const voice = VOICE[audience] || VOICE.default;

  useReveal(root);

  // Live local time — a small signal that a person is on the other end.
  useEffect(() => {
    const update = () =>
      setLocalTime(
        new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Kolkata',
        }).format(new Date()),
      );
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    const BASE_URL = import.meta.env.VITE_BACKEND_URL;

    try {
      // 1. Persist the enquiry.
      const res = await axios.post(`${BASE_URL}/query/add`, formData);

      if (res.status === 201) {
        // 2. Notify admin.
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ADMIN_ID,
          { ...formData, to_email: import.meta.env.VITE_ADMIN_EMAIL },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        );

        // 3. Confirm to sender.
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_USER_ID,
          formData,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        );

        setStatus('sent');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Contact submission failed:', error);
      setStatus('error');
    }
  };

  return (
    <section id="contact" ref={root} className="relative w-full overflow-x-clip py-[clamp(5rem,13vh,10rem)]">
      <div className="shell">
        <header className="mb-[clamp(2.5rem,7vh,5rem)] grid gap-x-16 gap-y-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p data-reveal className="label mb-4 text-accent-primary">
              Contact
            </p>
            {/* Keyed so the heading re-runs its entrance when the route changes. */}
            <KineticText
              key={voice.heading}
              as="h2"
              className="text-fluid-7 text-text-primary"
              stagger={0.1}
            >
              {voice.heading}
            </KineticText>
          </div>
          <p data-reveal className="measure text-fluid-0 text-text-secondary lg:col-span-4">
            {voice.intro}
          </p>
        </header>

        <div className="grid gap-x-16 gap-y-14 lg:grid-cols-12">
          {/* --- The postcard --- */}
          <div data-reveal="drop" className="lg:col-span-8">
            <form
              onSubmit={handleSubmit}
              className="paper relative grid -rotate-1 gap-x-10 gap-y-8 p-6 shadow-print transition-transform duration-700 ease-out-expo focus-within:rotate-0 sm:p-9 md:grid-cols-[1.25fr_1fr]"
            >
              {/* Message side */}
              <div className="flex flex-col gap-2">
                <label htmlFor="c-message" className="label text-text-muted">
                  Message
                </label>
                <textarea
                  id="c-message"
                  name="message"
                  rows="7"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  data-lenis-prevent
                  className="field field--ruled resize-none"
                  placeholder={voice.placeholder}
                />
              </div>

              {/* Address side */}
              <div className="flex flex-col gap-6 md:border-l-2 md:border-text-primary/25 md:pl-10">
                <div className="flex items-start justify-between gap-4">
                  {/* Postmark: live Mumbai time */}
                  <div
                    aria-hidden="true"
                    className="grid h-20 w-20 -rotate-12 place-items-center rounded-full border-2 border-accent-secondary text-center text-accent-secondary"
                  >
                    <span className="label text-[0.58rem] leading-tight">
                      Mumbai
                      <span className="block font-display text-base font-semibold tracking-normal">
                        {localTime}
                      </span>
                      IST
                    </span>
                  </div>
                  {/* Stamp */}
                  <div className="postage rotate-3" aria-hidden="true">
                    <div className="grid h-20 w-16 place-items-center bg-bg-hover">
                      <img src={logo} alt="" className="h-10 w-10 object-contain" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="c-name" className="label text-text-muted">
                    From
                  </label>
                  <input
                    id="c-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    className="field"
                    placeholder="Your name"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="c-email" className="label text-text-muted">
                    Reply to
                  </label>
                  <input
                    id="c-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className="field"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="mt-auto flex flex-col gap-3 pt-2">
                  <Magnetic strength={0.2}>
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      data-cursor-label="Post it"
                      className="stamp stamp--solid"
                    >
                      <span data-magnetic-inner className="flex items-center gap-3">
                        {status === 'sending' ? 'Sending' : 'Send message'}
                        <ArrowRight className="h-4 w-6" />
                      </span>
                    </button>
                  </Magnetic>

                  <p
                    role="status"
                    aria-live="polite"
                    className={`min-h-[1.5em] text-fluid--1 ${
                      status === 'error' ? 'text-error' : 'text-text-secondary'
                    }`}
                  >
                    {STATUS_COPY[status]}
                  </p>
                </div>
              </div>

              {/* Rubber stamp that lands when the message has gone. */}
              {status === 'sent' && (
                <span
                  aria-hidden="true"
                  className="display pointer-events-none absolute left-[12%] top-[22%] animate-stamp-in border-4 border-accent-primary px-4 py-1 text-fluid-5 uppercase text-accent-primary opacity-90"
                >
                  Posted
                </span>
              )}
            </form>
          </div>

          {/* --- Other ways in --- */}
          <aside className="flex flex-col gap-8 lg:col-span-4">
            <ul className="flex flex-col border-t-2 border-text-primary">
              {CONTACT.channels.map((c) => (
                <li key={c.label} data-reveal>
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col gap-1 border-b border-text-primary/25 py-5"
                  >
                    <span className="label text-text-muted">{c.label}</span>
                    <span className="flex items-center justify-between gap-4 font-display text-fluid-1 font-semibold [overflow-wrap:anywhere] leading-tight text-text-primary transition-colors group-hover:text-accent-primary">
                      {c.value}
                      <ArrowRight className="h-4 w-7 shrink-0 text-accent-primary transition-transform duration-300 group-hover:translate-x-1.5" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div data-reveal className="flex flex-col gap-3 text-fluid--1 text-text-secondary">
              <p className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-success" aria-hidden="true" />
                Open to work
              </p>
              <p>
                It’s <span className="font-semibold text-text-primary">{localTime}</span> in Mumbai right now.
              </p>
              <a
                href={CONTACT.resume}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-label="PDF"
                className="link-ink w-fit font-semibold text-text-primary"
              >
                Résumé ↗
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default ContactMe;
