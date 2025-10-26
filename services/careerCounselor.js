// services/careerCounselor.js

export function getCareerRecommendations(profile) {
  const { interests, strengths, lifeGoals } = profile;

  const careers = [];

  // Example logic (expand this later)
  if (interests.includes("technology") || strengths.includes("problem solving")) {
    careers.push({
      title: "Software Developer",
      reason: "You enjoy solving problems and have an interest in technology."
    });
  }

  if (interests.includes("business") || strengths.includes("communication")) {
    careers.push({
      title: "Marketing Manager",
      reason: "You are good at understanding people and presenting ideas."
    });
  }

  if (interests.includes("creativity") || strengths.includes("design")) {
    careers.push({
      title: "UI/UX Designer",
      reason: "You have a strong sense of creativity and visual thinking."
    });
  }

  if (lifeGoals.includes("help others")) {
    careers.push({
      title: "Psychologist",
      reason: "You want to make an emotional impact and help people directly."
    });
  }

  if (careers.length === 0) {
    careers.push({
      title: "Career Counselor",
      reason: "You seem to enjoy understanding and guiding others' paths."
    });
  }

  return careers;
}
