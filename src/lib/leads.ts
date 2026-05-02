type InferArgs = {
  type?: string;
  source?: string;
  campaign?: string;
  adSet?: string;
  message?: string;
  selectedCourseTitle?: string;
};

export function inferLeadTags(args: InferArgs): string[] {
  const joined = [
    args.source,
    args.campaign,
    args.adSet,
    args.message,
    args.selectedCourseTitle,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const tags = new Set<string>();
  if (args.type === "counseling") tags.add("career-counseling");
  if (/full[\s-]?stack|web|mern|frontend|backend/.test(joined)) tags.add("web-development");
  if (/ai|ml|data|python/.test(joined)) tags.add("ai");
  if (/freelanc|fiverr|upwork/.test(joined)) tags.add("freelancing");
  if (/design|ui|ux|graphics/.test(joined)) tags.add("design");
  if (/digital|seo|marketing/.test(joined)) tags.add("marketing");
  if (/career|counsel|guidance|confused/.test(joined)) tags.add("career-counseling");
  if (/office|excel|account/.test(joined)) tags.add("office-skills");
  if (tags.size === 0) tags.add("general");
  return Array.from(tags);
}

export function calculateLeadScore(args: {
  type?: string;
  source?: string;
  hasPhone?: boolean;
  hasCourseInterest?: boolean;
  hasRecentFollowUp?: boolean;
  isOverdue?: boolean;
  interestPercentage?: number;
  interestCoursesCount?: number;
}): number {
  let score = 0;
  // Type-based scoring
  if (args.type === "counseling") score += 20;
  if (args.type === "client") score += 25;
  if (args.type === "job" || args.type === "internship") score += 10;
  if (args.type === "cospace") score += 5;
  // Source-based scoring
  if (args.source === "referral") score += 25;
  if (args.source === "walk_in") score += 20;
  if (args.source === "google_ads" || args.source === "facebook_ads") score += 15;
  // Contact & interest scoring
  if (args.hasPhone) score += 20;
  if (args.hasCourseInterest) score += 15;
  if ((args.interestCoursesCount ?? 0) > 1) score += 5;
  if (args.hasRecentFollowUp) score += 10;
  if (args.isOverdue) score -= 15;
  // Interest percentage contribution (up to 15 points)
  if (args.interestPercentage != null && args.interestPercentage > 0) {
    score += Math.round((args.interestPercentage / 100) * 15);
  }
  return Math.max(0, Math.min(100, score));
}

export function scoreToTemperature(score: number): "hot" | "warm" | "cold" {
  if (score >= 70) return "hot";
  if (score >= 40) return "warm";
  return "cold";
}
