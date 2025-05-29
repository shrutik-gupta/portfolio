import React from 'react'
import {Github, Linkedin, Mail, MessageSquare } from 'lucide-react';

const ContactMe = () => {
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
                  <Mail className="w-5 h-5 text-accent-primary" />
                  <span className="text-text-secondary">john.doe@example.com</span>
                </div>
                <div className="flex items-center gap-4">
                  <Linkedin className="w-5 h-5 text-accent-primary" />
                  <span className="text-text-secondary">linkedin.com/in/johndoe</span>
                </div>
                <div className="flex items-center gap-4">
                  <Github className="w-5 h-5 text-accent-primary" />
                  <span className="text-text-secondary">github.com/johndoe</span>
                </div>
              </div>
            </div>

            <div className="bg-bg-card rounded-lg p-8">
              <form className="space-y-6">
                <div>
                  <label className="block text-text-primary font-medium mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg bg-bg-primary border border-border-default text-text-primary focus:outline-none focus:border-accent-primary transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-text-primary font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg bg-bg-primary border border-border-default text-text-primary focus:outline-none focus:border-accent-primary transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-text-primary font-medium mb-2">Message</label>
                  <textarea
                    rows="5"
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
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactMe
