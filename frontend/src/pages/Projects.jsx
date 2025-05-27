import React from 'react'
import { ArrowRight, Github, Linkedin, Mail, Download, Code, Briefcase, User, MessageSquare } from 'lucide-react';

const Projects = () => {
  return (
    <div>
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">My Projects</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Here are some of the projects I've worked on recently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((project) => (
              <div key={project} className="bg-bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img
                  src={`https://via.placeholder.com/400x250?text=Project+${project}`}
                  alt={`Project ${project}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-text-primary mb-2">Project {project}</h3>
                  <p className="text-text-secondary mb-4">
                    A brief description of this amazing project and what it accomplishes.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-accent-primary/10 text-accent-primary px-2 py-1 rounded text-sm">React</span>
                    <span className="bg-accent-primary/10 text-accent-primary px-2 py-1 rounded text-sm">Node.js</span>
                    <span className="bg-accent-primary/10 text-accent-primary px-2 py-1 rounded text-sm">MongoDB</span>
                  </div>
                  <div className="flex gap-4">
                    <a href="#" className="text-accent-primary hover:text-accent-secondary transition-colors flex items-center gap-1">
                      <Code className="w-4 h-4" />
                      Code
                    </a>
                    <a href="#" className="text-accent-primary hover:text-accent-secondary transition-colors flex items-center gap-1">
                      <ArrowRight className="w-4 h-4" />
                      Demo
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Projects
