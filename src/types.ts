export interface PersonalDetails {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  descriptionBullets: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  location: string;
  graduationDate: string;
  gpa?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  role: string;
  description: string;
  techStack: string;
}

export interface SkillItem {
  id: string;
  name: string;
  type: "Technical" | "Tool" | "Soft/Methodology";
}

export interface ResumeData {
  personal: PersonalDetails;
  targetRole: string;
  experienceLevel: "Graduate" | "Career Switcher" | "Entry Level";
  careerSwitcherFrom: string;
  summary: string;
  experiences: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  skills: SkillItem[];
}

export type TemplateType = "modern" | "executive";

export interface BulletVariation {
  title: string;
  text: string;
}

export interface SkillSuggestion {
  name: string;
  type: "Technical" | "Tool" | "Soft/Methodology";
  reason: string;
}
