import { ResumeData } from "./types";

export const graduateDemoData: ResumeData = {
  personal: {
    fullName: "Alex Rivera",
    email: "alex.rivera@example.com",
    phone: "+1 (555) 019-2834",
    location: "Austin, TX",
    linkedin: "linkedin.com/in/alex-rivera-grad",
    website: "github.com/alexriveradev"
  },
  targetRole: "Junior Full-Stack Developer",
  experienceLevel: "Graduate",
  careerSwitcherFrom: "",
  summary: "Highly motivated Computer Science graduate with hands-on experience designing and deploying responsive web applications. Proven track record of academic excellence and collaborative project execution, specializing in React, Node.js, and SQL databases. Eager to bring rapid prototyping skills, algorithmic problem-solving, and a growth mindset to a high-performing software engineering team.",
  experiences: [
    {
      id: "exp-1",
      company: "Apex Tech Labs",
      role: "Software Engineering Intern",
      location: "Dallas, TX (Remote)",
      startDate: "June 2025",
      endDate: "August 2025",
      current: false,
      descriptionBullets: [
        "Collaborated in an agile team of 5 to develop a real-time analytics dashboard using React and Tailwind CSS, improving user engagement by 15%.",
        "Refactored backend RESTful API routes in Node.js/Express, reducing database query response times by approximately 200ms.",
        "Authored comprehensive unit tests utilizing Jest, increasing codebase test coverage from 72% to 88%."
      ]
    },
    {
      id: "exp-2",
      company: "University CS Department",
      role: "Peer Coding Assistant",
      location: "Austin, TX",
      startDate: "September 2024",
      endDate: "May 2025",
      current: false,
      descriptionBullets: [
        "Provided technical mentorship to 40+ undergraduate students weekly, debugging issues in Python, Java, and C++ structures.",
        "Graded programming assignments and conducted code reviews, reinforcing industry-standard clean code principles."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of Texas at Austin",
      degree: "B.S. in Computer Science",
      location: "Austin, TX",
      graduationDate: "May 2026",
      gpa: "3.8/4.0"
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "CollabTask - Team Board",
      role: "Lead Frontend Developer",
      description: "Designed a drag-and-drop project management application using React and DnD Kit, supporting persistent state via local browser storage.",
      techStack: "React, Tailwind CSS, TypeScript, HTML5"
    },
    {
      id: "proj-2",
      title: "FreshCart - E-Commerce API",
      role: "Backend Architect",
      description: "Built a fully secure, scalable e-commerce backend service with JWT authentication, product catalog filters, and secure Stripe payment integration simulator.",
      techStack: "Express, Node.js, MongoDB, REST APIs"
    }
  ],
  skills: [
    { id: "sk-1", name: "JavaScript / TypeScript", type: "Technical" },
    { id: "sk-2", name: "React", type: "Technical" },
    { id: "sk-3", name: "Node.js", type: "Technical" },
    { id: "sk-4", name: "HTML5 / CSS3", type: "Technical" },
    { id: "sk-5", name: "PostgreSQL", type: "Technical" },
    { id: "sk-6", name: "Git & GitHub", type: "Tool" },
    { id: "sk-7", name: "Docker", type: "Tool" },
    { id: "sk-8", name: "VS Code", type: "Tool" },
    { id: "sk-9", name: "Agile/Scrum", type: "Soft/Methodology" },
    { id: "sk-10", name: "Team Collaboration", type: "Soft/Methodology" }
  ]
};

export const switcherDemoData: ResumeData = {
  personal: {
    fullName: "Sarah Chen",
    email: "sarah.chen@example.com",
    phone: "+1 (555) 043-9821",
    location: "Seattle, WA",
    linkedin: "linkedin.com/in/sarah-chen-pivot",
    website: "sarahchen.design"
  },
  targetRole: "UX/UI Designer",
  experienceLevel: "Career Switcher",
  careerSwitcherFrom: "Hotel Front Office Manager",
  summary: "Accomplished Hospitality Manager transitioning into UX/UI Design, combining 5+ years of customer advocacy and empathy-driven problem-solving with formal design training. Expert in identifying user friction points, managing cross-functional service operations, and delivering delightful high-touch customer experiences. Skilled in Figma, user research, wireframing, and interactive prototyping to craft elegant digital products.",
  experiences: [
    {
      id: "exp-1",
      company: "Grand Plaza Luxury Hotel",
      role: "Front Office Manager",
      location: "Seattle, WA",
      startDate: "March 2021",
      endDate: "January 2026",
      current: false,
      descriptionBullets: [
        "Led a customer-facing service team of 15, streamlining check-in flows and reducing average guest waiting time by 4 minutes.",
        "Gathered and analyzed feedback from over 2,000 guests annually, championing service improvements and raising guest satisfaction ratings by 18%.",
        "Orchestrated cross-departmental operations between Housekeeping, Concierge, and Finance to ensure friction-free resort experiences."
      ]
    },
    {
      id: "exp-2",
      company: "Vanguard Hospitality Group",
      role: "Senior Guest Relations Associate",
      location: "Portland, OR",
      startDate: "September 2019",
      endDate: "February 2021",
      current: false,
      descriptionBullets: [
        "Resolved complex, high-priority service failures dynamically, receiving the 'Outstanding Service Award' in 2020.",
        "Mentored and onboarded 8 new associates on operational systems and customer empathy standards."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "Metropolis Tech Institute",
      degree: "Professional Certificate in UX/UI Design",
      location: "Seattle, WA",
      graduationDate: "April 2026",
      gpa: ""
    },
    {
      id: "edu-2",
      institution: "Oregon State University",
      degree: "B.A. in Communications",
      location: "Corvallis, OR",
      graduationDate: "June 2019",
      gpa: "3.6/4.0"
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "RoamEase - Travel App UX Case Study",
      role: "End-to-End UX Designer",
      description: "Conducted user interviews with 10 frequent travelers, created user personas, wireframed mid-fidelity screens, and built a high-fidelity prototype in Figma to solve spontaneous group itinerary planning.",
      techStack: "Figma, User Research, Wireframing, Prototyping"
    },
    {
      id: "proj-2",
      title: "MetroTransit Web Redesign",
      role: "Visual & Interaction Designer",
      description: "Redesigned the visual hierarchy and checkout flow of the Seattle public transit website, improving accessibility compliance (WCAG 2.1) and reducing transaction checkout steps from 6 to 3.",
      techStack: "Figma, Interactive Design, Accessibility Principles"
    }
  ],
  skills: [
    { id: "sk-1", name: "Figma", type: "Tool" },
    { id: "sk-2", name: "User Research", type: "Technical" },
    { id: "sk-3", name: "Wireframing & Prototyping", type: "Technical" },
    { id: "sk-4", name: "Information Architecture", type: "Technical" },
    { id: "sk-5", name: "Interaction Design", type: "Technical" },
    { id: "sk-6", name: "Adobe Creative Suite", type: "Tool" },
    { id: "sk-7", name: "Customer Empathy", type: "Soft/Methodology" },
    { id: "sk-8", name: "Cross-Functional Collaboration", type: "Soft/Methodology" },
    { id: "sk-9", name: "Active Listening", type: "Soft/Methodology" },
    { id: "sk-10", name: "Agile Design Sprints", type: "Soft/Methodology" }
  ]
};

export const emptyResumeData: ResumeData = {
  personal: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: ""
  },
  targetRole: "",
  experienceLevel: "Graduate",
  careerSwitcherFrom: "",
  summary: "",
  experiences: [],
  education: [],
  projects: [],
  skills: []
};
