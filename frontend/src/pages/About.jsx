import React from 'react'
import { ArrowRight, Github, Linkedin, Mail, Download, Code, Briefcase, User, MessageSquare } from 'lucide-react';

const About = () => {
  return (
    <div>
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-bg-secondary scroll-mt-[60px]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">About Me</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              I'm a passionate developer with a love for creating impactful solutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className='relative mx-auto p-5 rounded-3xl bg-bg-primary'>
              <div className="grid grid-cols-1 gap-4 mb-2">
                <div className="bg-bg-card p-4 rounded-lg">
                  <h4 className="font-semibold text-text-primary mb-2">Programming Languages</h4>
                  <p className="text-text-secondary text-sm">C++, Python</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div className="bg-bg-card p-4 rounded-lg">
                  <h4 className="font-semibold text-text-primary mb-2">Web Technologies</h4>
                  <p className="text-text-secondary text-sm">Node.js, Javascript, HTML, CSS</p>
                </div>
                <div className="bg-bg-card p-4 rounded-lg">
                  <h4 className="font-semibold text-text-primary mb-2">Libraries and Frameworks</h4>
                  <p className="text-text-secondary text-sm">React.js, Express.js, Tailwind CSS</p>
                </div>
              </div>             
              <div className="grid grid-cols-2 gap-4  mb-2">
                <div className="bg-bg-card p-4 rounded-lg">
                  <h4 className="font-semibold text-text-primary mb-2">Databases</h4>
                  <p className="text-text-secondary text-sm">MongoDB, MySQL</p>
                </div>

                <div className="bg-bg-card p-4 rounded-lg">
                  <h4 className="font-semibold text-text-primary mb-2">Version Control</h4>
                  <p className="text-text-secondary text-sm">Git, GitHub</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-bg-card p-4 rounded-lg">
                  <h4 className="font-semibold text-text-primary mb-2">Core Competencies</h4>
                  <p className="text-text-secondary text-sm">DSA, OOP, DBMS, REST API Development</p>
                </div>
              </div>

            </div>
            <div className='relative mx-auto p-5 rounded-3xl bg-bg-surface'>
              <h3 className="text-2xl font-bold text-text-primary mb-6">In A Nutshell...</h3>
              <p className="text-text-secondary mb-6">
                When I’m not debugging code, I’m probably getting clean bowled by a syntax error, much like I do facing a googly on the cricket pitch. My code commits are as unpredictable as my vlogs—some are <i>cinematic masterpieces</i>, others... just raw footage of me yelling at the screen. And when the bugs get too loud, I let my piano take over—because sometimes, the only way to fix a broken feature is to play a sad tune in D minor and hope the compiler feels guilty. 
              </p>
              <p className="text-text-secondary mb-6">
                Honestly, I spend more time talking to AI than actual people—am I proud? Not really. Will I stop? Absolutely not. But don’t worry, I can still write clean code without whispering to a robot every five minutes.
              </p>


            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
