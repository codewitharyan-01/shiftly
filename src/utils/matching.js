// Calculate a match score (0-100) for a worker and a shift
export const calculateMatchScore = (worker, shift) => {
  if (!worker || !shift) return 0;

  let score = 50; // Base score

  // Skill/Category Match
  // Assuming worker.skills is an array of strings, and shift.category is a string
  if (worker.skills && worker.skills.length > 0) {
    const categoryLower = shift.category?.toLowerCase() || '';
    const hasSkill = worker.skills.some(skill => 
      skill.toLowerCase().includes(categoryLower) || categoryLower.includes(skill.toLowerCase())
    );
    if (hasSkill) score += 30;
  }

  // Location Match
  // Since we use mock locations like "Nikol, Ahmedabad", exact match gives points
  if (worker.location && shift.location) {
    if (worker.location === shift.location) {
      score += 20;
    }
  }

  // Clamp score
  return Math.min(Math.max(score, 10), 100);
};
