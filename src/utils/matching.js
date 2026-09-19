// This is the "smart matching" logic — and it's intentionally simple.
// A skill exchange is a "Great Match" when:
//   - the other student can teach something I want to learn, AND
//   - I can teach something the other student wants to learn.
// This is plain array comparison, no AI required.

function normalize(list = []) {
  return list.map((s) => s.trim().toLowerCase());
}

export function isGreatMatch(me, other) {
  if (!me || !other) return false;
  const myWants = normalize(me.learningSkills);
  const myTeaches = normalize(me.teachingSkills);
  const theirTeaches = normalize(other.teachingSkills);
  const theirWants = normalize(other.learningSkills);

  const theyTeachWhatIWant = myWants.some((skill) => theirTeaches.includes(skill));
  const iTeachWhatTheyWant = myTeaches.some((skill) => theirWants.includes(skill));

  return theyTeachWhatIWant && iTeachWhatTheyWant;
}

// Used on Discover: does this student teach ANY skill I want to learn?
export function teachesSomethingIWant(me, other) {
  if (!me || !other) return false;
  const myWants = normalize(me.learningSkills);
  const theirTeaches = normalize(other.teachingSkills);
  return myWants.some((skill) => theirTeaches.includes(skill));
}
