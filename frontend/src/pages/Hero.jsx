import React from 'react'
import { ArrowRight, Github, Linkedin, Mail, Download, Code, Briefcase, User, MessageSquare } from 'lucide-react';

const Hero = () => {
    return (
        <div>
            <section id="hero" className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="mx-auto text-center bg-bg-secondary px-[10%] py-[3%] rounded-3xl mb-[5%]">
                    <div className="mb-8">
                        <img
                            src="https://via.placeholder.com/150"
                            alt="Profile"
                            className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-accent-primary"
                        />
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-4">
                            Hi, I'm <span className="text-accent-primary">John Doe</span>
                        </h1>
                        <p className="text-xl sm:text-2xl text-text-secondary mb-8">
                            Full Stack Developer & UI/UX Designer
                        </p>
                        <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
                            I create beautiful, functional, and user-centered digital experiences.
                            Let's build something amazing together.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                        <button className="bg-accent-primary text-text-inverse px-8 py-3 rounded-lg font-semibold hover:bg-accent-secondary transition-colors flex items-center gap-2">
                            Get In Touch <ArrowRight className="w-4 h-4" />
                        </button>
                        <button className="border border-border-default text-text-primary px-8 py-3 rounded-lg font-semibold hover:bg-bg-hover transition-colors flex items-center gap-2">
                            Download CV <Download className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex justify-center gap-6">
                        <a href="#" className="text-text-secondary hover:text-accent-primary transition-colors">
                            <Github className="w-6 h-6" />
                        </a>
                        <a href="#" className="text-text-secondary hover:text-accent-primary transition-colors">
                            <Linkedin className="w-6 h-6" />
                        </a>
                        <a href="#" className="text-text-secondary hover:text-accent-primary transition-colors">
                            <Mail className="w-6 h-6" />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Hero
