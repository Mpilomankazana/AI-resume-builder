import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Initialize Gemini AI SDK using the official guide
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // REST API Routes
  app.post("/api/generate", async (req, res) => {
    try {
      const { task, data } = req.body;

      if (!apiKey) {
        return res.status(500).json({
          error: "Gemini API key is not configured in the workspace secrets. Please add GEMINI_API_KEY under Settings > Secrets."
        });
      }

      if (!task || !data) {
        return res.status(400).json({ error: "Missing required parameters: task and data are required." });
      }

      const validTasks = ["summary", "bullet", "skills"];
      if (!validTasks.includes(task)) {
        return res.status(400).json({ error: `Invalid task. Must be one of: ${validTasks.join(", ")}` });
      }

      // Input safety validation & length limits
      const stringifiedData = JSON.stringify(data);
      if (stringifiedData.length > 5000) {
        return res.status(400).json({ error: "Input text is too long (maximum 5000 characters allowed)." });
      }

      // Block generic abuse patterns & prompt injection
      const suspiciousPatterns = [
        /ignore prior instructions/i,
        /system prompt/i,
        /override system/i,
        /forget your instructions/i
      ];
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(stringifiedData)) {
          return res.status(400).json({
            error: "Security warning: Suspicious or unsafe input detected. Please provide standard, professional resume information."
          });
        }
      }

      let prompt = "";
      let systemInstruction = "";

      if (task === "summary") {
        const { fullName, targetRole, experienceLevel, keySkills, backgroundInfo, careerSwitcherFrom } = data;
        systemInstruction = `You are an expert resume writer and career coach specializing in helping graduates and career switchers bypass ATS filters and catch the eye of hiring managers.
Your goal is to generate a highly professional, compelling, and punchy 'Professional Summary' (about 3-4 sentences, 60-90 words).
Ensure the tone is professional, confident, and achievement-oriented.
Avoid generic clichés like "hardworking professional" or "dynamic go-getter". Instead, use concrete value propositions.
If the user is a GRADUATE, emphasize academic projects, quick learning abilities, energy, and relevant coursework.
If the user is a CAREER SWITCHER, strongly highlight transferable skills, core strengths from their previous career, and how they apply to the new role. Make the connection explicit.`;

        prompt = `Generate a professional resume summary for:
- Full Name: ${fullName || 'Professional'}
- Target Role: ${targetRole}
- Experience Level: ${experienceLevel}
- Key Skills: ${keySkills || 'various transferable skills'}
- Career Switcher details: ${careerSwitcherFrom ? `Switching from: ${careerSwitcherFrom}` : 'Not switching, standard entry/graduate'}
- Background, achievements, or projects: ${backgroundInfo || 'Passionate about growing in this domain.'}

Return ONLY the plain-text paragraph of the professional summary. Do not include introductory phrases (like "Here is your summary:") or formatting wrappers. Make it ready to be copied and pasted.`;
      } 
      else if (task === "bullet") {
        const { currentBullet, roleContext } = data;
        systemInstruction = `You are an elite ATS resume optimizer.
Your goal is to transform weak, passive, or non-quantified resume bullet points into highly optimized, high-impact, action-oriented bullet points that conform to ATS best practices and the Google 'XYZ' formula (Accomplished [X] as measured by [Y], by doing [Z]).
Always start with a strong, diverse action verb (e.g., Spearheaded, Formulated, Engineered, Revamped, Orchestrated).
Always look for ways to suggest realistic metrics placeholders (e.g., '[X]%', '$[Y]', '[Z] hours') so the candidate knows where to input actual numbers.
Provide exactly 3 variations of the optimized bullet point:
1. Variation 1: Direct and action-oriented (focused on execution)
2. Variation 2: Outcome-oriented / Quantified (using realistic metrics placeholders)
3. Variation 3: Highly Tailored to ATS/Keywords for the target role`;

        prompt = `Optimize this resume bullet point:
- Original text: "${currentBullet}"
- Role/Context: ${roleContext || 'General Professional'}

Return the output formatted strictly as a JSON object with a 'variations' array of 3 elements, where each element has a 'title' (e.g., "Direct Action", "Quantified Outcome", "ATS Targeted") and 'text' (the optimized bullet point string). Example format:
{
  "variations": [
    { "title": "Direct Action", "text": "..." },
    { "title": "Quantified Outcome", "text": "..." },
    { "title": "ATS Targeted", "text": "..." }
  ]
}
Do not include markdown blocks like \`\`\`json, just return the raw JSON string so it can be parsed directly.`;
      } 
      else if (task === "skills") {
        const { targetRole, jobDescription, currentSkills } = data;
        systemInstruction = `You are an ATS parser and recruitment advisor.
Your task is to analyze the target role and optional job description, compare it with the candidate's current skills, and suggest the top 10 most critical keywords and skills (a mix of technical/hard skills, key tools, and essential soft skills or methodologies) that are highly sought after by recruiters.
Ensure these skills are highly relevant and will help the candidate pass ATS keyword matching.`;

        prompt = `Suggest top 10 relevant skills for:
- Target Role: ${targetRole}
- Job Description Context: ${jobDescription || 'Standard industry requirements'}
- Candidate's Current Skills: ${currentSkills || 'None provided'}

Return the output formatted strictly as a JSON array of 10 skills, each skill being an object with 'name' (skill title), 'type' (Technical, Tool, or Soft/Methodology), and 'reason' (a 1-sentence explanation of why it's critical). Example format:
[
  { "name": "Skill Name", "type": "Technical", "reason": "Reason why..." },
  ...
]
Do not include markdown blocks like \`\`\`json, just return the raw JSON string.`;
      }

      // Generate content with Gemini 3.5 Flash
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
          ...( (task === "bullet" || task === "skills") ? { responseMimeType: "application/json" } : {} )
        }
      });

      const text = response.text || "";
      
      // Parse JSON responses for structured tasks
      if (task === "bullet" || task === "skills") {
        try {
          let cleaned = text.trim();
          if (cleaned.startsWith("```json")) {
            cleaned = cleaned.substring(7);
          }
          if (cleaned.endsWith("```")) {
            cleaned = cleaned.substring(0, cleaned.length - 3);
          }
          const parsed = JSON.parse(cleaned.trim());
          return res.json({ result: parsed });
        } catch (parseErr) {
          console.error("JSON parse error from model response:", text, parseErr);
          // Fallback if parsing failed - send raw text
          return res.json({ result: text, isRaw: true });
        }
      }

      return res.json({ result: text });

    } catch (error: any) {
      console.error("Error in /api/generate:", error);
      return res.status(500).json({
        error: error.message || "An unexpected error occurred while communicating with the AI backend."
      });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
