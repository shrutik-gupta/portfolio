import portfolio from '../assets/project-portfolio.png';
import rakshak from '../assets/project-rakshak.png';
import gewodo from '../assets/project-gewodo.png';
import mindqueue from '../assets/project-mindqueue.png';

/**
 * Ordered for the horizontal scrubber — the first entry is the anchor
 * case study, so it carries the strongest imagery and the longest read.
 */
const projects = [
  {
    id: 'mindqueue',
    image: mindqueue,
    name: 'MindQueue',
    subtitle: 'Multi-Agent AI Research System',
    year: '2026',
    role: 'AI Engineering · System Architecture',
    description:
      'A 4-agent AI system (Search, Reader, Writer, Critic) built to automate end-to-end research workflows, processing real-time web sources to generate structured reports with high content coherence.',
    tech: ['Python', 'LangChain', 'Tavily API', 'BeautifulSoup', 'Streamlit', 'MistralAI'],
    link: 'https://mindqueue.streamlit.app/',
    linkLabel: 'Live site',
  },
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
