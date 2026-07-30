import seoulix from '../assets/exp-seoulix.png'
import iete from '../assets/exp-iete.jpg'
import nss from '../assets/exp-nss.png'
import ocd from '../assets/exp-ocd.png'
const experience = [
    {
        title: "Junior Software Developer",
        company: "One Click Designer",
        duration: "May 2026 - Present",
        description: "Developed scalable Node.js and Express APIs on AWS Lambda backed by DynamoDB. Architected automated text and media template engines (S3 → SQS → Render engine) supporting 5,000+ templates and thousands of live renders. Implemented robust security measures across 25+ endpoints with per-route rate limiting and admin verification middleware, alongside building real-time analytics dashboards for tracking system performance and user conversion funnels.",
        logo: ocd
    },
    {
        title: "MERN Developer Intern",
        company: "Seoulix Technologies",
        duration: "July 2025 - October 2025",
        description: "During my internship, I worked with cross-functional teams to design and develop responsive web applications using the MERN stack. I contributed to real-world projects involving dynamic UI components, API integration, and performance optimization. This experience enhanced my technical skills and gave me a solid understanding of agile development, version control, and deploying scalable web solutions.",
        logo: seoulix
    },
    {
        title: "Publicity Head",
        company: "Institue of Electronics & Telecommunication Engineers | TSEC",
        duration: "March 2024 - March 2025",
        description: "As Publicity Head, I led a team of 44 members to plan and execute promotional strategies for student events. I delegated tasks, ensured timely execution, and maintained quality across campaigns. From idea generation to final deliverables, I worked to maximize event visibility. This role strengthened my leadership, team management, and strategic planning skills while giving me valuable experience in handling large-scale campus initiatives.",
        logo: iete
    },
    {
        title: "Publicity & SMM Executive",
        company: "Institue of Electronics & Telecommunication Engineers | TSEC",
        duration: "July 2023 - March 2024",
        description: "I gained hands-on experience in content creation, marketing strategy, and audience engagement while managing publicity and social media for student events. My posts and reels helped boost attendance, with events averaging 300+ participants and major campaigns reaching over 1,500 people. This role strengthened my communication, creativity, and time management skills, paving the way for my transition to Publicity Head.",
        logo: iete
    }
]
export default experience;