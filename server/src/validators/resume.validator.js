import { z } from 'zod';

// Gemini returns `null` for fields it couldn't find in the resume.
// We must accept both `null` and `undefined` at every level.
// .nullable() allows null, .optional() allows undefined/missing.

const ConfidenceString = z.object({
  value: z.string().nullable().optional(),
  confidence: z.number().min(0).max(1).optional()
}).nullable().optional();

const ConfidenceStringWithName = z.object({
  value: z.string().nullable().optional(),
  name: ConfidenceString,
  confidence: z.number().min(0).max(1).optional()
}).nullable().optional();

const ConfidenceStringArray = z.array(
  z.object({
    value: z.string().nullable().optional(),
    confidence: z.number().min(0).max(1).optional()
  }).nullable()
).nullable().optional();

export const resumeParserSchema = z.object({
  candidate: z.object({
    name: ConfidenceString,
    email: ConfidenceString,
    phone: ConfidenceString,
    linkedin: ConfidenceString,
    github: ConfidenceString,
    portfolio: ConfidenceString,
    location: ConfidenceString,
  }).nullable().optional(),

  professionalSummary: ConfidenceString,

  // Skills: AI returns a flat list (skills.extracted) which the server classifies into these 8 buckets before Zod validation.
  skills: z.object({
    languages:      ConfidenceStringArray,
    frontend:       ConfidenceStringArray,
    backend:        ConfidenceStringArray,
    databases:      ConfidenceStringArray,
    aiLlm:          ConfidenceStringArray,
    cloudDevOps:    ConfidenceStringArray,
    developerTools: ConfidenceStringArray,
    coreConcepts:   ConfidenceStringArray,
    technologies:   ConfidenceStringArray, // fallback
  }).nullable().optional(),

  education: z.array(z.object({
    institution: ConfidenceString,
    degree: ConfidenceString,
    specialization: ConfidenceString,
    startDate: ConfidenceString,
    endDate: ConfidenceString,
    cgpa: ConfidenceString,
    percentage: ConfidenceString,
    location: ConfidenceString,
  }).nullable()).nullable().optional(),

  experience: z.array(z.object({
    company: ConfidenceString,
    role: ConfidenceString,
    employmentType: ConfidenceString,
    startDate: ConfidenceString,
    endDate: ConfidenceString,
    duration: ConfidenceString,
    location: ConfidenceString,
    responsibilities: ConfidenceStringArray,
    technologies: ConfidenceStringArray,
  }).nullable()).nullable().optional(),

  projects: z.array(z.object({
    title: ConfidenceString,
    technologies: ConfidenceStringArray,
    github: ConfidenceStringWithName,
    liveDemo: ConfidenceStringWithName,
    bullets: ConfidenceStringArray,
  }).nullable()).nullable().optional(),

  certifications: z.array(z.object({
    name: ConfidenceString,
    issuer: ConfidenceString,
    date: ConfidenceString,
    url: ConfidenceStringWithName,
  }).nullable()).nullable().optional(),

  achievements: z.array(z.object({
    title: ConfidenceString,
    description: ConfidenceString,
    url: ConfidenceStringWithName,
  }).nullable()).nullable().optional(),

  leadership: z.array(z.object({
    role: ConfidenceString,
    organization: ConfidenceString,
    description: ConfidenceString,
  }).nullable()).nullable().optional(),

  publications: z.array(z.object({
    title: ConfidenceString,
    publisher: ConfidenceString,
    date: ConfidenceString,
    url: ConfidenceString,
  }).nullable()).nullable().optional(),

  openSource: z.array(z.object({
    project: ConfidenceString,
    description: ConfidenceString,
    url: ConfidenceString,
  }).nullable()).nullable().optional(),

  hackathons: z.array(z.object({
    name: ConfidenceString,
    role: ConfidenceString,
    description: ConfidenceString,
    date: ConfidenceString,
  }).nullable()).nullable().optional(),

  codingProfiles: z.array(z.object({
    platform: ConfidenceString,
    username: ConfidenceString,
    url: ConfidenceString,
  }).nullable()).nullable().optional(),

  languagesSpoken: z.array(z.object({
    language: ConfidenceString,
    proficiency: ConfidenceString,
  }).nullable()).nullable().optional(),
});
