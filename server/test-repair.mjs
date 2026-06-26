// Quick test of repairOneLinerText + detectSections
const rawText = 'Sriharsha Swami +91 82477 51556 | Hyderabad, TG, IN sriharshaswamy@gmail.com | linkedin.com github.com Computer Science undergraduate. PROJECTS Canteen Management System (MERN Stack) 2026 Built a full-stack app. SKILLS Languages Python, JavaScript, C Frontend React.js, HTML Backend Node.js EDUCATION Bachelor of Technology 2023 - 2027 CGPA: 9.05 CERTIFICATIONS Introduction to Operating Systems NPTEL (2025) ACHIEVEMENTS Solved 230+ problems on LeetCode OTHER ACTIVITIES Participated in Tech Hack 3 Hackathon';

const HEADER_PATTERNS = [
  'PROFESSIONAL SUMMARY', 'PROFESSIONAL EXPERIENCE', 'WORK EXPERIENCE',
  'EMPLOYMENT HISTORY', 'TECHNICAL SKILLS', 'KEY SKILLS', 'CORE SKILLS',
  'OTHER ACTIVITIES', 'EXTRACURRICULAR ACTIVITIES',
  'SUMMARY', 'PROFILE', 'OBJECTIVE', 'EXPERIENCE', 'EDUCATION', 'SKILLS',
  'PROJECTS', 'CERTIFICATIONS', 'ACHIEVEMENTS', 'LEADERSHIP',
  'HACKATHONS', 'COMPETITIONS', 'LANGUAGES', 'INTERESTS', 'CONTACT',
];

let text = rawText;
for (const header of HEADER_PATTERNS) {
  const regex = new RegExp('\\b(' + header + ')\\b', 'g');
  text = text.replace(regex, '\n' + '$1' + '\n');
}
text = text.replace(/\n{3,}/g, '\n\n');

const lines = text.split('\n').map(l => l.trim()).filter(l => l);
console.log('REPAIRED LINES:');
lines.forEach((l, i) => console.log(i + ':', JSON.stringify(l)));

// Section detection
const SECTION_ALIASES = {
  summary: ['summary','profile','objective'],
  skills: ['skills','technicalskills'],
  experience: ['experience','workexperience'],
  education: ['education'],
  projects: ['projects'],
  certifications: ['certifications'],
  achievements: ['achievements'],
  leadership: ['leadership','otheractivities'],
};
const aliasLookup = new Map();
for (const [c, aliases] of Object.entries(SECTION_ALIASES)) {
  for (const a of aliases) aliasLookup.set(a.toLowerCase().replace(/[^a-z]/g,''), c);
}
const sections = {};
let cur = 'uncategorized', content = [];
for (const line of lines) {
  if (line.length < 60) {
    const norm = line.toLowerCase().replace(/[^a-z]/g,'');
    const canonical = aliasLookup.get(norm);
    if (canonical) {
      if (content.length > 0) { sections[cur] = content.join('\n'); content = []; }
      cur = canonical; continue;
    }
  }
  content.push(line);
}
if (content.length > 0) sections[cur] = content.join('\n');
console.log('\nDETECTED SECTIONS:', Object.keys(sections));
for (const [k, v] of Object.entries(sections)) {
  console.log(k, '->', v.slice(0, 60));
}
