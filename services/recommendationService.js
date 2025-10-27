// services/recommendationService.js

function normalizeProfile(data) {
  const lower = (str) => (typeof str === "string" ? str.toLowerCase().trim() : "");
  const splitCSV = (str) => (typeof str === "string" ? str.split(",").map(s => s.trim()).filter(Boolean) : []);
  const toNum = (v, def = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : def;
  };
  const noLike = (s) => {
    const t = lower(s);
    return ["no", "none", "nope", "nah", "n/a", "na", "nil", "nothing"].includes(t);
  };

  const subjects = Array.isArray(data.subjects) ? data.subjects : (data.subjects ? [data.subjects] : []);
  const industries = Array.isArray(data.industries) ? data.industries : (data.industries ? [data.industries] : []);

  const experiences = Array.isArray(data.experiences) ? data.experiences : [];
  const projects = Array.isArray(data.projects) ? data.projects : [];
  const certifications = Array.isArray(data.certifications) ? data.certifications : [];

  // Collect all mentioned tech keywords across experience and projects
  const techTokens = []
    .concat(
      splitCSV(data.techSkills || ""),
      experiences.flatMap((e) => splitCSV(e.tech || "")),
      projects.flatMap((p) => splitCSV(p.tech || ""))
    )
    .map(lower)
    .map((t) => t.replace(/\s+/g, " "));

  const techSet = new Set(techTokens);

  // Normalize CGPA/percentage
  let cgpa = null;
  if (typeof data.cgpa === "string" && data.cgpa.trim()) {
    const raw = data.cgpa.trim();
    const pctMatch = raw.match(/(\d+(\.\d+)?)%/);
    if (pctMatch) {
      const pct = parseFloat(pctMatch[1]);
      cgpa = pct / 9.5; // rough convert if % provided; heuristic
    } else {
      const num = parseFloat(raw);
      if (Number.isFinite(num)) {
        cgpa = num > 10 ? num / 9.5 : num;
      }
    }
  }

  return {
    // Education
    educationLevel: lower(data.education || ""),
    currentStream: Array.isArray(data.stream) ? data.stream.map(lower) : [lower(data.stream || "")],
    // Interests
    interests: subjects.map(lower),
    industries: industries.map(lower),
    workType: lower(data.workType || ""),
    hobbies: splitCSV(lower(data.hobbies || "")),
    // Skills
    technicalSkills: splitCSV(lower(data.techSkills || "")),
    softSkills: splitCSV(lower(data.softSkills || "")),
    entrepreneurship: toNum(data.entrepreneurship || 0),
    creativity: toNum(data.creativity || 0),
    // Family & goals
    familyExpectations: lower(data.familyExpectations || ""),
    lifeGoal: lower(data.lifeGoal || ""),
    supportHigherStudies: lower(data.supportHigherStudies || ""),
    relocate: lower(data.relocate || ""),
    // Personality
    personalityType: lower(data.personality || ""),
    riskLevel: lower(data.riskLevel || ""),
    values: splitCSV(lower(data.values || "")),
    // Demographics
    age: toNum(data.age || 0),
    location: lower(data.location || ""),
    cgpa,
    languages: splitCSV(lower(data.languages || "")),
    // Experience/Projects/Certs
    hasExperience: Boolean(data.hasExperience),
    hasProjects: Boolean(data.hasProjects),
    hasCertifications: Boolean(data.hasCertifications),
    experiences,
    projects,
    certifications,
    experienceCount: experiences.length,
    projectCount: projects.length,
    certificationCount: certifications.length,
    // Derived tech set
    techSet,
  };
}

export function generateRecommendations(profile) {
  const data = normalizeProfile(profile);
  const recommendations = [];

  const hasAnyTech = (...keys) => keys.some((k) => data.techSet.has(k));
  const interestAny = (...keys) => keys.some((k) => data.interests.includes(k));
  const streamAny = (...keys) => data.currentStream.some((s) => keys.includes(s));
  const valuesAny = (...keys) => keys.some((k) => data.values.includes(k));
  const softAny = (...keys) => keys.some((k) => data.softSkills.some((s) => s.includes(k)));

  // ===== 🎓 Education-based recommendations =====
  if (data.educationLevel === "10th") {
    recommendations.push({
      title: "Career Counseling after 10th",
      description: "You’re at a crucial stage — explore Science, Commerce, or Arts based on your interests and aptitude.",
      path: "Take a stream aptitude test and discuss options with a counselor.",
    });
  }

  if (data.educationLevel === "12th") {
    if (streamAny("science", "math", "physics", "computer science")) {
      recommendations.push({
        title: "Engineering / Medical / Research Fields",
        description: "Science background opens paths in engineering, medical, data science, or research.",
        path: "Explore B.Tech, MBBS, B.Sc (Physics/Chemistry/Biology) and CS degrees.",
      });
    }
    if (streamAny("commerce", "economics")) {
      recommendations.push({
        title: "Business and Finance Careers",
        description: "Commerce background fits CA, Business Management, Finance, or Entrepreneurship.",
        path: "Consider B.Com, BBA, or Chartered Accountancy.",
      });
    }
    if (streamAny("arts", "history", "literature")) {
      recommendations.push({
        title: "Creative and Communication Fields",
        description: "Design, writing, law, psychology, or media could be a good fit.",
        path: "Explore BA, B.Design, Law, Journalism courses.",
      });
    }
  }

  if (data.educationLevel === "undergraduate") {
    recommendations.push({
      title: "Mid-Degree Career Exploration",
      description: "Focus on internships, skill-building, and exploring specializations.",
      path: "Target internships, key certifications, hackathons; consider graduate programs later.",
    });
  }

  if (["graduate", "postgraduate"].includes(data.educationLevel)) {
    recommendations.push({
      title: "Advanced Career Paths",
      description: "Aim for specialized roles, leadership, or research.",
      path: "Consider MBA/M.Tech/MS/PhD depending on interests.",
    });
  }

  // ===== 💼 Interest & Skill-based recommendations =====
  if (interestAny("technology", "computer science") || hasAnyTech("python", "java", "javascript", "react", "node", "c++", "sql") || data.technicalSkills.some(s => s.includes("coding"))) {
    recommendations.push({
      title: "Software Developer / Data Roles",
      description: "Your tech inclination suggests software, data, or AI-oriented roles.",
      path: "Deepen DSA, build 3–5 solid projects, contribute on GitHub, and pursue relevant internships.",
    });
  }

  if (interestAny("business", "finance") || data.entrepreneurship >= 4) {
    recommendations.push({
      title: "Entrepreneurship / Management",
      description: "A business mindset suits management roles or starting up.",
      path: "Pursue BBA/MBA or join startup incubators; build a small MVP to validate ideas.",
    });
  }

  if (interestAny("arts", "art") || data.hobbies.some(h => h.includes("drawing")) || data.creativity >= 4 || valuesAny("creativity")) {
    recommendations.push({
      title: "Design / UI-UX / Animation",
      description: "Your creative strengths align with visual design and user experience.",
      path: "Build a design portfolio; consider B.Design, UI/UX bootcamps, or motion/3D courses.",
    });
  }

  if (softAny("communication", "public speaking") || data.workType === "teaching") {
    recommendations.push({
      title: "Teaching / PR / Journalism",
      description: "Strong communication suits education, media, and public-facing roles.",
      path: "Consider B.Ed, Mass Communication, PR certifications; start with content/TA roles.",
    });
  }

  // ===== 🔧 Tech-stack inferred roles =====
  if (hasAnyTech("react", "angular", "vue", "typescript", "javascript") && hasAnyTech("node", "express", "django", "flask", "spring", "dotnet")) {
    recommendations.push({
      title: "Full-Stack Developer",
      description: "Experience with both frontend and backend stacks is a strong signal.",
      path: "Polish 2–3 full-stack projects with auth, DB, and tests; deploy and document.",
    });
  }
  if (hasAnyTech("python", "pandas", "numpy", "sklearn", "tensorflow", "pytorch")) {
    recommendations.push({
      title: "Data Science / ML Engineer",
      description: "Your Python/ML toolset points to data-driven roles.",
      path: "Do 3 data projects (EDA, ML model, end-to-end); learn MLOps basics.",
    });
  }
  if (hasAnyTech("aws", "azure", "gcp", "docker", "kubernetes", "terraform", "linux", "ci/cd")) {
    recommendations.push({
      title: "Cloud / DevOps Engineer",
      description: "Cloud and infra tools suggest DevOps or SRE paths.",
      path: "Get a cloud cert (AWS/GCP/Azure), automate with IaC, and practice CI/CD pipelines.",
    });
  }

  // ===== 🏡 Family background logic =====
  if (data.familyExpectations === "business") {
    recommendations.push({
      title: "Family Business Expansion / Entrepreneurship",
      description: "Use digital tools to scale family business.",
      path: "Learn e-commerce, digital marketing, and ops; consider a management diploma.",
    });
  }
  if (data.familyExpectations === "government job") {
    recommendations.push({
      title: "Government Jobs / Civil Services",
      description: "Stable roles in civil/defense or PSU sectors align with expectations.",
      path: "UPSC/SSC/State PSC prep with a structured timeline.",
    });
  }
  if (data.familyExpectations === "higher studies" || data.supportHigherStudies === "yes") {
    recommendations.push({
      title: "Pursue Advanced Education",
      description: "Higher studies can accelerate your goals.",
      path: "Shortlist MS/MTech/MBA programs and scholarships; prepare for GRE/GMAT/GATE as applicable.",
    });
  }

  // ===== 💭 Life goals =====
  if (data.lifeGoal === "high income") {
    recommendations.push({
      title: "High-Growth Corporate Tracks",
      description: "Tech, finance, and consulting generally pay best.",
      path: "Aim for FAANG/fintech roles, analytics, or IB/PE (with prep and networking).",
    });
  }
  if (data.lifeGoal === "social") {
    recommendations.push({
      title: "NGO / Social Impact / Policy",
      description: "If impact matters, align with education, health, or policy orgs.",
      path: "Consider Public Policy, Social Work, or EdTech; volunteer to build experience.",
    });
  }

  // ===== 🧩 Personality insights =====
  if (data.personalityType === "introvert") {
    recommendations.push({
      title: "Analytical / Research / Tech Roles",
      description: "Independent, deep-work roles often suit introverts.",
      path: "Explore data, backend, research, or writing roles.",
    });
  }
  if (data.personalityType === "extrovert") {
    recommendations.push({
      title: "Marketing / Sales / Event Management",
      description: "People-facing and leadership-oriented tracks fit.",
      path: "Look at marketing, HR, BD; hone negotiation and presentation.",
    });
  }

  // ===== 🧪 Practical next steps based on readiness =====
  if (!data.hasExperience && data.projectCount < 2) {
    recommendations.push({
      title: "Build Portfolio and Get Experience",
      description: "You’ll benefit from hands-on proof of skills.",
      path: "Do 2–3 guided projects, create a resume+LinkedIn, and apply for internships.",
    });
  }
  if (data.relocate === "yes" || data.relocate === "maybe") {
    recommendations.push({
      title: "Global Opportunities",
      description: "Relocation openness increases your options.",
      path: "Target remote-friendly roles, or explore MS abroad with assistantships.",
    });
  }
  if (data.cgpa !== null && data.cgpa >= 8.0) {
    recommendations.push({
      title: "Leverage Strong Academics",
      description: "Your grades strengthen top-program and scholarship chances.",
      path: "Shortlist top-tier programs and reach out to alumni early.",
    });
  }

  // ===== De-duplicate by title =====
  const seen = new Set();
  const unique = recommendations.filter((r) => {
    if (seen.has(r.title)) return false;
    seen.add(r.title);
    return true;
  });

  return unique.length ? unique : [{
    title: "No clear match found",
    description: "Please refine your responses for more accurate suggestions.",
    path: "Try again with more details.",
  }];
}