import React from 'react';
import { ArrowRight, Github, Linkedin, Mail, Download } from 'lucide-react';
import profile from '../assets/profile.png';
import process from 'process';
import HeroParticle from '../components/HeroParticle';

const Hero = () => {
    const backendBaseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';
    return (
        <section id="hero" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="absolute inset-0 z-0">
                <HeroParticle />
            </div>
            <div className="relative mx-auto text-center bg-bg-secondary px-[10%] py-[3%] rounded-3xl mb-[5%] z-10"> {/* Added relative and z-10 for content to be above particles */}
                <div className="mb-8">
                    <img
                        src={profile}
                        alt="Profile"
                        className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-accent-primary"
                    />
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-4">
                        Hi, I'm <span className="text-accent-primary">Shrutik Gupta</span>
                    </h1>
                    <p className="text-xl sm:text-2xl text-text-secondary mb-8">
                        Full Stack Developer
                    </p>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
                        I create beautiful, functional, and user-centered digital experiences.
                        Let's build something amazing together.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                    <button onClick={() => {
                        const contactSection = document.getElementById('contact');
                        if (contactSection) {
                            contactSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    }} className="bg-accent-primary text-text-inverse px-8 py-3 rounded-lg font-semibold hover:bg-accent-secondary transition-colors flex items-center gap-2">
                        Get In Touch <ArrowRight className="w-4 h-4" />
                    </button>
                    <a
                        href={`${backendBaseUrl}/uploads/resume.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-border-default text-text-primary px-8 py-3 rounded-lg font-semibold hover:bg-bg-hover transition-colors flex items-center gap-2"
                    >
                        Resume <Download className="w-4 h-4" />
                    </a>
                </div>

                <div className="flex justify-center gap-6">
                    <a href="https://github.com/shrutik-gupta" target='_blank' className="text-text-secondary hover:text-accent-primary transition-colors">
                        <Github className="w-6 h-6" />
                    </a>
                    <a href="https://www.linkedin.com/in/shrutik-gupta" target='_blank' className="text-text-secondary hover:text-accent-primary transition-colors">
                        <Linkedin className="w-6 h-6" />
                    </a>
                    <a href="mailto:shrutikgupta07@gmail.com" target='_blank' className="text-text-secondary hover:text-accent-primary transition-colors">
                        <Mail className="w-6 h-6" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hero;