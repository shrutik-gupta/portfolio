/**
 * Facts about Shrutik that more than one section needs.
 *
 * Education, awards, courses and services mirror the knowledge base the
 * Saarthi assistant answers from (backend/controller/chatController.js),
 * so the page and the chatbot say the same thing. Change one, change both.
 */

export const CONTACT = {
  email: 'shrutikgupta07@gmail.com',
  resume: '/resume.pdf',
  channels: [
    { label: 'Email', value: 'shrutikgupta07@gmail.com', href: 'mailto:shrutikgupta07@gmail.com' },
    { label: 'LinkedIn', value: 'in/shrutik-gupta', href: 'https://www.linkedin.com/in/shrutik-gupta' },
    { label: 'GitHub', value: 'shrutik-gupta', href: 'https://github.com/shrutik-gupta' },
  ],
};

export const FACTS = [
  { k: 'Based in', v: 'Mumbai, India' },
  { k: 'Currently', v: 'Junior Software Developer, One Click Designer' },
  { k: 'Studied', v: 'B.E. Information Technology, TSEC Mumbai (2022–2026) — CGPA 9.32' },
  { k: 'Off-hours', v: 'Cricket, piano, vlogs' },
];

/** `badge` is what the rosette shows: a placing, or ★ for an honour. */
export const AWARDS = [
  { place: 'Ambassador Award', event: 'Information Technology Department, TSEC', year: '2026', badge: '★' },
  { place: 'Runner-up', event: 'JP Morgan Chase Code for Good Hackathon', year: '2025', badge: '2nd' },
  { place: 'Runner-up', event: 'Hackwarts Hackathon, SLRTCE', year: '2024', badge: '2nd' },
];

export const COURSES = [
  { name: 'Introduction to Agile Development and Scrum', by: 'IBM', year: '2026' },
  { name: 'Supervised Machine Learning: Regression and Classification', by: 'DeepLearning.AI', year: '2024' },
];

/** `see` points at a project id on the wall that shows this kind of work. */
export const SERVICES = [
  {
    name: 'AI tools & agents',
    text: 'Assistants and multi-step AI pipelines that do real work: research, analysis, generating content.',
    see: { id: 'mindqueue', label: 'MindQueue' },
  },
  {
    name: 'Complete web apps',
    text: 'From first sketch to live site: the screens, the logins, the database, the launch.',
    see: { id: 'gewodo', label: 'GeWoDo' },
  },
  {
    name: 'Back ends & APIs',
    text: 'Node and Express servers on AWS, sign-in systems, and databases designed to last.',
    see: { id: 'rakshak', label: 'Rakshak' },
  },
  {
    name: 'Websites & interfaces',
    text: 'Fast, responsive React front ends — with motion where it helps.',
    see: { id: 'portfolio', label: 'this site' },
  },
  {
    name: 'A second opinion',
    text: 'Help choosing a tech stack, a code review, or mentoring for someone starting out.',
    see: null,
  },
];

/**
 * The stack, bottom layer first — the order it is built in on screen.
 * The 3D tower in src/three/StackTower.jsx has one block per entry here,
 * in the same order: add or remove a layer in both places.
 */
export const STACK = [
  {
    label: 'Foundations',
    blurb: 'The basics that never go out of date.',
    items: ['DSA', 'OOP', 'DBMS', 'Git & GitHub', 'Postman'],
    swatch: 'bg-text-primary',
  },
  {
    label: 'Languages',
    blurb: 'What I write in.',
    items: ['JavaScript', 'Python', 'C++'],
    swatch: 'bg-paper',
  },
  {
    label: 'Data',
    blurb: 'Where the information lives.',
    items: ['DynamoDB', 'MongoDB', 'MySQL'],
    swatch: 'bg-accent-secondary',
  },
  {
    label: 'Cloud',
    blurb: 'Where it all runs, and how it keeps running under load.',
    items: ['AWS Lambda', 'EC2', 'S3', 'SQS', 'SES', 'Amplify', 'API Gateway', 'PM2'],
    swatch: 'bg-highlight',
  },
  {
    label: 'Server',
    blurb: 'The part that runs behind the scenes: logins, rules, connections.',
    items: ['Node.js', 'Express', 'REST APIs', 'JWT Auth', 'BeautifulSoup'],
    swatch: 'bg-paper',
  },
  {
    label: 'AI',
    blurb: 'Teaching software to read, reason and write — and keeping it predictable.',
    items: ['LangChain', 'LangGraph', 'RAG Pipelines', 'Embeddings', 'Multi-Agent Pipelines', 'Prompt Engineering'],
    swatch: 'bg-accent-secondary',
  },
  {
    label: 'Interface',
    blurb: 'The part you see and touch.',
    items: ['React', 'Tailwind CSS', 'GSAP', 'Three.js', 'HTML', 'CSS'],
    swatch: 'bg-accent-primary',
  },
];
