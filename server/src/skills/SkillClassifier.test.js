/**
 * SkillClassifier Unit Tests
 * Run: node --experimental-vm-modules node_modules/.bin/jest src/skills/SkillClassifier.test.js
 */
import { skillClassifier, CANONICAL_BUCKETS } from './SkillClassifier.js';

describe('SkillClassifier.classify()', () => {

  // ── Languages ────────────────────────────────────────────────────────────
  test('classifies programming languages correctly', () => {
    const result = skillClassifier.classify(['Python', 'JavaScript', 'TypeScript', 'Java', 'C++']);
    expect(result.languages.map(s => s.value)).toEqual(
      expect.arrayContaining(['Python', 'JavaScript', 'TypeScript', 'Java', 'C++'])
    );
    expect(result.languages.length).toBe(5);
  });

  // ── Frontend ─────────────────────────────────────────────────────────────
  test('React → frontend', () => {
    const r = skillClassifier.classify(['React', 'Next.js', 'Tailwind CSS', 'Redux']);
    expect(r.frontend.map(s => s.value)).toContain('React');
    expect(r.frontend.map(s => s.value)).toContain('Next.js');
    expect(r.frontend.map(s => s.value)).toContain('Tailwind CSS');
  });

  // ── Backend ──────────────────────────────────────────────────────────────
  test('Node.js and Express → backend', () => {
    const r = skillClassifier.classify(['Node.js', 'Express', 'Express.js']);
    expect(r.backend.map(s => s.value)).toContain('Node.js');
    expect(r.backend.map(s => s.value)).toContain('Express');
  });

  test('REST APIs → backend', () => {
    const r = skillClassifier.classify(['REST APIs', 'REST API', 'RESTful APIs']);
    expect(r.backend.length).toBeGreaterThan(0);
  });

  test('Socket.IO and WebSockets → backend', () => {
    const r = skillClassifier.classify(['Socket.IO', 'WebSockets']);
    expect(r.backend.map(s => s.value)).toContain('Socket.IO');
    expect(r.backend.map(s => s.value)).toContain('WebSockets');
  });

  test('JWT and OAuth → backend', () => {
    const r = skillClassifier.classify(['JWT', 'OAuth', 'OAuth 2.0']);
    expect(r.backend.map(s => s.value)).toContain('JWT');
  });

  // ── Databases ─────────────────────────────────────────────────────────────
  test('MongoDB and MySQL → databases', () => {
    const r = skillClassifier.classify(['MongoDB', 'MySQL', 'PostgreSQL', 'Redis']);
    expect(r.databases.map(s => s.value)).toContain('MongoDB');
    expect(r.databases.map(s => s.value)).toContain('MySQL');
    expect(r.databases.map(s => s.value)).toContain('PostgreSQL');
  });

  // ── Cloud & DevOps ────────────────────────────────────────────────────────
  test('Vercel and Render → cloudDevOps', () => {
    const r = skillClassifier.classify(['Vercel', 'Render', 'Docker', 'AWS']);
    expect(r.cloudDevOps.map(s => s.value)).toContain('Vercel');
    expect(r.cloudDevOps.map(s => s.value)).toContain('Render');
    expect(r.cloudDevOps.map(s => s.value)).toContain('Docker');
    expect(r.cloudDevOps.map(s => s.value)).toContain('AWS');
  });

  // ── Developer Tools ────────────────────────────────────────────────────────
  test('Git, GitHub, Postman → developerTools', () => {
    const r = skillClassifier.classify(['Git', 'GitHub', 'Postman', 'VS Code']);
    expect(r.developerTools.map(s => s.value)).toContain('Git');
    expect(r.developerTools.map(s => s.value)).toContain('GitHub');
    expect(r.developerTools.map(s => s.value)).toContain('Postman');
  });

  // ── Core Concepts ─────────────────────────────────────────────────────────
  test('DSA, OOP, RBAC, Authentication → coreConcepts', () => {
    const r = skillClassifier.classify([
      'Data Structures & Algorithms', 'OOP', 'RBAC',
      'Authentication', 'System Design', 'Operating Systems', 'Computer Networks'
    ]);
    const concepts = r.coreConcepts.map(s => s.value);
    expect(concepts).toContain('OOP');
    expect(concepts).toContain('RBAC');
    expect(concepts).toContain('Authentication');
    expect(concepts).toContain('System Design');
    expect(concepts).toContain('Operating Systems');
    expect(concepts).toContain('Computer Networks');
  });

  test('DSA never goes to aiLlm or backend', () => {
    const r = skillClassifier.classify(['DSA', 'Data Structures & Algorithms', 'Algorithms']);
    expect(r.aiLlm.length).toBe(0);
    expect(r.backend.map(s => s.value)).not.toContain('DSA');
    expect(r.coreConcepts.length).toBeGreaterThan(0);
  });

  // ── AI & LLM ─────────────────────────────────────────────────────────────
  test('Gemini API, LangChain, PyTorch → aiLlm', () => {
    const r = skillClassifier.classify(['Gemini API', 'LangChain', 'PyTorch', 'TensorFlow', 'RAG']);
    expect(r.aiLlm.map(s => s.value)).toContain('LangChain');
    expect(r.aiLlm.map(s => s.value)).toContain('RAG');
  });

  test('aiLlm is empty for non-AI resumes', () => {
    const r = skillClassifier.classify(['React', 'Node.js', 'MongoDB', 'Git']);
    expect(r.aiLlm.length).toBe(0);
  });

  // ── Never-discard guarantee ───────────────────────────────────────────────
  test('unknown skills fall into technologies, never discarded', () => {
    const r = skillClassifier.classify(['SomeProprietary Tool v2.0', 'CustomFramework']);
    expect(r.technologies.length).toBe(2);
    expect(r.technologies.map(s => s.value)).toContain('SomeProprietary Tool v2.0');
  });

  test('no skill is silently dropped', () => {
    const input = [
      'React', 'Node.js', 'Express', 'Socket.IO', 'MongoDB', 'MySQL',
      'Git', 'GitHub', 'Postman', 'Vercel', 'Render',
      'Authentication', 'RBAC', 'OOP', 'WebSockets'
    ];
    const r = skillClassifier.classify(input);
    const total = CANONICAL_BUCKETS.reduce((sum, b) => sum + (r[b]?.length ?? 0), 0);
    expect(total).toBe(input.length);
  });

  // ── Case-insensitivity ────────────────────────────────────────────────────
  test('classification is case-insensitive', () => {
    const r = skillClassifier.classify(['REACT', 'node.js', 'MONGODB', 'git']);
    expect(r.frontend.length).toBeGreaterThan(0);
    expect(r.backend.length).toBeGreaterThan(0);
    expect(r.databases.length).toBeGreaterThan(0);
    expect(r.developerTools.length).toBeGreaterThan(0);
  });

  // ── Deduplication ─────────────────────────────────────────────────────────
  test('duplicate skills are deduplicated', () => {
    const r = skillClassifier.classify(['React', 'React', 'react', 'REACT']);
    expect(r.frontend.length).toBe(1);
  });
});

describe('SkillClassifier.reclassify()', () => {
  test('upgrades v1 (9-bucket) legacy data without losing skills', () => {
    const legacy = {
      languages: [{ value: 'Python', confidence: 1 }],
      frameworks: [{ value: 'React', confidence: 1 }],  // v1 key
      cloud: [{ value: 'AWS', confidence: 1 }],          // v1 key
      other: [{ value: 'DSA', confidence: 1 }],          // v1 key
    };
    const r = skillClassifier.reclassify(legacy);
    expect(r.languages.map(s => s.value)).toContain('Python');
    expect(r.frontend.map(s => s.value)).toContain('React');
    expect(r.cloudDevOps.map(s => s.value)).toContain('AWS');
    expect(r.coreConcepts.map(s => s.value)).toContain('DSA');
  });

  test('upgrades v2 (6-bucket) data correctly', () => {
    const v2 = {
      tools: [{ value: 'Git', confidence: 1 }, { value: 'Postman', confidence: 1 }],
      concepts: [{ value: 'OOP', confidence: 1 }, { value: 'RBAC', confidence: 1 }],
    };
    const r = skillClassifier.reclassify(v2);
    expect(r.developerTools.map(s => s.value)).toContain('Git');
    expect(r.coreConcepts.map(s => s.value)).toContain('OOP');
  });
});

describe('SkillClassifier.compactForDisplay()', () => {
  test('thin buckets merge into technologies for display', () => {
    const classified = skillClassifier.classify(['React', 'Node.js', 'MongoDB', 'Gemini API']); // aiLlm has 1 item
    const compact = skillClassifier.compactForDisplay(classified);
    // Gemini API has only 1 item → should merge into technologies
    expect(compact.aiLlm?.length ?? 0).toBe(0);
    expect(compact.technologies?.map(s => s.value) ?? []).toContain('Gemini API');
  });

  test('buckets with >= 3 items remain standalone', () => {
    const r = skillClassifier.classify(['React', 'Next.js', 'Tailwind CSS', 'Redux']);
    const compact = skillClassifier.compactForDisplay(r);
    expect(compact.frontend.length).toBe(4);
  });
});
