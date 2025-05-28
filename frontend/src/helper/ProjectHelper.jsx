import portfolio from '../assets/project-portfolio.png'
import ems from '../assets/project-ems.png'
import rakshak from '../assets/project-rakshak.png'
import ims from '../assets/project-ims.png'
const projects = {
  project1: {
    image: portfolio,
    name: "Personal Portfolio",
    description:
      "This portfolio is a modern and responsive web application built to showcase my skills, experience, and projects. Designed with a clean UI and smooth animations, it highlights my work as a developer through an engaging and interactive experience. The site features sections like About, Projects, Experience, and Contact, and is optimized for performance across all devices.",
    tech: ["React.js", "Tailwind CSS", "tsParticle", "GSAP", "MongoDB", "Node.js", "Express.js"],
    link: "https://github.com/shrutik-gupta/portfolio",
  },
  project2: {
    image: ims,
    name: "StockiFy : Inventory Management System",
    description:
      "StockiFy, a Python-based inventory management system, streamlines inventory management for businesses of all sizes. Its intuitive interface and powerful features simplify inventory, employee, and sales tracking, optimizing operational efficiency.",
    tech: ["Python", "MySQL"],
    link: "https://github.com/shrutik-gupta/StockiFy--Inventory-Management-System",
  },
  project3: {
    image: rakshak,
    name: "Rakshak : Community Safety App",
    description:
      "Rakshak is a dual-portal web application designed to enhance public safety and streamline law enforcement operations. The citizen portal empowers users to report crimes easily, view local complaints, engage in community discussions, and receive safe route suggestions. Meanwhile, the officer portal provides tools for efficient complaint management, access to criminal databases, and real-time responses. Key features include an intuitive user interface, AI-powered image analysis, facial recognition for criminal identification, a dynamic complaint dashboard, and an integrated community forum—together fostering transparency, accountability, and proactive crime prevention.",
    tech: ["React.js", "MongoDB", "Node.js", "Express.js"],
    link: "https://github.com/shrutik-gupta/Rakshak",
  },
  project4: {
    image: ems,
    name: "FirmBuddy : Exmployee Management System",
    description:
      "FirmBuddy is a minimalistic Emplooyee Management System designed to help organization keep track of their workforce. It provide a clean and intuitive interface for admin to manage their emplooyees (salaries, departments, leaves). This README file provides an overview of the project, its features, installation instructions, and usage.",
    tech: ["React.js", "MongoDB", "Node.js", "Express.js"],
    link: "https://github.com/shrutik-gupta/FirmBuddy---Employee-Management-System",
  },
};

export default projects;
