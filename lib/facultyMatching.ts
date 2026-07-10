import facultyProfiles from "@/data/facultyProfiles.json";
import researchSynonyms from "@/data/researchSynonyms.json";
import type { FacultyMatch, FacultyProfile, GraduateProgram, StudentProfile } from "@/types/recommendation";

type ResearchSynonymGroup = {
  category: string;
  triggers: string[];
  expandedKeywords: string[];
};

const genericKeywords = new Set(["工程", "科学", "研究", "系统", "engineering", "science", "research", "systems"]);
const weakProgramKeywords = new Set(["工学", "土木", "建筑", "工程", "engineering", "science"]);

function normalizeKeywords(text: string) {
  return text
    .toLowerCase()
    .replace(/[，。；、/|,.;:()（）-]/g, " ")
    .split(/\s+/)
    .map((keyword) => keyword.trim())
    .filter((keyword) => keyword.length > 1 && !genericKeywords.has(keyword));
}

function getExpandedKeywords(text: string) {
  const lowerText = text.toLowerCase();
  const groups = (researchSynonyms as ResearchSynonymGroup[]).filter((group) =>
    group.triggers.some((trigger) => lowerText.includes(trigger.toLowerCase()))
  );

  return Array.from(new Set(groups.flatMap((group) => group.expandedKeywords)));
}

function getProgramAffinity(program: GraduateProgram, profile: FacultyProfile) {
  const profileText = `${profile.department} ${profile.graduateSchoolHints.join(" ")} ${profile.fieldCategory}`.toLowerCase();
  const programText = `${program.graduateSchool} ${program.programName} ${program.fieldCategory}`.toLowerCase();

  if (profile.graduateSchoolHints.some((hint) => program.graduateSchool.toLowerCase().includes(hint.toLowerCase()))) return 24;
  if (profileText.includes(program.graduateSchool.toLowerCase())) return 20;
  if (profileText.includes(program.fieldCategory.toLowerCase()) || programText.includes(profile.fieldCategory.toLowerCase())) return 10;
  return 0;
}

export function findFacultyMatches(profile: StudentProfile, program: GraduateProgram): FacultyMatch[] {
  if (program.universityName !== "Waseda University") return [];

  const targetText = `${profile.researchDirection} ${profile.additionalBackground}`;
  const userKeywords = Array.from(new Set([...normalizeKeywords(targetText), ...getExpandedKeywords(targetText)]));
  const programKeywords = new Set([...program.keywords, ...program.researchFields].map((keyword) => keyword.toLowerCase()));

  return (facultyProfiles as FacultyProfile[])
    .filter((faculty) => faculty.university === "Waseda University")
    .map((faculty) => {
      const facultyText = `${faculty.department} ${faculty.researchKeywords.join(" ")} ${faculty.researchSummary} ${faculty.fieldCategory}`.toLowerCase();
      const targetMatches = userKeywords.filter((keyword) => {
        const normalizedKeyword = keyword.toLowerCase();
        return !weakProgramKeywords.has(normalizedKeyword) && facultyText.includes(normalizedKeyword);
      });
      const programMatches = faculty.researchKeywords.filter((keyword) => {
        const normalizedKeyword = keyword.toLowerCase();
        return programKeywords.has(normalizedKeyword) && !weakProgramKeywords.has(normalizedKeyword);
      });
      const matchedKeywords = Array.from(new Set([...targetMatches, ...programMatches])).slice(0, 10);
      const affinity = getProgramAffinity(program, faculty);
      const hasResearchSignal = targetMatches.length > 0 || programMatches.length > 0;
      const score = hasResearchSignal
        ? Math.min(100, 38 + targetMatches.length * 14 + programMatches.length * 8 + Math.min(affinity, 18))
        : 0;

      return {
        match: {
          ...faculty,
          matchScore: score,
          matchedKeywords,
          matchReason:
            matchedKeywords.length > 0
              ? `研究关键词命中：${matchedKeywords.join(" / ")}`
              : ""
        },
        targetMatchCount: targetMatches.length
      };
    })
    .filter((item) => item.match.matchScore >= 58)
    .sort(
      (a, b) =>
        b.targetMatchCount - a.targetMatchCount ||
        b.match.matchScore - a.match.matchScore ||
        b.match.matchedKeywords.length - a.match.matchedKeywords.length
    )
    .slice(0, 3)
    .map((item) => item.match);
}
