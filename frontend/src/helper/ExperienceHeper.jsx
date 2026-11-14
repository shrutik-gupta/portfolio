import seoulix from '../assets/exp-seoulix.png'
import iete from '../assets/exp-iete.jpg'
import ocd from '../assets/exp-ocd.png'

/**
 * `description` is the one-paragraph summary.
 * `highlights` (optional) is a short list of specifics shown under it —
 * use it for roles where the numbers matter.
 */
const experience = [
    {
        title: "Junior Software Developer",
        company: "One Click Designer",
        duration: "May 2026 - Present",
        description: "I build the AI tools and the back end behind them: the engine that turns a request into finished designs, and the APIs, security and dashboards around it.",
        highlights: [
            "Built the AI Tools engine: four AI agents in a row (Analyser, Art Director, Composer, Generator), with four modes the team can switch from a no-code admin workbook.",
            "Designed a 5-step wizard that turns product photos into product cards, and cut analysis time by 61% (63s to 24.5s).",
            "Launched Brand Kits: upload a brand PDF and its fonts, colours and visuals fill in automatically.",
            "Scaled the engine to run up to 10 workers at once, so many people can generate at the same time.",
            "Secured 15+ admin endpoints, fixed the production forgot-password flow, and added rate limiting across 25+ endpoints.",
            "Built a dashboard that logs every AI call, tracks cost and errors, and refunds failed outputs automatically."
        ],
        logo: ocd
    },
    {
        title: "MERN Developer Intern",
        company: "Seoulix Technologies",
        duration: "July 2025 - October 2025",
        description: "Built and maintained an Employee Celebration platform for Mystery Rooms India, and made it load about 40% faster. Worked with the client to gather requirements, and automated notifications across several channels.",
        logo: seoulix
    },
    {
        title: "Publicity Head",
        company: "Institute of Electronics & Telecommunication Engineers | TSEC",
        duration: "March 2024 - March 2025",
        description: "Led a team of 44 organising and promoting student events, on time and to a high standard.",
        logo: iete
    },
    {
        title: "Publicity & SMM Executive",
        company: "Institute of Electronics & Telecommunication Engineers | TSEC",
        duration: "July 2023 - March 2024",
        description: "Ran publicity and social media for student events. The biggest campus events reached audiences of over 1,500.",
        logo: iete
    }
]
export default experience;
