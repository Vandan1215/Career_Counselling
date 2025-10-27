// controllers/careerController.js
import { generateRecommendations } from "../services/recommendationService.js";

// Helper: normalize array-of-objects from form (supports express.urlencoded({ extended: true }))
function toArrayOfObjects(v) {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === "object") return Object.values(v);
  return [];
}
function isNonEmptyString(s) { return typeof s === "string" && s.trim().length > 0; }
function cleanText(s) { return (s || "").toString().trim(); }

// Optional: collapse form entries into a readable summary (for display or backup)
function summarizeExperiences(experiences = []) {
  return experiences.map((e) => {
    const role = e.role ? e.role : "";
    const company = e.company ? ` @ ${e.company}` : "";
    const duration = e.duration ? ` (${e.duration})` : "";
    const tech = e.tech ? ` [${e.tech}]` : "";
    return `${role}${company}${duration}${tech}`;
  }).filter(Boolean).join("; ");
}
function summarizeProjects(projects = []) {
  return projects.map((p) => {
    const name = p.name ? p.name : "Project";
    const tech = p.tech ? ` [${p.tech}]` : "";
    const link = p.link ? ` (${p.link})` : "";
    return `${name}${tech}${link}`;
  }).filter(Boolean).join("; ");
}
function summarizeCerts(certs = []) {
  return certs.map((c) => {
    const name = c.name || "Certification";
    const issuer = c.issuer ? ` - ${c.issuer}` : "";
    const year = c.year ? ` (${c.year})` : "";
    return `${name}${issuer}${year}`;
  }).filter(Boolean).join("; ");
}

export function showHome(req, res) {
  res.render("index", { title: "Career Counseling App" });
}

export function showCareerForm(req, res) {
  res.render("create", { title: "Career Form" });
}

export function getRecommendations(req, res) {
  try {
    console.log("🟢 POST /career/recommendations triggered");
    console.log("📝 Request body received:");
    console.log(req.body);

    // Parse booleans and collections
    const hasExperience = (req.body.hasExperience || "").toLowerCase() === "yes";
    const experiences = toArrayOfObjects(req.body.experiences).filter((e) =>
      e && (isNonEmptyString(e.role) || isNonEmptyString(e.company) || isNonEmptyString(e.description) || isNonEmptyString(e.tech))
    );

    const hasProjects = (req.body.hasProjects || "").toLowerCase() === "yes";
    const projects = toArrayOfObjects(req.body.projects).filter((p) =>
      p && (isNonEmptyString(p.name) || isNonEmptyString(p.description) || isNonEmptyString(p.tech) || isNonEmptyString(p.link))
    );

    const hasCertifications = (req.body.hasCertifications || "").toLowerCase() === "yes";
    const certifications = toArrayOfObjects(req.body.certifications).filter((c) =>
      c && (isNonEmptyString(c.name) || isNonEmptyString(c.issuer) || isNonEmptyString(c.url))
    );

    // Ensure multi-selects are arrays
    const subjects = Array.isArray(req.body.subjects) ? req.body.subjects : (req.body.subjects ? [req.body.subjects] : []);
    const industries = Array.isArray(req.body.industries) ? req.body.industries : (req.body.industries ? [req.body.industries] : []);

    const profile = {
      // Personal
      name: cleanText(req.body.name),
      email: cleanText(req.body.email),
      phone: cleanText(req.body.phone),
      age: cleanText(req.body.age),
      gender: cleanText(req.body.gender),
      education: cleanText(req.body.education),
      stream: cleanText(req.body.stream),
      cgpa: cleanText(req.body.cgpa),
      location: cleanText(req.body.location),
      languages: cleanText(req.body.languages),

      // Links
      linkedin: cleanText(req.body.linkedin),
      github: cleanText(req.body.github),
      portfolio: cleanText(req.body.portfolio),

      // Interests
      subjects,
      workType: cleanText(req.body.workType),
      industries,
      hobbies: cleanText(req.body.hobbies),
      entrepreneurship: cleanText(req.body.entrepreneurship),

      // Skills
      techSkills: cleanText(req.body.techSkills),
      softSkills: cleanText(req.body.softSkills),
      creativity: cleanText(req.body.creativity),

      // Family & Life Goals
      parentsOccupation: cleanText(req.body.parentsOccupation),
      incomeRange: cleanText(req.body.incomeRange),
      familyExpectations: cleanText(req.body.familyExpectations),
      supportHigherStudies: cleanText(req.body.supportHigherStudies),
      lifeGoal: cleanText(req.body.lifeGoal),
      workLife: cleanText(req.body.workLife),
      relocate: cleanText(req.body.relocate),
      lifestyle: cleanText(req.body.lifestyle),

      // Experience / Projects / Certifications
      hasExperience,
      experiences,
      hasProjects,
      projects,
      hasCertifications,
      certifications,

      // Backward-compatible summaries (in case any view expects strings)
      experience: summarizeExperiences(experiences),
      projectsSummary: summarizeProjects(projects),
      achievements: cleanText(req.body.achievements || summarizeCerts(certifications)),

      // Personality
      personality: cleanText(req.body.personality),
      values: cleanText(req.body.values),
      riskLevel: cleanText(req.body.riskLevel),
    };

    const recommendations = generateRecommendations(profile);

    console.log("✅ Recommendations generated successfully:");
    console.log(recommendations);

    res.render("results", {
      title: "Career Recommendations",
      profile,
      recommendations,
    });
  } catch (error) {
    console.error("❌ Error generating recommendations:", error);
    res.status(500).send("An error occurred while generating recommendations.");
  }
}