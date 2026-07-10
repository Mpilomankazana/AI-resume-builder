import { useState, useEffect } from "react";
import { 
  FileText, User, Briefcase, GraduationCap, Code, Sparkles, CheckCircle2, 
  ChevronRight, ChevronLeft, Plus, Trash2, ArrowRight, Download, RefreshCw, 
  Check, Info, HelpCircle, Eye, Edit3, ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ResumeData, PersonalDetails, ExperienceItem, EducationItem, 
  ProjectItem, SkillItem, TemplateType, BulletVariation, SkillSuggestion 
} from "./types";
import { graduateDemoData, switcherDemoData, emptyResumeData } from "./demoData";
import { ResumePreview } from "./components/ResumePreview";

export default function App() {
  // State for resume data
  const [resumeData, setResumeData] = useState<ResumeData>(graduateDemoData);
  
  // App navigation and view state
  const [activeStep, setActiveStep] = useState<number>(1);
  const [template, setTemplate] = useState<TemplateType>("modern");
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor"); // For mobile screens
  
  // AI Tools Processing States
  const [generatingSummary, setGeneratingSummary] = useState<boolean>(false);
  const [suggestingSkills, setSuggestingSkills] = useState<boolean>(false);
  const [optimizingBullet, setOptimizingBullet] = useState<{ [key: string]: boolean }>({});
  
  // AI Modals / Inline results state
  const [bulletVariations, setBulletVariations] = useState<BulletVariation[] | null>(null);
  const [activeOptBulletRef, setActiveOptBulletRef] = useState<{ expId: string, bulletIdx: number } | null>(null);
  const [skillsSuggestions, setSkillsSuggestions] = useState<SkillSuggestion[] | null>(null);
  const [selectedSuggestions, setSelectedSuggestions] = useState<{ [key: string]: boolean }>({});
  const [jobDescription, setJobDescription] = useState<string>("");
  
  // Feedback Messages
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  // Clear feedback messages after time
  useEffect(() => {
    if (apiError) {
      const timer = setTimeout(() => setApiError(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [apiError]);

  useEffect(() => {
    if (apiSuccess) {
      const timer = setTimeout(() => setApiSuccess(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [apiSuccess]);

  // Demo loaders
  const loadGraduateDemo = () => {
    setResumeData(JSON.parse(JSON.stringify(graduateDemoData)));
    setApiSuccess("Loaded standard Graduate Demo data successfully.");
    setActiveStep(1);
  };

  const loadSwitcherDemo = () => {
    setResumeData(JSON.parse(JSON.stringify(switcherDemoData)));
    setApiSuccess("Loaded Career Switcher Demo data successfully.");
    setActiveStep(1);
  };

  const resetForm = () => {
    if (window.confirm("Are you sure you want to reset the form? All entered details will be cleared.")) {
      setResumeData(JSON.parse(JSON.stringify(emptyResumeData)));
      setJobDescription("");
      setSkillsSuggestions(null);
      setBulletVariations(null);
      setActiveStep(1);
      setApiSuccess("Form cleared successfully.");
    }
  };

  // Input Handlers
  const handlePersonalChange = (field: keyof PersonalDetails, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value
      }
    }));
  };

  const handleRootChange = (field: "targetRole" | "experienceLevel" | "careerSwitcherFrom" | "summary", value: string) => {
    setResumeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Step 1: Professional Summary AI Generation
  const handleGenerateSummary = async () => {
    if (!resumeData.targetRole) {
      setApiError("Please enter a Target Role first to guide the AI summary generator.");
      return;
    }

    setGeneratingSummary(true);
    setApiError(null);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "summary",
          data: {
            fullName: resumeData.personal.fullName,
            targetRole: resumeData.targetRole,
            experienceLevel: resumeData.experienceLevel,
            keySkills: resumeData.skills.map(s => s.name).join(", "),
            backgroundInfo: resumeData.summary || "Highly motivated to join this field and drive impact.",
            careerSwitcherFrom: resumeData.experienceLevel === "Career Switcher" ? resumeData.careerSwitcherFrom : ""
          }
        })
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Failed to generate professional summary.");
      }

      setResumeData(prev => ({ ...prev, summary: resData.result }));
      setApiSuccess("AI Professional Summary generated & optimized successfully!");
    } catch (err: any) {
      setApiError(err.message || "Could not connect to the server backend. Verify the API Key configuration.");
    } finally {
      setGeneratingSummary(false);
    }
  };

  // Step 2: Experience Management
  const addExperience = () => {
    const newItem: ExperienceItem = {
      id: "exp-" + Date.now(),
      company: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      descriptionBullets: [""]
    };
    setResumeData(prev => ({
      ...prev,
      experiences: [...prev.experiences, newItem]
    }));
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, value: any) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(item => item.id !== id)
    }));
  };

  // Experience Bullet Points inside items
  const addExperienceBullet = (expId: string) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(item => {
        if (item.id === expId) {
          return {
            ...item,
            descriptionBullets: [...item.descriptionBullets, ""]
          };
        }
        return item;
      })
    }));
  };

  const updateExperienceBullet = (expId: string, idx: number, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(item => {
        if (item.id === expId) {
          const updatedBullets = [...item.descriptionBullets];
          updatedBullets[idx] = value;
          return { ...item, descriptionBullets: updatedBullets };
        }
        return item;
      })
    }));
  };

  const removeExperienceBullet = (expId: string, idx: number) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(item => {
        if (item.id === expId) {
          const updatedBullets = item.descriptionBullets.filter((_, i) => i !== idx);
          return { 
            ...item, 
            descriptionBullets: updatedBullets.length > 0 ? updatedBullets : [""] 
          };
        }
        return item;
      })
    }));
  };

  // Step 2: AI Experience Bullet Formula Optimizer
  const handleOptimizeBullet = async (expId: string, bulletIdx: number, bulletText: string, expRole: string) => {
    if (!bulletText.trim()) {
      setApiError("Please type a draft bullet point first before asking the AI to optimize it.");
      return;
    }

    const refKey = `${expId}-${bulletIdx}`;
    setOptimizingBullet(prev => ({ ...prev, [refKey]: true }));
    setApiError(null);
    setBulletVariations(null);
    setActiveOptBulletRef({ expId, bulletIdx });

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "bullet",
          data: {
            currentBullet: bulletText,
            roleContext: expRole || resumeData.targetRole || "Professional"
          }
        })
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Failed to optimize experience bullet.");
      }

      if (resData.result && resData.result.variations) {
        setBulletVariations(resData.result.variations);
      } else {
        throw new Error("Invalid format received from the AI model.");
      }
    } catch (err: any) {
      setApiError(err.message || "Failed to communicate with AI bullet assistant.");
      setActiveOptBulletRef(null);
    } finally {
      setOptimizingBullet(prev => ({ ...prev, [refKey]: false }));
    }
  };

  const applyBulletVariation = (optimizedText: string) => {
    if (activeOptBulletRef) {
      const { expId, bulletIdx } = activeOptBulletRef;
      updateExperienceBullet(expId, bulletIdx, optimizedText);
      setBulletVariations(null);
      setActiveOptBulletRef(null);
      setApiSuccess("Applied AI optimized bullet successfully.");
    }
  };

  // Step 2: Education Management
  const addEducation = () => {
    const newItem: EducationItem = {
      id: "edu-" + Date.now(),
      institution: "",
      degree: "",
      location: "",
      graduationDate: "",
      gpa: ""
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newItem]
    }));
  };

  const updateEducation = (id: string, field: keyof EducationItem, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(item => item.id !== id)
    }));
  };

  // Step 3: Project Management
  const addProject = () => {
    const newItem: ProjectItem = {
      id: "proj-" + Date.now(),
      title: "",
      role: "",
      description: "",
      techStack: ""
    };
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, newItem]
    }));
  };

  const updateProject = (id: string, field: keyof ProjectItem, value: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeProject = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(item => item.id !== id)
    }));
  };

  // Step 3: Skills Management
  const addSkill = (name: string, type: "Technical" | "Tool" | "Soft/Methodology" = "Technical") => {
    if (!name.trim()) return;
    
    // Check duplication
    if (resumeData.skills.some(sk => sk.name.toLowerCase() === name.trim().toLowerCase())) {
      setApiError(`"${name}" is already in your skills list.`);
      return;
    }

    const newItem: SkillItem = {
      id: "sk-" + Date.now(),
      name: name.trim(),
      type
    };
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, newItem]
    }));
  };

  const removeSkill = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(item => item.id !== id)
    }));
  };

  // Step 3: AI Skill Keywords Keyword Suggester
  const handleSuggestSkills = async () => {
    if (!resumeData.targetRole) {
      setApiError("Please state your Target Role first so the AI knows what ATS filters to target.");
      return;
    }

    setSuggestingSkills(true);
    setApiError(null);
    setSkillsSuggestions(null);
    setSelectedSuggestions({});

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "skills",
          data: {
            targetRole: resumeData.targetRole,
            jobDescription: jobDescription,
            currentSkills: resumeData.skills.map(s => s.name).join(", ")
          }
        })
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Failed to retrieve skill suggestions.");
      }

      if (Array.isArray(resData.result)) {
        setSkillsSuggestions(resData.result);
        // Pre-select all returned skills
        const initialSelected: { [key: string]: boolean } = {};
        resData.result.forEach((sk: SkillSuggestion, idx: number) => {
          initialSelected[`suggest-${idx}`] = true;
        });
        setSelectedSuggestions(initialSelected);
      } else {
        throw new Error("Invalid skill array received from backend.");
      }
    } catch (err: any) {
      setApiError(err.message || "Failed to contact skill recommendation engine.");
    } finally {
      setSuggestingSkills(false);
    }
  };

  const toggleSelectSuggestion = (key: string) => {
    setSelectedSuggestions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const addSelectedSkills = () => {
    if (!skillsSuggestions) return;
    
    let addedCount = 0;
    skillsSuggestions.forEach((sk, idx) => {
      if (selectedSuggestions[`suggest-${idx}`]) {
        // Only add if not duplicate
        if (!resumeData.skills.some(curr => curr.name.toLowerCase() === sk.name.toLowerCase())) {
          addSkill(sk.name, sk.type);
          addedCount++;
        }
      }
    });

    setSkillsSuggestions(null);
    setApiSuccess(`Added ${addedCount} ATS-friendly skills to your resume!`);
  };

  // Print trigger
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* HEADER BAR (Hidden in print) */}
      <header className="no-print bg-slate-950 border-b border-slate-800/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-600 text-white p-2 rounded-lg shadow-md shadow-indigo-600/10">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-white font-display text-lg">AI RESUME</span>
              <span className="text-xs bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded ml-2 font-mono uppercase font-semibold">ATS Pro</span>
            </div>
          </div>
          
          {/* Quick Setup Actions */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono mr-2 hidden md:inline">Quick Fill Demoprofiles:</span>
            <button 
              onClick={loadGraduateDemo}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 rounded-md border border-slate-700 transition"
              title="Load full mock data for a standard CS graduate"
            >
              Graduate Demo
            </button>
            <button 
              onClick={loadSwitcherDemo}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 rounded-md border border-slate-700 transition"
              title="Load full mock data for hospitality manager pivoting to UX UI design"
            >
              Career Switcher Demo
            </button>
            <button 
              onClick={resetForm}
              className="p-1.5 text-slate-400 hover:text-red-400 rounded-md hover:bg-slate-800/60 transition"
              title="Reset current form"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* FEEDBACK BANNER (Hidden in print) */}
      <AnimatePresence>
        {apiError && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="no-print bg-rose-500/15 border-b border-rose-500/30 text-rose-300 text-sm px-4 py-3 flex items-center justify-center gap-2 text-center"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{apiError}</span>
          </motion.div>
        )}
        {apiSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="no-print bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-300 text-sm px-4 py-3 flex items-center justify-center gap-2 text-center"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{apiSuccess}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WORKSPACE AREA */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:grid lg:grid-cols-12 gap-8">
        
        {/* MOBILE VIEW TABS (Hidden in print and on desktop) */}
        <div className="no-print lg:hidden flex border-b border-slate-800 mb-4 bg-slate-950 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("editor")}
            className={`flex-1 py-2 text-center text-sm font-semibold rounded-md flex items-center justify-center gap-2 transition ${
              activeTab === "editor" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Edit3 className="w-4 h-4" /> Form Editor
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex-1 py-2 text-center text-sm font-semibold rounded-md flex items-center justify-center gap-2 transition ${
              activeTab === "preview" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Eye className="w-4 h-4" /> Live Preview
          </button>
        </div>

        {/* EDITOR COLUMN (Left) */}
        <div className={`lg:col-span-7 flex flex-col gap-6 no-print ${activeTab === "editor" ? "block" : "hidden lg:block"}`}>
          
          {/* STEP PROGRESS INDICATOR */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/60 shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-1.5 md:gap-3 flex-1">
              {[
                { step: 1, label: "Profile", icon: User },
                { step: 2, label: "Experience & Education", icon: Briefcase },
                { step: 3, label: "Projects & Skills", icon: Code },
                { step: 4, label: "Export", icon: Download }
              ].map((item, idx, arr) => (
                <div key={item.step} className="flex items-center flex-1 last:flex-initial">
                  <button 
                    onClick={() => setActiveStep(item.step)}
                    className="flex items-center gap-2 group text-left transition"
                  >
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      activeStep === item.step 
                        ? "bg-indigo-600 text-white ring-4 ring-indigo-500/20"
                        : activeStep > item.step 
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-800 text-slate-400 group-hover:bg-slate-700"
                    }`}>
                      {activeStep > item.step ? <Check className="w-4 h-4" /> : item.step}
                    </span>
                    <span className={`text-xs font-semibold hidden md:inline transition ${
                      activeStep === item.step ? "text-white font-bold" : "text-slate-400 group-hover:text-slate-200"
                    }`}>
                      {item.label}
                    </span>
                  </button>
                  {idx < arr.length - 1 && (
                    <div className="flex-1 h-px bg-slate-800 mx-2 hidden sm:block"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* DYNAMIC FORM SHEETS */}
          <div className="bg-slate-950 rounded-xl border border-slate-800/80 shadow-2xl p-6 relative min-h-[500px] flex flex-col justify-between">
            
            {/* Step 1 Form */}
            {activeStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-500" />
                    Personal Details & Target Career
                  </h2>
                  <p className="text-slate-400 text-xs mt-1">
                    Provide your contact channels. ATS systems parse these coordinates to index your application.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Alex Rivera"
                      value={resumeData.personal.fullName}
                      onChange={(e) => handlePersonalChange("fullName", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1.5">Target Role / Discipline</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Junior Full-Stack Developer"
                      value={resumeData.targetRole}
                      onChange={(e) => handleRootChange("targetRole", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="e.g. alex@rivera.dev"
                      value={resumeData.personal.email}
                      onChange={(e) => handlePersonalChange("email", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1.5">Phone Number</label>
                    <input 
                      type="text" 
                      placeholder="e.g. +1 (555) 012-3456"
                      value={resumeData.personal.phone}
                      onChange={(e) => handlePersonalChange("phone", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1.5">Location</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Austin, TX"
                      value={resumeData.personal.location}
                      onChange={(e) => handlePersonalChange("location", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1.5">LinkedIn Profile URL</label>
                    <input 
                      type="text" 
                      placeholder="e.g. linkedin.com/in/alex-rivera"
                      value={resumeData.personal.linkedin}
                      onChange={(e) => handlePersonalChange("linkedin", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1.5">Portfolio / Website</label>
                    <input 
                      type="text" 
                      placeholder="e.g. github.com/alexrivera"
                      value={resumeData.personal.website}
                      onChange={(e) => handlePersonalChange("website", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                </div>

                {/* EXPERIENCE LEVEL PIVOT CARD */}
                <div className="bg-slate-900/60 p-4 border border-slate-800 rounded-xl space-y-4">
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Profile Target Group</span>
                    <div className="grid grid-cols-3 gap-2">
                      {["Graduate", "Entry Level", "Career Switcher"].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => handleRootChange("experienceLevel", level as any)}
                          className={`py-2 px-3 text-xs font-bold rounded-lg border transition ${
                            resumeData.experienceLevel === level 
                              ? "bg-indigo-600/15 border-indigo-500 text-indigo-300"
                              : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {resumeData.experienceLevel === "Career Switcher" && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="pt-2 border-t border-slate-800/80"
                    >
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1.5">Pivot Source (What are you switching from?)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Hospitality Management, Hospitality Retail, Sales Associate"
                        value={resumeData.careerSwitcherFrom}
                        onChange={(e) => handleRootChange("careerSwitcherFrom", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-indigo-200 focus:outline-none focus:border-indigo-500 transition font-medium"
                      />
                      <span className="text-[10px] text-indigo-400 block mt-1.5 italic">
                        The AI summary generator will actively map your service/leadership achievements into UX or development parallels.
                      </span>
                    </motion.div>
                  )}
                </div>

                {/* PROFESSIONAL SUMMARY TEXTAREA */}
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">Professional Summary</label>
                    <button
                      type="button"
                      onClick={handleGenerateSummary}
                      disabled={generatingSummary}
                      className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1 px-2.5 rounded-lg flex items-center gap-1.5 transition disabled:opacity-40"
                    >
                      {generatingSummary ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Optimizing Summary...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          Optimize Summary with AI
                        </>
                      )}
                    </button>
                  </div>
                  <textarea 
                    rows={4}
                    placeholder="Draft some sentences about your background, achievements or core focus. Or click the AI button to generate an optimized, high-impact profile summary from your target role and keywords."
                    value={resumeData.summary}
                    onChange={(e) => handleRootChange("summary", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition leading-relaxed"
                  />
                  {generatingSummary && (
                    <div className="bg-slate-900/40 p-3 border border-slate-800/40 rounded-lg space-y-2 animate-pulse mt-1">
                      <div className="h-3 bg-slate-800 rounded w-full"></div>
                      <div className="h-3 bg-slate-800 rounded w-11/12"></div>
                      <div className="h-3 bg-slate-800 rounded w-4/5"></div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2 Form */}
            {activeStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-500" />
                    Work Experience & Education
                  </h2>
                  <p className="text-slate-400 text-xs mt-1">
                    Detail your job history or peer/academic tasks. Use the built-in AI bullet tuner to align with the action-outcome Google XYZ formula.
                  </p>
                </div>

                {/* EXPERIENCE SECTION */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-sm font-bold uppercase tracking-wider text-slate-300">Experience Records</span>
                    <button 
                      type="button"
                      onClick={addExperience}
                      className="text-xs bg-slate-850 border border-slate-700 hover:bg-slate-800 hover:border-slate-600 text-indigo-300 font-bold py-1 px-2.5 rounded-lg flex items-center gap-1 transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Experience
                    </button>
                  </div>

                  {resumeData.experiences.length === 0 && (
                    <div className="bg-slate-900/30 p-6 border border-dashed border-slate-800 rounded-xl text-center text-slate-500 text-sm">
                      No experiences added yet. Click "Add Experience" to add.
                    </div>
                  )}

                  {resumeData.experiences.map((exp, expIdx) => (
                    <div key={exp.id} className="bg-slate-900 p-4 border border-slate-800 rounded-xl space-y-4 relative">
                      <button 
                        type="button"
                        onClick={() => removeExperience(exp.id)}
                        className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-slate-800 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">
                        Record #{expIdx + 1}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Company / Organization</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Apex Tech Labs"
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Role / Position Title</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Software Engineering Intern"
                            value={exp.role}
                            onChange={(e) => updateExperience(exp.id, "role", e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Location</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Dallas, TX (Remote)"
                            value={exp.location}
                            onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Start Date</label>
                          <input 
                            type="text" 
                            placeholder="e.g. June 2025"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">End Date</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="e.g. August 2025"
                              disabled={exp.current}
                              value={exp.current ? "" : exp.endDate}
                              onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition disabled:opacity-40"
                            />
                            <label className="flex items-center gap-1 cursor-pointer shrink-0">
                              <input 
                                type="checkbox"
                                checked={exp.current}
                                onChange={(e) => updateExperience(exp.id, "current", e.target.checked)}
                                className="rounded text-indigo-600 focus:ring-0"
                              />
                              <span className="text-[10px] text-slate-400 font-bold uppercase">Present</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* INDENTED BULLET POINTS WITH AI TUNER */}
                      <div className="space-y-2 mt-2">
                        <div className="flex justify-between items-center">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">Impact Achievements (ATS Bullets)</label>
                          <button 
                            type="button"
                            onClick={() => addExperienceBullet(exp.id)}
                            className="text-[10px] text-indigo-400 font-bold uppercase flex items-center gap-0.5 hover:text-indigo-300 transition"
                          >
                            <Plus className="w-3 h-3" /> Add Bullet Line
                          </button>
                        </div>

                        <div className="space-y-2.5">
                          {exp.descriptionBullets.map((bullet, bulletIdx) => {
                            const refKey = `${exp.id}-${bulletIdx}`;
                            const isOptActive = activeOptBulletRef?.expId === exp.id && activeOptBulletRef?.bulletIdx === bulletIdx;
                            return (
                              <div key={bulletIdx} className="space-y-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/40">
                                <div className="flex gap-2">
                                  <textarea 
                                    rows={2}
                                    placeholder="e.g. Developed a real-time analytics panel in React for the marketing staff."
                                    value={bullet}
                                    onChange={(e) => updateExperienceBullet(exp.id, bulletIdx, e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition leading-relaxed"
                                  />
                                  <div className="flex flex-col gap-1 shrink-0 justify-center">
                                    <button 
                                      type="button"
                                      onClick={() => handleOptimizeBullet(exp.id, bulletIdx, bullet, exp.role)}
                                      disabled={optimizingBullet[refKey]}
                                      className="p-1.5 text-indigo-400 hover:text-indigo-300 hover:bg-slate-800 rounded transition"
                                      title="Optimize with Google XYZ action-oriented formula"
                                    >
                                      {optimizingBullet[refKey] ? (
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <Sparkles className="w-4 h-4" />
                                      )}
                                    </button>
                                    <button 
                                      type="button"
                                      onClick={() => removeExperienceBullet(exp.id, bulletIdx)}
                                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>

                                {/* INLINE AI BULLET VARIATIONS BOX */}
                                {isOptActive && bulletVariations && (
                                  <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="mt-3 bg-indigo-950/40 border border-indigo-800/50 rounded-lg p-3 space-y-3"
                                  >
                                    <div className="flex justify-between items-center">
                                      <span className="text-[10px] font-bold uppercase text-indigo-300 tracking-wider flex items-center gap-1">
                                        <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                                        Select Optimized Variation (Formula Tuned)
                                      </span>
                                      <button 
                                        type="button"
                                        onClick={() => { setBulletVariations(null); setActiveOptBulletRef(null); }}
                                        className="text-[10px] text-slate-400 hover:text-slate-200"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                    <div className="space-y-2">
                                      {bulletVariations.map((v, vIdx) => (
                                        <div 
                                          key={vIdx}
                                          onClick={() => applyBulletVariation(v.text)}
                                          className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-left cursor-pointer hover:border-indigo-500 hover:bg-indigo-950/20 transition group"
                                        >
                                          <div className="flex justify-between items-baseline mb-0.5">
                                            <span className="text-[10px] font-bold uppercase text-indigo-400 group-hover:text-indigo-300">{v.title}</span>
                                            <span className="text-[9px] text-slate-500 font-mono">Apply →</span>
                                          </div>
                                          <p className="text-xs text-slate-300 leading-relaxed font-normal">{v.text}</p>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="text-[10px] text-slate-400 flex items-center gap-1 italic">
                                      <Info className="w-3 h-3 text-indigo-400" />
                                      Pro Tip: Select the 'Quantified Outcome' variation to show hiring managers the actual business metrics you drive.
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* EDUCATION SECTION */}
                <div className="space-y-4 pt-4 border-t border-slate-800/80">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold uppercase tracking-wider text-slate-300">Education Background</span>
                    <button 
                      type="button"
                      onClick={addEducation}
                      className="text-xs bg-slate-850 border border-slate-700 hover:bg-slate-800 hover:border-slate-600 text-indigo-300 font-bold py-1 px-2.5 rounded-lg flex items-center gap-1 transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Education
                    </button>
                  </div>

                  {resumeData.education.length === 0 && (
                    <div className="bg-slate-900/30 p-4 border border-dashed border-slate-800 rounded-xl text-center text-slate-500 text-sm">
                      No educational credentials added yet. Click "Add Education".
                    </div>
                  )}

                  {resumeData.education.map((edu, eduIdx) => (
                    <div key={edu.id} className="bg-slate-900 p-4 border border-slate-800 rounded-xl space-y-4 relative">
                      <button 
                        type="button"
                        onClick={() => removeEducation(edu.id)}
                        className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-slate-800 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">
                        Credential #{eduIdx + 1}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Institution / School Name</label>
                          <input 
                            type="text" 
                            placeholder="e.g. University of Texas at Austin"
                            value={edu.institution}
                            onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Degree / Certification Title</label>
                          <input 
                            type="text" 
                            placeholder="e.g. B.S. in Computer Science"
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Location</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Austin, TX"
                            value={edu.location}
                            onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Graduation Date</label>
                          <input 
                            type="text" 
                            placeholder="e.g. May 2026"
                            value={edu.graduationDate}
                            onChange={(e) => updateEducation(edu.id, "graduationDate", e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">GPA / Score (Optional)</label>
                          <input 
                            type="text" 
                            placeholder="e.g. 3.8 / 4.0"
                            value={edu.gpa}
                            onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3 Form */}
            {activeStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
                    <Code className="w-5 h-5 text-indigo-500" />
                    Key Projects & Technical Skills
                  </h2>
                  <p className="text-slate-400 text-xs mt-1">
                    Graduates and pivot candidates win interviews by highlighting real-world projects and robust keyword coverage.
                  </p>
                </div>

                {/* PROJECTS LIST */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-sm font-bold uppercase tracking-wider text-slate-300">Selected Projects</span>
                    <button 
                      type="button"
                      onClick={addProject}
                      className="text-xs bg-slate-850 border border-slate-700 hover:bg-slate-800 hover:border-slate-600 text-indigo-300 font-bold py-1 px-2.5 rounded-lg flex items-center gap-1 transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Project
                    </button>
                  </div>

                  {resumeData.projects.length === 0 && (
                    <div className="bg-slate-900/30 p-4 border border-dashed border-slate-800 rounded-xl text-center text-slate-500 text-sm">
                      No key projects specified yet. Click "Add Project" to add.
                    </div>
                  )}

                  {resumeData.projects.map((proj, projIdx) => (
                    <div key={proj.id} className="bg-slate-900 p-4 border border-slate-800 rounded-xl space-y-4 relative">
                      <button 
                        type="button"
                        onClick={() => removeProject(proj.id)}
                        className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-slate-800 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">
                        Project #{projIdx + 1}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Project Title</label>
                          <input 
                            type="text" 
                            placeholder="e.g. CollabTask - Board App"
                            value={proj.title}
                            onChange={(e) => updateProject(proj.id, "title", e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Technology Stack</label>
                          <input 
                            type="text" 
                            placeholder="e.g. React, Tailwind, TS"
                            value={proj.techStack}
                            onChange={(e) => updateProject(proj.id, "techStack", e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Your Role / Responsibility</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Frontend Architect or End-to-End UX Designer"
                          value={proj.role}
                          onChange={(e) => updateProject(proj.id, "role", e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-indigo-300 focus:outline-none focus:border-indigo-500 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Detailed Description</label>
                        <textarea 
                          rows={2.5}
                          placeholder="What did the project do? What were the core technical or research outcomes?"
                          value={proj.description}
                          onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* SKILLS CHIPS & KEYWORD BOOSTER */}
                <div className="space-y-4 pt-4 border-t border-slate-800/80">
                  <div className="flex justify-between items-baseline border-b border-slate-800 pb-2">
                    <span className="text-sm font-bold uppercase tracking-wider text-slate-300">Skills Keyword Cloud</span>
                    <span className="text-xs text-slate-400 font-mono">Count: {resumeData.skills.length} keywords</span>
                  </div>

                  {/* IN-LINE MANUAL ADD FORM */}
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const input = form.elements.namedItem("skillName") as HTMLInputElement;
                      const type = form.elements.namedItem("skillType") as HTMLSelectElement;
                      if (input.value.trim()) {
                        addSkill(input.value, type.value as any);
                        input.value = "";
                      }
                    }}
                    className="flex flex-wrap gap-2 bg-slate-900 p-3 rounded-xl border border-slate-800"
                  >
                    <input 
                      name="skillName"
                      type="text" 
                      placeholder="Add individual skill (e.g. Node.js)"
                      className="flex-1 min-w-[150px] bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                    />
                    <select 
                      name="skillType"
                      className="bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-xs text-slate-300 focus:outline-none"
                    >
                      <option value="Technical">Technical/Hard</option>
                      <option value="Tool">Tool/Software</option>
                      <option value="Soft/Methodology">Soft/Methodology</option>
                    </select>
                    <button 
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-1.5 px-3.5 rounded transition"
                    >
                      Add
                    </button>
                  </form>

                  {/* SKILL CHIPS GRID */}
                  {resumeData.skills.length === 0 ? (
                    <div className="bg-slate-900/30 p-4 border border-dashed border-slate-800 rounded-xl text-center text-slate-500 text-xs">
                      No skills added yet. Type above to add manually, or use the AI Skill Booster below.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 bg-slate-900/20 p-3 border border-slate-800/40 rounded-xl">
                      {resumeData.skills.map((sk) => (
                        <div 
                          key={sk.id}
                          className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 text-slate-200 py-1 pl-2.5 pr-1.5 rounded-lg text-xs"
                        >
                          <span className="font-medium">{sk.name}</span>
                          <span className={`text-[9px] px-1 rounded uppercase tracking-wider font-semibold font-mono ${
                            sk.type === "Technical" 
                              ? "bg-indigo-500/10 text-indigo-400" 
                              : sk.type === "Tool" 
                                ? "bg-amber-500/10 text-amber-400" 
                                : "bg-emerald-500/10 text-emerald-400"
                          }`}>
                            {sk.type.split("/")[0]}
                          </span>
                          <button 
                            type="button"
                            onClick={() => removeSkill(sk.id)}
                            className="text-slate-500 hover:text-rose-400 hover:bg-slate-800 p-0.5 rounded transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* AI KEYWORD SUGGESTER COLLAPSIBLE BOX */}
                  <div className="bg-indigo-950/20 border border-indigo-900/40 rounded-xl p-4 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-1.5 font-display">
                          <Sparkles className="w-4 h-4 text-yellow-400" />
                          ATS Keywords & Skills Suggestion Engine
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Analyze recruiter expectations for your target role to append critical hidden keywords.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleSuggestSkills}
                        disabled={suggestingSkills}
                        className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition self-start disabled:opacity-40"
                      >
                        {suggestingSkills ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Analyzing Job Market...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            Suggest Top Keywords
                          </>
                        )}
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-indigo-300 uppercase tracking-wide">
                        Optional: Paste Target Job Description (Paste snippets to align keywords specifically)
                      </label>
                      <textarea 
                        rows={2}
                        placeholder="e.g. We are seeking a React developer familiar with agile methodologies, automated CI/CD pipelines, and writing robust TypeScript components..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition leading-relaxed"
                      />
                    </div>

                    {/* SUGGESTION RESULTS PANEL */}
                    {skillsSuggestions && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="bg-slate-950 rounded-lg border border-slate-800 p-3.5 space-y-3"
                      >
                        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                          <span className="text-xs font-bold uppercase text-indigo-300 tracking-wider">
                            Suggested Critical ATS Keywords (10 Recommendations)
                          </span>
                          <button 
                            type="button"
                            onClick={() => setSkillsSuggestions(null)}
                            className="text-[10px] text-slate-500 hover:text-slate-300"
                          >
                            Hide suggestions
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                          {skillsSuggestions.map((sk, idx) => {
                            const refKey = `suggest-${idx}`;
                            const isChecked = !!selectedSuggestions[refKey];
                            return (
                              <div 
                                key={idx}
                                onClick={() => toggleSelectSuggestion(refKey)}
                                className={`p-2 rounded-lg border cursor-pointer flex items-start gap-2.5 transition select-none ${
                                  isChecked 
                                    ? "bg-indigo-950/15 border-indigo-500/60" 
                                    : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700"
                                }`}
                              >
                                <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                                  isChecked ? "bg-indigo-600 border-indigo-500 text-white" : "border-slate-600"
                                }`}>
                                  {isChecked && <Check className="w-3 h-3" />}
                                </div>
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-slate-200">{sk.name}</span>
                                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wide">
                                      ({sk.type.split("/")[0]})
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-400 font-normal leading-normal">{sk.reason}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                          <span className="text-[10px] text-slate-400">
                            Check the boxes of skills you are ready to demonstrate or speak on during interviews.
                          </span>
                          <button
                            type="button"
                            onClick={addSelectedSkills}
                            className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1 px-3 rounded-lg flex items-center gap-1 transition shadow-lg shadow-indigo-600/10"
                          >
                            Add Checked Skills
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4 Form */}
            {activeStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    Review & High-Quality Export
                  </h2>
                  <p className="text-slate-400 text-xs mt-1">
                    Select your preferred professional template aesthetic and download your master PDF document.
                  </p>
                </div>

                {/* TEMPLATE SWITCHER */}
                <div className="bg-slate-900 p-4 border border-slate-800 rounded-xl space-y-3">
                  <span className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Aesthetic Visual Themes</span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setTemplate("modern")}
                      className={`p-3.5 rounded-lg border text-left transition ${
                        template === "modern" 
                          ? "bg-indigo-600/10 border-indigo-500 text-white"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span className="block text-xs font-bold uppercase tracking-wider mb-1">Modern Minimalist</span>
                      <span className="text-[10px] text-slate-400 leading-normal block">
                        Features the crisp Inter and Space Grotesk fonts, left aligned headers, and modern slate separator tags. Excellent for software engineering and UX.
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTemplate("executive")}
                      className={`p-3.5 rounded-lg border text-left transition ${
                        template === "executive" 
                          ? "bg-sky-950/15 border-sky-500 text-white"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span className="block text-xs font-bold uppercase tracking-wider mb-1 text-sky-400">Executive Corporate</span>
                      <span className="text-[10px] text-slate-400 leading-normal block">
                        Features centered headers, thick custom navy borders, uppercase subheadings, and a structured column grid. Ideal for consulting, sales, and management roles.
                      </span>
                    </button>
                  </div>
                </div>

                {/* ATS DISCLOSURE AND METRIC CHECKLIST */}
                <div className="bg-slate-900/40 p-4 border border-slate-800 rounded-xl space-y-3 text-xs leading-relaxed text-slate-300">
                  <h4 className="font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                    <Info className="w-4 h-4 shrink-0" />
                    Hiring Manager & ATS Quality Checklist
                  </h4>
                  <ul className="list-disc pl-4 space-y-1.5 text-slate-400">
                    <li><strong className="text-slate-200">Empathy Mapping:</strong> If you are pivoting careers, double check that your summary addresses how your old achievements translate to your new duties.</li>
                    <li><strong className="text-slate-200">Google XYZ Formula:</strong> Ensure at least 3 of your experience bullet lines start with active verbs and suggest concrete numeric progress.</li>
                    <li><strong className="text-slate-200">Verify Metrics:</strong> Never lie on resumes. If you used an AI variation with dummy numbers, replace them with realistic estimates.</li>
                  </ul>
                </div>

                {/* PDF PRINT TRIGGER BUTTON */}
                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/10"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF / Print Resume
                  </button>
                </div>

                {/* PRINT INSTRUCTIONS */}
                <div className="bg-slate-900/25 p-3.5 border border-slate-800/60 rounded-xl text-[11px] text-slate-400 leading-relaxed space-y-1.5">
                  <span className="block font-bold text-slate-300 uppercase tracking-wide">How to Save as PDF:</span>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Click the green <strong className="text-emerald-400">"Download PDF"</strong> button above. This opens your browser's Print dialog.</li>
                    <li>In the "Destination" dropdown, choose <strong className="text-slate-200">"Save as PDF"</strong>.</li>
                    <li>Under "More settings", <strong className="text-slate-200">uncheck "Headers and footers"</strong> to prevent page URLs from printing.</li>
                    <li>Keep "Background graphics" <strong className="text-slate-200">checked</strong> to preserve subtle layout styles.</li>
                  </ol>
                </div>
              </div>
            )}

            {/* LOWER FORM NAVIGATION BUTTONS */}
            <div className="mt-8 pt-4 border-t border-slate-800/80 flex justify-between items-center gap-4">
              <button
                type="button"
                disabled={activeStep === 1}
                onClick={() => setActiveStep(prev => prev - 1)}
                className="px-3.5 py-2 text-xs font-bold text-slate-400 bg-slate-900 hover:text-slate-200 hover:bg-slate-800 rounded-lg border border-slate-800 transition disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Previous Step
              </button>

              <button
                type="button"
                onClick={() => {
                  if (activeStep < 4) {
                    setActiveStep(prev => prev + 1);
                  } else {
                    handlePrint();
                  }
                }}
                className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition ${
                  activeStep === 4 
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white"
                }`}
              >
                {activeStep === 4 ? (
                  <>
                    <Download className="w-4 h-4" /> Download PDF
                  </>
                ) : (
                  <>
                    Next Step <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* LIVE PREVIEW COLUMN (Right) */}
        <div className={`lg:col-span-5 flex flex-col gap-4 sticky top-24 h-[calc(100vh-120px)] ${activeTab === "preview" ? "block" : "hidden lg:block"}`}>
          {/* Preview Panel Header Controls (Hidden in print) */}
          <div className="no-print bg-slate-950 p-3 rounded-xl border border-slate-800/60 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-display">
              <Eye className="w-4 h-4 text-indigo-500" />
              Live Interactive Preview
            </span>
            
            {/* Short-form quick theme switcher */}
            <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => setTemplate("modern")}
                className={`px-2 py-1 text-[10px] font-bold rounded transition ${
                  template === "modern" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Minimalist
              </button>
              <button
                onClick={() => setTemplate("executive")}
                className={`px-2 py-1 text-[10px] font-bold rounded transition ${
                  template === "executive" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Executive
              </button>
            </div>
          </div>

          {/* Interactive Scaled Resume Render Container */}
          <div className="flex-1 overflow-y-auto bg-slate-950 rounded-xl border border-slate-800 p-4 shadow-inner relative select-none">
            {/* Sheet Render */}
            <ResumePreview data={resumeData} template={template} />
          </div>
        </div>

      </main>

      {/* GLOBAL BACKGROUND PRINT OVERLAY (Only visible when printing is triggered) */}
      <div className="hidden print:block print-container w-full min-h-screen bg-white">
        <ResumePreview data={resumeData} template={template} />
      </div>

      {/* FOOTER */}
      <footer className="no-print mt-auto bg-slate-950 border-t border-slate-800/80 py-4 text-center text-xs text-slate-500 italic">
        Powered by Gemini 3.5 Flash Model. Made with passion for career accelerators.
      </footer>
    </div>
  );
}
