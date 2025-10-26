// services/recommendationService.js

export function generateRecommendations(profile) {
  const data = normalizeProfile(profile);
  const recommendations = [];

  // ===== 🎓 Education-based recommendations =====
  if (data.educationLevel.includes("10th")) {
    recommendations.push({
      title: "Career Counseling after 10th",
      description:
        "You’re at a crucial stage — explore Science, Commerce, or Arts based on your interests and aptitude.",
      path: "Try taking a stream aptitude test or career assessment quiz.",
    });
  }

  if (data.educationLevel.includes("12th")) {
    if (data.currentStream.includes("science")) {
      recommendations.push({
        title: "Engineering / Medical / Research Fields",
        description:
          "Since you are from Science stream, careers in engineering, medical, data science, or research could be suitable.",
        path: "Explore B.Tech, MBBS, B.Sc (Physics/Chemistry/Biology) programs.",
      });
    }
    if (data.currentStream.includes("commerce")) {
      recommendations.push({
        title: "Business and Finance Careers",
        description:
          "Commerce background opens paths in CA, Business Management, Finance, and Entrepreneurship.",
        path: "Consider B.Com, BBA, or Chartered Accountancy.",
      });
    }
    if (data.currentStream.includes("arts")) {
      recommendations.push({
        title: "Creative and Communication Fields",
        description:
          "Arts students often excel in design, writing, law, psychology, or media fields.",
        path: "Explore BA, B.Design, Law, Journalism courses.",
      });
    }
  }

  // ===== 💼 Interest & Skill-based recommendations =====
  if (data.interests.includes("technology") || data.technicalSkills.includes("coding")) {
    recommendations.push({
      title: "Software Developer / Data Scientist",
      description:
        "Strong interest in technology and coding indicates potential in IT, AI, or Data Science roles.",
      path: "Learn programming languages, AI tools, or pursue B.Tech CS / MCA.",
    });
  }

  if (data.interests.includes("business") || data.entrepreneurship >= 4) {
    recommendations.push({
      title: "Entrepreneurship / Management",
      description:
        "You have a business mindset — management or starting your own venture could fit well.",
      path: "Consider BBA, MBA, or startup incubators.",
    });
  }

  if (
    data.interests.includes("arts") ||
    data.hobbies.includes("drawing") ||
    data.creativity >= 4
  ) {
    recommendations.push({
      title: "Design / Animation / Fine Arts",
      description:
        "You have creative strengths — explore visual design, UI/UX, or animation fields.",
      path: "B.Design, Fine Arts, or short-term design bootcamps.",
    });
  }

  if (data.softSkills.includes("communication") || data.workType.includes("teaching")) {
    recommendations.push({
      title: "Teaching / Public Relations / Journalism",
      description:
        "Strong communication and interest in people-related work suits teaching, media, or PR careers.",
      path: "B.Ed, Mass Communication, or Public Relations programs.",
    });
  }

  // ===== 🏡 Family background logic =====
  if (data.familyExpectations.includes("business")) {
    recommendations.push({
      title: "Family Business Expansion / Entrepreneurship",
      description:
        "Since your family runs a business, consider scaling it with new-age skills like digital marketing or e-commerce.",
      path: "Take business management or entrepreneurship courses.",
    });
  }

  if (data.familyExpectations.includes("government")) {
    recommendations.push({
      title: "Government Jobs / Civil Services",
      description:
        "Family expectations suggest stable government jobs — you can prepare for UPSC, SSC, or State PSC exams.",
      path: "Explore UPSC/SSC prep programs.",
    });
  }

  // ===== 💭 Life goals =====
  if (data.lifeGoal.includes("high income")) {
    recommendations.push({
      title: "Corporate / Tech / Finance Roles",
      description:
        "Since financial growth is a priority, high-paying domains like tech, finance, or consulting may fit well.",
      path: "Explore MBA, Data Analytics, or Investment Banking careers.",
    });
  }

  if (data.lifeGoal.includes("social")) {
    recommendations.push({
      title: "NGO / Social Work / Education Sector",
      description:
        "Aiming for social impact? Careers in NGOs, public policy, or teaching can be fulfilling.",
      path: "BA Social Work, Public Policy, or Education degrees.",
    });
  }

  // ===== 🧩 Personality insights =====
  if (data.personalityType === "introvert") {
    recommendations.push({
      title: "Analytical / Research / Tech Roles",
      description:
        "Introverts often thrive in analytical or independent work environments.",
      path: "Explore roles in data, research, or writing.",
    });
  }

  if (data.personalityType === "extrovert") {
    recommendations.push({
      title: "Marketing / Sales / Event Management",
      description:
        "Your extroverted nature fits roles involving people interaction and leadership.",
      path: "MBA in Marketing or roles in Sales, HR, or PR.",
    });
  }

  // ===== Remove duplicates =====
  const seen = new Set();
  const unique = recommendations.filter((r) => {
    if (seen.has(r.title)) return false;
    seen.add(r.title);
    return true;
  });

  return (
    unique.length
      ? unique
      : [
          {
            title: "No clear match found",
            description:
              "Please refine your responses for more accurate suggestions.",
            path: "Try again with more details.",
          },
        ]
  );
}

function normalizeProfile(data) {
  const lower = (str) => (typeof str === "string" ? str.toLowerCase() : "");

  return {
    educationLevel: lower(data.education || ""),
    currentStream: lower(data.stream || ""),
    interests: lower(data.subjects || data.industries || "").split(","),
    workType: lower(data.workType || ""),
    hobbies: lower(data.hobbies || ""),
    technicalSkills: lower(data.techSkills || ""),
    softSkills: lower(data.softSkills || ""),
    entrepreneurship: Number(data.entrepreneurship || 0),
    creativity: Number(data.creativity || 0),
    familyExpectations: lower(data.familyExpectations || ""),
    lifeGoal: lower(data.lifeGoal || ""),
    personalityType: lower(data.personality || ""),
  };
}
