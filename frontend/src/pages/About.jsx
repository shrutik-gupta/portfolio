import React from 'react'
import { ArrowRight, Github, Linkedin, Mail, Download, Code, Briefcase, User, MessageSquare } from 'lucide-react';

const About = () => {
  return (
    <div>
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-bg-secondary scroll-mt-[60px]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">About Me</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              I'm a passionate developer with a love for creating innovative solutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://via.placeholder.com/500x400"
                alt="About me"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-text-primary mb-6">My Story</h3>
              <p className="text-text-secondary mb-6">
                With over 5 years of experience in web development, I've had the privilege 
                of working with startups and established companies to bring their digital 
                visions to life.
              </p>
              <p className="text-text-secondary mb-6">
                I specialize in React, Node.js, and modern web technologies. I'm passionate 
                about clean code, user experience, and continuous learning.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-bg-card p-4 rounded-lg">
                  <h4 className="font-semibold text-text-primary mb-2">Frontend</h4>
                  <p className="text-text-secondary text-sm">React, Vue, TypeScript</p>
                </div>
                <div className="bg-bg-card p-4 rounded-lg">
                  <h4 className="font-semibold text-text-primary mb-2">Backend</h4>
                  <p className="text-text-secondary text-sm">Node.js, Python, PostgreSQL</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
