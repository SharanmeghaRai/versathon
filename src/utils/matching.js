const SKILL_ALIASES = {
  js: "javascript",
  ts: "typescript",
  py: "python",
  reactjs: "react",
  nextjs: "react",
  ux: "ui/ux",
  ui: "ui/ux",
  ml: "machine learning",
  ai: "machine learning",
  ds: "data structures",
  dsa: "data structures",
  cpp: "c++",
  cad: "cad modeling",
};

export function cleanSkill(term = "") {
  const normalized = term.trim().toLowerCase().replace(/[^a-z0-9+#/ ]/g, "");
  return SKILL_ALIASES[normalized] || normalized;
}

export function skillsOverlap(a = "", b = "") {
  const normA = cleanSkill(a);
  const normB = cleanSkill(b);
  if (!normA || !normB) return false;
  return normA === normB || normA.includes(normB) || normB.includes(normA);
}

export function isGreatMatch(userA, userB) {
  if (!userA || !userB) return false;

  const aWants = userA.learningSkills || [];
  const aTeaches = userA.teachingSkills || [];
  const bWants = userB.learningSkills || [];
  const bTeaches = userB.teachingSkills || [];

  const bCanTeachA = aWants.some((w) => bTeaches.some((t) => skillsOverlap(w, t)));
  const aCanTeachB = bWants.some((w) => aTeaches.some((t) => skillsOverlap(t, w)));

  return bCanTeachA && aCanTeachB;
}

export function teachesSomethingIWant(me, other) {
  if (!me || !other) return false;
  const myWants = me.learningSkills || [];
  const theirTeaches = other.teachingSkills || [];
  return myWants.some((w) => theirTeaches.some((t) => skillsOverlap(w, t)));
}

export function calculateMatchScore(me, other) {
  if (!me || !other) return 0;
  let score = 0;

  const myWants = me.learningSkills || [];
  const myTeaches = me.teachingSkills || [];
  const theirWants = other.learningSkills || [];
  const theirTeaches = other.teachingSkills || [];

  const teachMatches = myWants.filter((w) => theirTeaches.some((t) => skillsOverlap(w, t))).length;
  const learnMatches = myTeaches.filter((t) => theirWants.some((w) => skillsOverlap(t, w))).length;

  if (teachMatches > 0 && learnMatches > 0) score += 60;
  else if (teachMatches > 0) score += 35;

  if (me.learningMode === other.learningMode || other.learningMode === "Both" || me.learningMode === "Both") {
    score += 20;
  }

  if (me.department && other.department && me.department === other.department) {
    score += 10;
  }

  if (other.rating && other.rating >= 4.5) {
    score += 10;
  }

  return Math.min(score, 100);
}
