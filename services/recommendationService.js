// services/recommendationService.js

// ----------------------------------------
// 1️⃣ Normalize and clean user profile data
// ----------------------------------------
function normalizeProfile(data) {
  const lower = (s) => (typeof s === "string" ? s.toLowerCase().trim() : "");
  const csv = (s) => (typeof s === "string" ? s.split(",").map(x => x.trim().toLowerCase()).filter(Boolean) : []);
  const num = (v) => (isNaN(v) ? 0 : Number(v));

  return {
    name: data.name || "",
    age: num(data.age),
    gender: lower(data.gender),
    education: lower(data.education),
    stream: lower(data.stream),
    cgpa: num(data.cgpa),
    subjects: Array.isArray(data.subjects) ? data.subjects.map(lower) : csv(data.subjects),
    industries: Array.isArray(data.industries) ? data.industries.map(lower) : csv(data.industries),
    workType: lower(data.workType),
    hobbies: csv(data.hobbies),
    entrepreneurship: num(data.entrepreneurship),
    creativity: num(data.creativity),
    techSkills: csv(data.techSkills),
    softSkills: csv(data.softSkills),
    parentsOccupation: lower(data.parentsOccupation),
    familyExpectations: lower(data.familyExpectations),
    supportHigherStudies: lower(data.supportHigherStudies),
    lifeGoal: lower(data.lifeGoal),
    workLife: lower(data.workLife),
    relocate: lower(data.relocate),
    lifestyle: lower(data.lifestyle),
    personality: lower(data.personality),
    values: csv(data.values),
    riskLevel: lower(data.riskLevel),
    hasExperience: lower(data.hasExperience) === "yes",
    hasProjects: lower(data.hasProjects) === "yes",
    hasCertifications: lower(data.hasCertifications) === "yes"
  };
}

// ----------------------------------------
// 2️⃣ Knowledge base of domains & careers
// ----------------------------------------
const CAREER_DOMAINS = [
  {
    domain: "Technology",
    keywords: ["coding", "computer", "ai", "data", "software", "machine learning", "web", "app", "robotics"],
    skills: ["python", "java", "c++", "sql", "react", "javascript"],
    personalities: ["introvert", "analytical"],
    values: ["innovation", "logic"],
    suggestions: [
      { title: "Software Engineer", path: "Learn DSA, build projects, intern at tech startups." },
      { title: "Data Analyst / Scientist", path: "Learn Python, SQL, PowerBI, ML basics." },
      { title: "AI/ML Engineer", path: "Specialize in ML frameworks; build AI projects." }
    ]
  },
  {
    domain: "Arts & Design",
    keywords: ["drawing", "art", "creative", "design", "media", "aesthetics", "architecture", "interior"],
    skills: ["photoshop", "illustrator", "figma", "ui", "ux", "designing"],
    personalities: ["creative", "introvert", "extrovert"],
    values: ["creativity", "expression"],
    suggestions: [
      { title: "Graphic Designer", path: "Create a portfolio; learn Adobe tools." },
      { title: "UI/UX Designer", path: "Study user experience; build product mockups." },
      { title: "Interior Designer", path: "Explore architecture/interior design courses; build creative portfolio." }
    ]
  },
  {
    domain: "Business & Finance",
    keywords: ["business", "finance", "economics", "management", "marketing", "sales"],
    skills: ["excel", "accounting", "communication", "leadership"],
    personalities: ["extrovert", "leader"],
    values: ["growth", "stability", "innovation"],
    suggestions: [
      { title: "Entrepreneur / Startup Founder", path: "Develop business ideas; join incubators." },
      { title: "Financial Analyst", path: "Learn financial modeling and market analysis." },
      { title: "Marketing Manager", path: "Develop content, campaigns, and market research." }
    ]
  },
  {
    domain: "Public Service / Law",
    keywords: ["law", "justice", "policy", "government", "civil"],
    personalities: ["ambitious", "disciplined"],
    values: ["justice", "service"],
    suggestions: [
      { title: "Civil Services / UPSC", path: "Prepare for UPSC or State PSC exams." },
      { title: "Lawyer / Legal Consultant", path: "Pursue LLB; specialize in corporate or civil law." }
    ]
  },
  {
    domain: "Healthcare",
    keywords: ["medical", "biology", "health", "helping", "care"],
    personalities: ["empathetic"],
    values: ["service", "care"],
    suggestions: [
      { title: "Doctor / Nurse", path: "Medical degree (MBBS, B.Sc Nursing)." },
      { title: "Healthcare Administrator", path: "Blend management + healthcare." },
      { title: "Psychologist / Therapist", path: "Study psychology, counseling certifications." }
    ]
  },
  {
    domain: "Education / Social Work",
    keywords: ["teaching", "training", "community", "education", "volunteer"],
    personalities: ["empathetic", "extrovert"],
    values: ["service", "impact"],
    suggestions: [
      { title: "Teacher / Trainer", path: "Get B.Ed or teaching certification." },
      { title: "NGO / Social Worker", path: "Work in public policy or non-profit sector." }
    ]
  }
];

// Ensure all domain fields exist (safety)
CAREER_DOMAINS.forEach(d => {
  if (!Array.isArray(d.keywords)) d.keywords = [];
  if (!Array.isArray(d.skills)) d.skills = [];
  if (!Array.isArray(d.values)) d.values = [];
  if (!Array.isArray(d.personalities)) d.personalities = [];
  if (!Array.isArray(d.suggestions)) d.suggestions = [];
});

// ----------------------------------------
// 3️⃣ Main Recommendation Logic
// ----------------------------------------
export function generateRecommendations(profile) {
  const p = normalizeProfile(profile);
  const recs = [];

  // ---- A. Education-level recommendations ----
  if (p.education === "10th") {
    recs.push({
      title: "Explore Streams after 10th",
      description: "Explore Science, Commerce, or Arts based on aptitude and interests.",
      path: "Take a stream test or consult a counselor to understand strengths."
    });
  }

  if (p.education === "12th") {
    if (["science", "math", "physics", "computer science"].includes(p.stream)) {
      recs.push({
        title: "Science Stream Careers",
        description: "Engineering, medical, or data science are strong options.",
        path: "Explore B.Tech, MBBS, or B.Sc courses."
      });
    }
    if (["commerce", "economics"].includes(p.stream)) {
      recs.push({
        title: "Commerce Stream Careers",
        description: "Management, finance, or entrepreneurship paths fit well.",
        path: "BBA, B.Com, or CA/CS foundations."
      });
    }
    if (["arts", "humanities", "literature"].includes(p.stream)) {
      recs.push({
        title: "Arts Stream Careers",
        description: "Design, psychology, writing, and communication-based roles.",
        path: "Consider BA, Law, or Design programs."
      });
    }
  }

  if (p.education === "undergraduate") {
    recs.push({
      title: "Undergraduate Career Planning",
      description: "Internships and real-world projects can refine direction.",
      path: "Start internships, online certifications, and industry exposure."
    });
  }

  if (["graduate", "postgraduate"].includes(p.education)) {
    recs.push({
      title: "Graduate Career Opportunities",
      description: "Specialize or target leadership positions.",
      path: "Consider MBA, MS, or PhD based on interest."
    });
  }

  // ---- B. Domain-based matching ----
  CAREER_DOMAINS.forEach(domain => {
    let score = 0;

    (domain.keywords || []).forEach(k => {
      if (p.subjects.includes(k) || p.industries.includes(k) || p.hobbies.includes(k)) score += 2;
    });

    (domain.skills || []).forEach(s => {
      if (p.techSkills.includes(s) || p.softSkills.includes(s)) score += 2;
    });

    if ((domain.personalities || []).includes(p.personality)) score += 2;

    (domain.values || []).forEach(v => {
      if (p.values.includes(v)) score += 1;
    });

    // Goal-based modifiers
    if (p.lifeGoal.includes("income") && ["Technology", "Business & Finance"].includes(domain.domain)) score += 2;
    if (p.lifeGoal.includes("innovation") && ["Technology", "Arts & Design", "Business & Finance"].includes(domain.domain)) score += 2;
    if (p.lifeGoal.includes("social") && ["Education / Social Work", "Healthcare"].includes(domain.domain)) score += 2;

    if (p.entrepreneurship >= 4 && domain.domain === "Business & Finance") score += 2;
    if (p.creativity >= 4 && domain.domain === "Arts & Design") score += 2;

    if (score > 2) {
      recs.push({
        domain: domain.domain,
        score,
        recommendations: (domain.suggestions || []).slice(0, 3)
      });
    }
  });

  // ---- C. Sort & finalize ----
  recs.sort((a, b) => (b.score || 0) - (a.score || 0));

  if (!recs.length) {
    return [{
      title: "No clear match found",
      description: "Please refine your interests or skills for better recommendations.",
      path: "Add more details about what you enjoy or are good at."
    }];
  }

  // Flatten results
  const finalRecs = recs.flatMap(r =>
    (r.recommendations || []).map(s => ({
      title: `${s.title} (${r.domain})`,
      description: `Recommended from your ${r.domain} alignment.`,
      path: s.path
    }))
  );

  // ---- D. Add extra context-based suggestions ----
  if (!p.hasExperience && !p.hasProjects) {
    finalRecs.push({
      title: "Build Portfolio and Gain Experience",
      description: "Practical exposure will help solidify your interests.",
      path: "Start small projects, internships, or freelancing work."
    });
  }

  if (p.relocate === "yes" || p.relocate === "maybe") {
    finalRecs.push({
      title: "Explore Global Opportunities",
      description: "Relocation flexibility opens up international options.",
      path: "Look for remote or overseas internships and master's programs."
    });
  }

  if (p.cgpa >= 8) {
    finalRecs.push({
      title: "Leverage Strong Academics",
      description: "Your academic performance is strong for top programs.",
      path: "Consider scholarships and top-tier institutes for higher studies."
    });
  }

  return finalRecs;
}
