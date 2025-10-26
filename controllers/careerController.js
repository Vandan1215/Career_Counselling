// controllers/careerController.js
import { generateRecommendations } from "../services/recommendationService.js";

/**
 * @desc Renders the home page
 */
export function showHome(req, res) {
  res.render("index", { title: "Career Counseling App" });
}

/**
 * @desc Renders the career form page (create.ejs)
 */
export function showCareerForm(req, res) {
  res.render("create", { title: "Career Form" });
}

/**
 * @desc Handles form submission and generates career recommendations
 */
export function getRecommendations(req, res) {
  try {
    console.log("🟢 POST /career/recommendations triggered");
    console.log("📝 Request body received:");
    console.log(req.body);

    // Extract all form data directly from req.body
    const profile = {
      name: req.body.name || "",
      age: req.body.age || "",
      gender: req.body.gender || "",
      education: req.body.education || "",
      stream: req.body.stream || "",
      location: req.body.location || "",
      subjects: req.body.subjects || "",
      workType: req.body.workType || "",
      industries: req.body.industries || "",
      hobbies: req.body.hobbies || "",
      entrepreneurship: req.body.entrepreneurship || "",
      techSkills: req.body.techSkills || "",
      softSkills: req.body.softSkills || "",
      creativity: req.body.creativity || "",
      parentsOccupation: req.body.parentsOccupation || "",
      incomeRange: req.body.incomeRange || "",
      familyExpectations: req.body.familyExpectations || "",
      supportHigherStudies: req.body.supportHigherStudies || "",
      lifeGoal: req.body.lifeGoal || "",
      workLife: req.body.workLife || "",
      relocate: req.body.relocate || "",
      lifestyle: req.body.lifestyle || "",
      experience: req.body.experience || "",
      projects: req.body.projects || "",
      achievements: req.body.achievements || "",
      personality: req.body.personality || "",
      values: req.body.values || "",
      riskLevel: req.body.riskLevel || "",
    };

    // ✅ Call service to generate recommendations
    const recommendations = generateRecommendations(profile);

    console.log("✅ Recommendations generated successfully:");
    console.log(recommendations);

    // Render the results page
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
