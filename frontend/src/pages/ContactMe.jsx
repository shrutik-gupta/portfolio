import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import emailjs from '@emailjs/browser';
import axios from 'axios';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '../lib/motion';
import KineticText from '../components/KineticText';
import Magnetic from '../components/Magnetic';

const VeilCanvas = lazy(() => import('../three/VeilCanvas'));

const CHANNELS = [
  {
    label: 'Email',
    value: 'shrutikgupta07@gmail.com',
    href: 'mailto:shrutikgupta07@gmail.com',
  },
  {
    label: 'LinkedIn',
    value: 'in/shrutik-gupta',
    href: 'https://www.linkedin.com/in/shrutik-gupta',
  },
  {
    label: 'GitHub',
    value: 'shrutik-gupta',
    href: 'https://github.com/shrutik-gupta',
  },
];

const STATUS_COPY = {
  idle: '',
  sending: 'Sending…',
  sent: 'Message sent. I’ll reply soon.',
  error: 'That didn’t go through. Try again, or email me directly.',
};

const ContactMe = () => {
  const root = useRef(null);
  const hoverRef = useRef(0); // feeds the shader's warm bloom
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [localTime, setLocalTime] = useState('');

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

  useGSAP(
    () => {
      gsap.set('[data-anim]', { visibility: 'visible' });
      if (prefersReducedMotion()) return;

      gsap.from('[data-contact-line]', {
        y: 28,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.07,
        ease: 'sweep',
        scrollTrigger: { trigger: root.current, start: 'top 65%', once: true },
      });
    },
    { scope: root },
  );

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
    <section
      id="contact"
      ref={root}
      className="relative w-full overflow-hidden bg-bg-primary"
      onPointerEnter={() => {
        hoverRef.current = 1;
      }}
      onPointerLeave={() => {
        hoverRef.current = 0;
      }}
    >
      <div className="fill-parent z-0">
        <Suspense fallback={null}>
          <VeilCanvas hoverRef={hoverRef} />
        </Suspense>
        <div className="vignette" />
      </div>

      <div className="relative z-10 px-gutter py-[clamp(5rem,14vh,11rem)]">
        <div className="mb-16 flex flex-col gap-6">
          <div className="line-mask">
            <p data-anim className="eyebrow">
              <span className="text-accent-primary">05</span> Contact
            </p>
          </div>
          <KineticText
            as="h2"
            className="max-w-[13ch] text-fluid-7 leading-[0.9] text-text-primary"
            stagger={0.1}
          >
            Let’s build something worth shipping.
          </KineticText>
        </div>

        <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:gap-24">
          {/* Channels */}
          <div className="flex flex-col gap-12">
            <p data-contact-line data-anim className="measure text-fluid-0 text-text-secondary">
              Have a project, a role, or a half-formed idea? Send it over. I read
              everything, and I answer what I can help with.
            </p>

            <ul className="flex flex-col">
              {CHANNELS.map((c) => (
                <li key={c.label} data-contact-line data-anim>
                  <Magnetic strength={0.18} className="block w-full" as="div">
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="link"
                      className="group flex items-baseline justify-between gap-6 border-t border-border-default py-6"
                    >
                      <span className="text-fluid--2 uppercase tracking-[0.24em] text-text-muted">
                        {c.label}
                      </span>
                      <span className="flex items-center gap-3 text-fluid-1 text-text-primary transition-colors duration-500 group-hover:text-accent-primary">
                        <span data-magnetic-inner>{c.value}</span>
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-1 group-hover:translate-x-1" />
                      </span>
                    </a>
                  </Magnetic>
                </li>
              ))}
            </ul>

            <div
              data-contact-line
              data-anim
              className="flex flex-wrap gap-x-10 gap-y-4 border-t border-border-default pt-6 text-fluid--2 uppercase tracking-[0.24em] text-text-muted"
            >
              <span>
                Mumbai <span className="text-accent-primary">·</span> {localTime} IST
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Open to work
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div data-contact-line data-anim className="flex flex-col gap-2">
              <label
                htmlFor="c-name"
                className="text-fluid--2 uppercase tracking-[0.24em] text-text-muted"
              >
                Your name
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
                placeholder="Jane Doe"
              />
            </div>

            <div data-contact-line data-anim className="flex flex-col gap-2">
              <label
                htmlFor="c-email"
                className="text-fluid--2 uppercase tracking-[0.24em] text-text-muted"
              >
                Email
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
                placeholder="jane@studio.com"
              />
            </div>

            <div data-contact-line data-anim className="flex flex-col gap-2">
              <label
                htmlFor="c-message"
                className="text-fluid--2 uppercase tracking-[0.24em] text-text-muted"
              >
                Message
              </label>
              <textarea
                id="c-message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
                className="field resize-none"
                placeholder="What are you building?"
              />
            </div>

            <div data-contact-line data-anim className="flex flex-wrap items-center gap-6">
              <Magnetic strength={0.4}>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  data-cursor="link"
                  className="group relative flex items-center gap-3 overflow-hidden rounded-full border border-accent-primary px-8 py-4 text-fluid--1 font-medium uppercase tracking-[0.16em] text-accent-primary transition-colors duration-500 ease-out-expo hover:text-text-inverse disabled:cursor-wait disabled:opacity-60"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-accent-primary transition-transform duration-500 ease-out-expo group-hover:scale-y-100"
                  />
                  <span data-magnetic-inner className="flex items-center gap-3">
                    {status === 'sending' ? 'Sending' : 'Send message'}
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </button>
              </Magnetic>

              <p
                role="status"
                aria-live="polite"
                className={`text-fluid--1 ${
                  status === 'error' ? 'text-error' : 'text-text-secondary'
                }`}
              >
                {STATUS_COPY[status]}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactMe;
