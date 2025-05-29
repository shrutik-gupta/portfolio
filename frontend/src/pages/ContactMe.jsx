import React, { useState } from 'react';
import axios from 'axios';
import { Github, Linkedin, Mail, MessageSquare } from 'lucide-react';

const ContactMe = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const BASE_URL = import.meta.env.VITE_BACKEND_URL;

      const res = await axios.post(`${BASE_URL}/query/add`, formData);
      if (res.status === 201) {
        setStatus('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('Failed to send message. Please try again later.');
    }
  };

  return (
    <div>
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">Get In Touch</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              I'm always open to discussing new opportunities and interesting projects
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-text-primary mb-6">Let's Connect</h3>
              <p className="text-text-secondary mb-8">
                Whether you have a project in mind, want to collaborate, or just want to say hello,
                I'd love to hear from you.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <a href="mailto:shrutikgupta07@gmail.com" target="_blank" className="text-text-secondary hover:text-accent-primary transition-colors">
                    <Mail className="w-6 h-6" />
                  </a>
                  <span className="text-text-secondary">shrutikgupta07@gmail.com</span>
                </div>
                <div className="flex items-center gap-4">
                  <a href="https://www.linkedin.com/in/shrutik-gupta" target="_blank" className="text-text-secondary hover:text-accent-primary transition-colors">
                    <Linkedin className="w-6 h-6" />
                  </a>
                  <span className="text-text-secondary">linkedin.com/in/shrutik-gupta</span>
                </div>
                <div className="flex items-center gap-4">
                  <a href="https://github.com/shrutik-gupta" target="_blank" className="text-text-secondary hover:text-accent-primary transition-colors">
                    <Github className="w-6 h-6" />
                  </a>
                  <span className="text-text-secondary">github.com/shrutik-gupta</span>
                </div>
              </div>
            </div>

            <div className="bg-bg-card rounded-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-text-primary font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-bg-primary border border-border-default text-text-primary focus:outline-none focus:border-accent-primary transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-text-primary font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-bg-primary border border-border-default text-text-primary focus:outline-none focus:border-accent-primary transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-text-primary font-medium mb-2">Message</label>
                  <textarea
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-bg-primary border border-border-default text-text-primary focus:outline-none focus:border-accent-primary transition-colors resize-none"
                    placeholder="Tell me about your project..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-accent-primary text-text-inverse py-3 rounded-lg font-semibold hover:bg-accent-secondary transition-colors flex items-center justify-center gap-2"
                >
                  Send Message <MessageSquare className="w-4 h-4" />
                </button>
                {status && <p className="text-sm text-text-secondary mt-2">{status}</p>}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactMe;
