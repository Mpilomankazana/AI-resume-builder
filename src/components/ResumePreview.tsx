import React from "react";
import { ResumeData, TemplateType } from "../types";
import { Mail, Phone, MapPin, Linkedin, Globe, Briefcase, GraduationCap, Code, Sparkles } from "lucide-react";

interface ResumePreviewProps {
  data: ResumeData;
  template: TemplateType;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, template }) => {
  const { personal, targetRole, summary, experiences, education, projects, skills } = data;

  // Modern Minimalist Template Rendering
  const renderModern = () => {
    return (
      <div className="p-8 bg-white text-slate-800 font-sans leading-relaxed min-h-[1050px] flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 font-display">
              {personal.fullName || "Your Full Name"}
            </h1>
            {targetRole && (
              <p className="text-lg font-medium text-indigo-600 mt-1 uppercase tracking-wider font-display">
                {targetRole}
              </p>
            )}

            {/* Contact Grid */}
            <div className="flex flex-wrap gap-y-2 gap-x-4 mt-3 text-xs text-slate-500 border-b border-slate-100 pb-4">
              {personal.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {personal.email}
                </span>
              )}
              {personal.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {personal.phone}
                </span>
              )}
              {personal.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {personal.location}
                </span>
              )}
              {personal.linkedin && (
                <span className="flex items-center gap-1">
                  <Linkedin className="w-3.5 h-3.5 text-slate-400" />
                  {personal.linkedin}
                </span>
              )}
              {personal.website && (
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  {personal.website}
                </span>
              )}
            </div>
          </div>

          {/* Professional Summary */}
          {summary && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2 font-display">
                Professional Summary
              </h2>
              <p className="text-sm text-slate-600 font-normal leading-relaxed text-justify">
                {summary}
              </p>
            </div>
          )}

          {/* Experiences */}
          {experiences.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3 border-t border-slate-100 pt-4 font-display">
                Work Experience
              </h2>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="group">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-sm font-bold text-slate-900">
                        {exp.role} <span className="text-slate-400 font-normal">at</span> {exp.company}
                      </h3>
                      <span className="text-xs text-slate-500 font-mono">
                        {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    {exp.location && (
                      <p className="text-[11px] text-slate-400 mb-1.5">{exp.location}</p>
                    )}
                    <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600">
                      {exp.descriptionBullets.map((bullet, idx) => (
                        <li key={idx} className="text-justify leading-relaxed">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3 border-t border-slate-100 pt-4 font-display">
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{edu.institution}</h3>
                      <p className="text-xs text-slate-600">
                        {edu.degree}
                        {edu.gpa && <span className="text-slate-400 font-mono"> • GPA: {edu.gpa}</span>}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-500 font-mono">{edu.graduationDate}</span>
                      {edu.location && <p className="text-[11px] text-slate-400">{edu.location}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3 border-t border-slate-100 pt-4 font-display">
                Key Projects
              </h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-sm font-bold text-slate-900">{proj.title}</h3>
                      {proj.techStack && (
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">
                          {proj.techStack}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-indigo-600 font-medium">{proj.role}</p>
                    <p className="text-xs text-slate-600 mt-1 text-justify leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3 border-t border-slate-100 pt-4 font-display">
                Skills & Competencies
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((sk) => (
                  <span
                    key={sk.id}
                    className="text-xs bg-slate-50 text-slate-700 border border-slate-200/60 px-2.5 py-1 rounded"
                  >
                    <span className="font-medium">{sk.name}</span>
                    <span className="text-[10px] text-slate-400 ml-1.5 uppercase tracking-wide">
                      ({sk.type.split("/")[0]})
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Disclaimer Footer */}
        <div className="mt-8 pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-center italic no-print">
          Generated & optimized using Gemini AI. Verify stats and details before applying.
        </div>
      </div>
    );
  };

  // Executive Corporate Template Rendering
  const renderExecutive = () => {
    return (
      <div className="p-8 bg-white text-slate-900 font-sans leading-relaxed min-h-[1050px] flex flex-col justify-between">
        <div>
          {/* Header (Centered) */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 uppercase font-sans">
              {personal.fullName || "Your Full Name"}
            </h1>
            {targetRole && (
              <p className="text-sm font-semibold text-sky-800 uppercase tracking-widest mt-1">
                {targetRole}
              </p>
            )}

            {/* Contact row */}
            <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 mt-3 text-xs text-slate-600 border-t border-b border-slate-200 py-2">
              {personal.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-sky-800" />
                  {personal.email}
                </span>
              )}
              {personal.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-sky-800" />
                  {personal.phone}
                </span>
              )}
              {personal.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-sky-800" />
                  {personal.location}
                </span>
              )}
              {personal.linkedin && (
                <span className="flex items-center gap-1">
                  <Linkedin className="w-3 h-3 text-sky-800" />
                  {personal.linkedin}
                </span>
              )}
              {personal.website && (
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-sky-800" />
                  {personal.website}
                </span>
              )}
            </div>
          </div>

          {/* Professional Summary */}
          {summary && (
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wide text-sky-800 border-b-2 border-sky-800 pb-0.5 mb-2">
                Executive Profile
              </h2>
              <p className="text-xs text-slate-700 text-justify leading-relaxed">
                {summary}
              </p>
            </div>
          )}

          {/* Experiences */}
          {experiences.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wide text-sky-800 border-b-2 border-sky-800 pb-0.5 mb-3">
                Professional Experience
              </h2>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-xs font-bold text-slate-900 uppercase">
                        {exp.company} — <span className="text-sky-800 font-semibold">{exp.role}</span>
                      </h3>
                      <span className="text-xs text-slate-700 font-semibold">
                        {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    {exp.location && (
                      <p className="text-[10px] text-slate-500 italic mb-1.5">{exp.location}</p>
                    )}
                    <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700">
                      {exp.descriptionBullets.map((bullet, idx) => (
                        <li key={idx} className="text-justify leading-relaxed">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wide text-sky-800 border-b-2 border-sky-800 pb-0.5 mb-3">
                Education & Credentials
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase">{edu.institution}</h3>
                      <p className="text-xs text-slate-700">
                        {edu.degree}
                        {edu.gpa && <span className="text-slate-500 font-mono"> (GPA: {edu.gpa})</span>}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-700 font-semibold">{edu.graduationDate}</span>
                      {edu.location && <p className="text-[10px] text-slate-500 italic">{edu.location}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wide text-sky-800 border-b-2 border-sky-800 pb-0.5 mb-3">
                Selected Projects
              </h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-xs font-bold text-slate-900 uppercase">{proj.title}</h3>
                      {proj.techStack && (
                        <span className="text-[10px] text-sky-800 font-mono font-semibold">
                          [{proj.techStack}]
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 italic">{proj.role}</p>
                    <p className="text-xs text-slate-700 mt-1 text-justify leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wide text-sky-800 border-b-2 border-sky-800 pb-0.5 mb-3">
                Key Skills & Qualifications
              </h2>
              <div className="grid grid-cols-3 gap-y-2 gap-x-4 text-xs">
                {["Technical", "Tool", "Soft/Methodology"].map((cat) => {
                  const filtered = skills.filter((sk) => sk.type === cat || (cat === "Soft/Methodology" && sk.type === "Soft/Methodology"));
                  if (filtered.length === 0) return null;
                  return (
                    <div key={cat} className="space-y-1">
                      <h4 className="text-[10px] font-bold uppercase text-sky-800 tracking-wider">
                        {cat === "Soft/Methodology" ? "Core Competencies" : cat}
                      </h4>
                      <p className="text-slate-700 leading-tight">
                        {filtered.map((sk) => sk.name).join(", ")}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* AI Disclaimer Footer */}
        <div className="mt-8 pt-4 border-t border-slate-200 text-[10px] text-slate-400 text-center italic no-print">
          Generated & optimized using Gemini AI. Verify stats and details before applying.
        </div>
      </div>
    );
  };

  return (
    <div id="resume-sheet" className="print-container shadow-lg border border-slate-200 rounded-md overflow-hidden bg-white mx-auto max-w-[800px]">
      {template === "modern" ? renderModern() : renderExecutive()}
    </div>
  );
};
