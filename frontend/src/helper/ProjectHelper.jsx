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
      "Rakshak is a dual-portal web app that boosts public safety and streamlines law enforcement. Citizens can report crimes, view local complaints, join community forums, and get safe route suggestions. Officers get tools for complaint management, criminal database access, and real-time response. Features include AI-driven image analysis, facial recognition, a dynamic dashboard, and an intuitive UI—promoting transparency, accountability, and proactive crime prevention.",
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
