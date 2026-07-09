import chinaUniversities from "@/data/chinaUniversities.json";
import type { UndergraduateTier } from "@/types/recommendation";

export type ChinaUniversity = {
  name: string;
  normalizedName: string;
  aliases: string[];
  code: string;
  authority: string;
  city: string;
  level: string;
  note: string;
  tier: UndergraduateTier;
  tags: string[];
  source: string;
};

function normalizeUniversityName(value: string) {
  return value
    .toLowerCase()
    .replace(/[（）()·\-\s]/g, "")
    .trim();
}

export function detectChinaUniversity(input: string): ChinaUniversity | null {
  const normalizedInput = normalizeUniversityName(input);
  if (!normalizedInput) return null;

  const universities = chinaUniversities as ChinaUniversity[];

  const exactMatch = universities.find(
    (university) =>
      university.normalizedName === normalizedInput ||
      university.aliases.some((alias) => normalizeUniversityName(alias) === normalizedInput)
  );
  if (exactMatch) return exactMatch;

  if (normalizedInput.length < 4) return null;

  return (
    universities.find(
      (university) =>
        normalizedInput.includes(university.normalizedName) || university.normalizedName.includes(normalizedInput)
    ) ?? null
  );
}

export function getChinaUniversityCount() {
  return (chinaUniversities as ChinaUniversity[]).length;
}
