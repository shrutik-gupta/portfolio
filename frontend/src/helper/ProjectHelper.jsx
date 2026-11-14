import portfolio from '../assets/project-portfolio.png';
import rakshak from '../assets/project-rakshak.png';
import gewodo from '../assets/project-gewodo.png';
import mindqueue from '../assets/project-mindqueue.png';

/**
 * Ordered for the wall — the first entry gets the biggest print.
 * `note` is the handwritten caption under the print (optional).
 */
const projects = [
  {
    id: 'mindqueue',
    image: mindqueue,
    name: 'Mind Queue',
    subtitle: 'An AI research team in a box',
    year: '2026',
    role: 'AI system',
    description:
      'Four AI agents that do research for you. One searches the web, one reads the pages, one writes the report and one critiques it. Each question pulls from 10+ live sources and comes back as a structured report.',
    tech: ['Python', 'LangChain', 'Tavily API', 'BeautifulSoup', 'Streamlit', 'MistralAI'],
    link: 'https://mindqueue.streamlit.app/',
    linkLabel: 'Live site',
    note: 'four agents, one report',
  },
  {
    id: 'gewodo',
    image: gewodo,
    name: 'GeWoDo',
    subtitle: 'A home services marketplace, with AI',
    year: '2025',
    role: 'Full-stack',
    description:
      'A marketplace with two portals: one for people who need work done at home, one for the professionals who do it. An AI engine runs the bidding in real time, face recognition checks identities, and a certification centre writes training and tests for each worker.',
    tech: ['React', 'Node.js', 'MongoDB Change Streams', 'Ollama (Llama 3.2)'],
    link: 'https://gewodo.vercel.app',
    linkLabel: 'Live site',
    note: 'the big one',
  },
  {
    id: 'rakshak',
    image: rakshak,
    name: 'Rakshak',
    subtitle: 'A community safety platform',
    year: '2024',
    role: 'Full-stack',
    description:
      'Two portals for public safety. Citizens report crimes, follow local complaints, talk in community forums and get safer route suggestions. Officers manage complaints and respond in real time, with AI image analysis and face recognition behind it.',
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB'],
    link: 'https://github.com/shrutik-gupta/Rakshak',
    linkLabel: 'Source',
    note: 'two apps in one',
  },
  {
    id: 'portfolio',
    image: portfolio,
    name: 'This Portfolio',
    subtitle: 'The site you’re on',
    year: '2026',
    role: 'Design + build',
    description:
      'Hand-built, with smooth scrolling, scroll-driven animation and a few small 3D scenes you can poke.',
    tech: ['React.js', 'Three.js', 'GSAP', 'Lenis', 'Tailwind CSS'],
    link: 'https://github.com/shrutik-gupta/portfolio',
    linkLabel: 'Source',
    note: 'you are here',
  },
];

export default projects;
