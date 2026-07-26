import portfolio from '../assets/project-portfolio.png';
import ems from '../assets/project-ems.png';
import rakshak from '../assets/project-rakshak.png';
import ims from '../assets/project-ims.png';
import gewodo from '../assets/project-gewodo.png';

/**
 * Ordered for the horizontal scrubber — the first entry is the anchor
 * case study, so it carries the strongest imagery and the longest read.
 */
const projects = [
  {
    id: 'gewodo',
    image: gewodo,
    name: 'GeWoDo',
    subtitle: 'AI-Powered Home Services Marketplace',
    year: '2025',
    role: 'Full-stack · Agent orchestration',
    description:
      'An agentic service marketplace that automates negotiation between workers and clients. Beyond the marketplace, an AI-driven training and certification module generates practical assessments and learning paths from worker performance.',
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT Auth', 'LLM Orchestration'],
    link: 'https://gewodo.vercel.app',
    linkLabel: 'Live site',
  },
  {
    id: 'rakshak',
    image: rakshak,
    name: 'Rakshak',
    subtitle: 'Community Safety Platform',
    year: '2024',
    role: 'Full-stack · Dual-portal system',
    description:
      'A dual-portal web app for public safety. Citizens report crimes, follow local complaints, join community forums and get safer route suggestions; officers get complaint management, database access and real-time response — with AI image analysis and facial recognition behind it.',
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB'],
    link: 'https://github.com/shrutik-gupta/Rakshak',
    linkLabel: 'Source',
  },
  {
    id: 'stockify',
    image: ims,
    name: 'StockiFy',
    subtitle: 'Inventory Management System',
    year: '2024',
    role: 'Application · Data modelling',
    description:
      'A Python inventory system for businesses of any size. One interface for stock, employees and sales tracking, built around a relational schema that keeps reporting fast as the catalogue grows.',
    tech: ['Python', 'MySQL'],
    link: 'https://github.com/shrutik-gupta/StockiFy--Inventory-Management-System',
    linkLabel: 'Source',
  },
  {
    id: 'firmbuddy',
    image: ems,
    name: 'FirmBuddy',
    subtitle: 'Employee Management System',
    year: '2024',
    role: 'Full-stack · Admin tooling',
    description:
      'A deliberately minimal employee management system: salaries, departments and leave in one clean admin surface, designed so an operator can learn the whole tool in a single sitting.',
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB'],
    link: 'https://github.com/shrutik-gupta/FirmBuddy---Employee-Management-System',
    linkLabel: 'Source',
  },
  {
    id: 'portfolio',
    image: portfolio,
    name: 'This Portfolio',
    subtitle: 'WebGL + Scroll Experience',
    year: '2026',
    role: 'Design · Creative engineering',
    description:
      'A hand-built portfolio running a single render loop: Lenis momentum scrolling driven by GSAP’s ticker, ScrollTrigger for pinned and scrubbed sequences, and instanced GLSL fields for the ambient 3D layers.',
    tech: ['React.js', 'Three.js', 'GSAP', 'Lenis', 'Tailwind CSS'],
    link: 'https://github.com/shrutik-gupta/portfolio',
    linkLabel: 'Source',
  },
];

export default projects;
