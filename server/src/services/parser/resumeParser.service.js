import CustomError from '../../errors/CustomError.js';
import resumeRepository from '../../repositories/resume.repository.js';

/**
 * Extracts text from a PDF buffer using pdfjs-dist, preserving line breaks.
 *
 * pdfjs-dist does NOT return newline characters. Instead, each text item has:
 *   - item.str       : the text fragment
 *   - item.hasEOL    : true when a soft line break follows this item
 *   - item.transform : [scaleX, skewX, skewY, scaleY, translateX, translateY]
 *                      translateY is the Y position on the page.
 *
 * Strategy:
 *   1. Emit item.str.
 *   2. If item.hasEOL is true → emit a newline.
 *   3. Otherwise compare the Y position to the next item. If the Y-delta is
 *      significant (> ~4 pts) we are on a new visual line → emit a newline.
 *   4. Add a blank separator between pages.
 */
async function extractTextFromBuffer(buffer) {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const uint8Array = new Uint8Array(buffer);
  const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

  const pageTexts = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const items = content.items;

    let pageText = '';
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.str) {
        // Empty string items with hasEOL are explicit line-break markers
        if (item.hasEOL) pageText += '\n';
        continue;
      }

      pageText += item.str;

      if (item.hasEOL) {
        pageText += '\n';
      } else {
        // Check Y-coordinate difference with the next non-empty item
        const next = items.slice(i + 1).find(it => it.str && it.str.trim());
        if (next) {
          const currentY = item.transform[5];
          const nextY = next.transform[5];
          const deltaY = Math.abs(currentY - nextY);
          if (deltaY > 4) {
            // Visual line break detected
            pageText += '\n';
          } else {
            // Same line — add a space separator if not already ending with one
            if (!pageText.endsWith(' ')) pageText += ' ';
          }
        }
      }
    }
    pageTexts.push(pageText.trim());
  }

  return pageTexts.join('\n\n');
}


/**
 * Repairs rawText that was extracted without line breaks (old extraction format).
 * Wraps known section headers with newlines so they appear on isolated lines,
 * allowing detectSections to find them via its < 60 char heuristic.
 */
function repairOneLinerText(rawText) {
  // Longer/more specific patterns must come first to avoid partial matches
  const HEADER_PATTERNS = [
    'PROFESSIONAL SUMMARY', 'PROFESSIONAL EXPERIENCE', 'WORK EXPERIENCE',
    'EMPLOYMENT HISTORY', 'TECHNICAL SKILLS', 'KEY SKILLS', 'CORE SKILLS',
    'ACADEMIC BACKGROUND', 'ACADEMIC QUALIFICATIONS', 'ACADEMIC ACHIEVEMENTS',
    'PERSONAL PROJECTS', 'ACADEMIC PROJECTS', 'MAJOR PROJECTS', 'RELEVANT PROJECTS',
    'SELECTED PROJECTS', 'PROJECT EXPERIENCE', 'KEY PROJECTS',
    'PROFESSIONAL CERTIFICATIONS', 'ONLINE COURSES', 'TOOLS AND TECHNOLOGIES',
    'SKILLS AND TECHNOLOGIES', 'CODING PROFILES', 'ONLINE PROFILES',
    'LANGUAGES SPOKEN', 'HOBBIES AND INTERESTS', 'POSITIONS OF RESPONSIBILITY',
    'EXTRACURRICULAR ACTIVITIES', 'COMMUNITY SERVICE', 'OTHER ACTIVITIES',
    'OPEN SOURCE', 'AWARDS AND HONORS', 'AREAS OF EXPERTISE',
    // Single-word headers last
    'SUMMARY', 'PROFILE', 'OBJECTIVE', 'EXPERIENCE', 'EDUCATION', 'SKILLS',
    'PROJECTS', 'CERTIFICATIONS', 'ACHIEVEMENTS', 'LEADERSHIP', 'PUBLICATIONS',
    'HACKATHONS', 'COMPETITIONS', 'LANGUAGES', 'INTERESTS', 'CONTACT',
    'RESEARCH', 'VOLUNTEERING', 'ACTIVITIES', 'HONORS', 'AWARDS',
  ];

  let text = rawText;
  for (const header of HEADER_PATTERNS) {
    // Wrap the header with newlines on both sides so it appears on its own line.
    // \b ensures we match whole words only.
    const regex = new RegExp(`\\b(${header})\\b`, 'g');
    text = text.replace(regex, '\n$1\n');
  }

  // Collapse any excessive newlines created by the replacements
  text = text.replace(/\n{3,}/g, '\n\n');
  return text;
}


class ResumeParserService {
  /**
   * Cleans raw text by normalizing whitespace and line breaks.
   */
  cleanText(rawText) {
    if (!rawText) return '';
    return rawText
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\t+/g, ' ')
      .replace(/[^\S\n]{2,}/g, ' ')
      .trim();
  }

  /**
   * Detects resume sections using a comprehensive alias map.
   * Normalization: lowercase + strip all non-alpha (handles ALL-CAPS, colons, dashes, etc.)
   */
  detectSections(cleanedText) {
    // Canonical section name → array of normalized aliases
    const SECTION_ALIASES = {
      summary: [
        'summary', 'professional summary', 'profile', 'objective',
        'career objective', 'about me', 'overview', 'professional profile',
        'personal statement', 'career summary',
      ],
      skills: [
        'skills', 'technical skills', 'core skills', 'key skills',
        'technologies', 'technical expertise', 'tools and technologies',
        'programming skills', 'competencies', 'expertise',
        'skills and technologies', 'technical competencies', 'areas of expertise',
      ],
      experience: [
        'experience', 'work experience', 'professional experience',
        'employment history', 'work history', 'career history',
        'internship', 'internships', 'industry experience',
        'relevant experience', 'job experience',
      ],
      education: [
        'education', 'academic background', 'qualifications',
        'academic qualifications', 'educational background',
        'academic credentials', 'scholastic details',
      ],
      projects: [
        'projects', 'personal projects', 'academic projects',
        'major projects', 'relevant projects', 'project work',
        'project experience', 'key projects', 'selected projects',
        'side projects',
      ],
      certifications: [
        'certifications', 'certificates', 'licenses',
        'professional certifications', 'courses', 'training',
        'online courses', 'credentials',
      ],
      achievements: [
        'achievements', 'accomplishments', 'awards',
        'honors', 'recognition', 'awards and honors',
        'academic achievements', 'notable achievements',
      ],
      leadership: [
        'leadership', 'positions of responsibility',
        'extracurricular activities', 'activities', 'volunteer',
        'volunteering', 'community service', 'other activities',
        'co curricular', 'cocurricular', 'extra curricular',
        'extracurricular',
      ],
      publications: [
        'publications', 'research', 'papers', 'articles',
        'research papers', 'journal articles',
      ],
      openSource: [
        'open source', 'open source contributions', 'contributions',
      ],
      hackathons: [
        'hackathons', 'competitions', 'contests',
      ],
      codingProfiles: [
        'coding profiles', 'online profiles', 'profiles',
        'competitive programming', 'online judge',
      ],
      languages: [
        'languages', 'languages spoken', 'language proficiency',
        'spoken languages',
      ],
      interests: [
        'interests', 'hobbies', 'hobbies and interests',
        'personal interests',
      ],
      contact: [
        'contact', 'contact information', 'contact details',
        'personal information', 'personal details',
      ],
    };

    // Pre-build a flat lookup: normalizedAlias → canonicalName
    const aliasLookup = new Map();
    for (const [canonical, aliases] of Object.entries(SECTION_ALIASES)) {
      for (const alias of aliases) {
        // Normalize: lowercase + remove everything that isn't a–z or space
        const key = alias.toLowerCase().replace(/[^a-z]/g, '').replace(/\s+/g, ' ').trim();
        aliasLookup.set(key, canonical);
      }
    }

    const sections = {};
    let currentSection = 'uncategorized';
    let currentContent = [];

    const lines = cleanedText.split('\n');

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      // Only attempt header matching on short lines (headings are rarely > 60 chars)
      if (trimmedLine.length < 60) {
        // Normalize: lowercase, strip non-alpha chars entirely
        const normalized = trimmedLine.toLowerCase().replace(/[^a-z]/g, '').replace(/\s+/g, ' ').trim();
        const canonical = aliasLookup.get(normalized);

        if (canonical) {
          // Save accumulated content under the previous section
          if (currentContent.length > 0) {
            sections[currentSection] = (sections[currentSection]
              ? sections[currentSection] + '\n'
              : '') + currentContent.join('\n');
            currentContent = [];
          }
          currentSection = canonical;
          continue;
        }
      }

      currentContent.push(trimmedLine);
    }

    // Flush the last section
    if (currentContent.length > 0) {
      sections[currentSection] = (sections[currentSection]
        ? sections[currentSection] + '\n'
        : '') + currentContent.join('\n');
    }

    return sections;
  }

  /**
   * Parses a PDF from an in-memory buffer (called during upload via Multer memoryStorage).
   * Text is saved to MongoDB immediately — no Cloudinary download ever needed again.
   */
  async parseFromBuffer(buffer) {
    try {
      const rawText = await extractTextFromBuffer(buffer);
      const cleanedText = this.cleanText(rawText);
      const sections = this.detectSections(cleanedText);
      const hasText = rawText.trim().length > 0;

      return {
        rawText,
        cleanedText,
        sections,
        metadata: {
          parsingStatus: hasText ? 'success' : 'failed',
          sectionCount: Object.keys(sections).length,
          extractedCharacterCount: rawText.length,
          parserVersion: '1.1.0',
          extractionTimestamp: new Date(),
          failureReason: hasText ? null : 'PDF yielded no readable text (may be a scanned image)',
        },
      };
    } catch (error) {
      throw new CustomError(
        `Failed to extract text from PDF: ${error.message}`,
        500,
        'EXTRACTION_ERROR'
      );
    }
  }

  /**
   * Full AI-powered parsing pipeline. Relies on rawText stored during upload — never downloads from Cloudinary.
   */
  async createStructuredResume(resumeId) {
    const resume = await resumeRepository.findById(resumeId);
    if (!resume) throw new CustomError('Resume not found', 404, 'NOT_FOUND');

    try {
      const rawText = resume.parsedData?.rawText;

      if (!rawText || rawText.trim() === '') {
        throw new CustomError(
          'No readable text found in this resume. Please delete it and re-upload a text-based PDF (not a scanned image).',
          400,
          'EMPTY_RESUME'
        );
      }

      // Detect if rawText is old one-liner format (extracted before the line-aware fix).
      // If fewer than 10 non-empty lines exist, inject newlines before section headers.
      const lineCount = rawText.split('\n').filter(l => l.trim()).length;
      const textToProcess = lineCount < 10 ? repairOneLinerText(rawText) : rawText;

      const cleanedText = this.cleanText(textToProcess);
      const sections = this.detectSections(cleanedText);

      // AI Parsing Pipeline
      const startTime = Date.now();

      const { buildResumeParserPrompt } = await import('../../ai/prompts/resume/resumeParser.prompt.js');
      const geminiAdapter = (await import('../../ai/adapters/gemini.adapter.js')).default;
      const { resumeParserSchema } = await import('../../validators/resume.validator.js');
      const { resumeParserSchemaJSON } = await import('../../ai/schemas/resumeParser.schema.js');

      const promptText = buildResumeParserPrompt(cleanedText);

      const { parsedJSON } = await geminiAdapter.generateStructuredJSON(
        promptText,
        resumeParserSchemaJSON,
        'You must respond ONLY with valid JSON matching the requested structure. Extract all relevant details strictly matching the schema.'
      );

      // Map simple JSON to { value, confidence } format expected by Zod
      const mapToConfidence = (val) => {
        if (val === undefined || val === null || val === '') return null;
        return { value: val, confidence: 0.95 };
      };

      const mappedJSON = {};
      
      if (parsedJSON.candidate) {
        mappedJSON.candidate = {};
        for (const key of Object.keys(parsedJSON.candidate)) {
          mappedJSON.candidate[key] = mapToConfidence(parsedJSON.candidate[key]);
        }
      }
      
      mappedJSON.professionalSummary = mapToConfidence(parsedJSON.professionalSummary);
      
      if (parsedJSON.skills) {
        mappedJSON.skills = {};
        for (const key of Object.keys(parsedJSON.skills)) {
          const arr = parsedJSON.skills[key];
          if (Array.isArray(arr)) {
            mappedJSON.skills[key] = arr.map(mapToConfidence).filter(Boolean);
          }
        }
      }
      
      const arraySections = [
        'education', 'experience', 'projects', 'certifications', 
        'achievements', 'leadership', 'publications', 'openSource', 
        'hackathons', 'codingProfiles', 'languagesSpoken'
      ];
      
      for (const section of arraySections) {
        if (Array.isArray(parsedJSON[section])) {
          mappedJSON[section] = parsedJSON[section].map(item => {
            const mappedItem = {};
            for (const [key, val] of Object.entries(item)) {
              if (Array.isArray(val)) {
                mappedItem[key] = val.map(mapToConfidence).filter(Boolean);
              } else {
                mappedItem[key] = mapToConfidence(val);
              }
            }
            return mappedItem;
          });
        }
      }

      // Validate with Zod
      const validatedData = resumeParserSchema.parse(mappedJSON);
      const processingTimeMs = Date.now() - startTime;

      const parsedData = {
        rawText,
        cleanedText,
        sections,
        structuredData: validatedData,
        metadata: {
          parsingStatus: 'success',
          sectionCount: Object.keys(sections).length,
          extractedCharacterCount: rawText.length,
          parserVersion: '1.1.0',
          extractionTimestamp: new Date(),
          failureReason: null,
        },
        aiMetadata: {
          aiModel: geminiAdapter.modelName,
          promptVersion: '1.0',
          processingTimeMs,
          averageConfidence: 0.9,
        },
      };

      await resumeRepository.updateParsedData(resumeId, parsedData);

      // Generate embedding for semantic search
      try {
        const embeddingService = (await import('../embedding.service.js')).default;
        const embedResult = await embeddingService.generateEmbeddingIfChanged(cleanedText, resume.embeddingHash, {
          userId: resume.userId,
          sourceType: 'Resume',
          sourceId: resumeId
        });
        if (embedResult) {
          await resumeRepository.updateById(resumeId, {
            embedding: embedResult.embedding,
            embeddingHash: embedResult.hash
          });
        }
      } catch (embedError) {
        console.error('[ResumeParserService] Failed to generate embeddings:', embedError.message);
        // Do not fail the parse just because embeddings failed
      }

      return parsedData;

    } catch (error) {
      console.error('[ResumeParserService] Parsing failed:', error.message);

      await resumeRepository.updateParsedData(resumeId, {
        rawText: resume.parsedData?.rawText || '',
        cleanedText: resume.parsedData?.cleanedText || '',
        sections: resume.parsedData?.sections || {},
        structuredData: resume.parsedData?.structuredData || {},
        metadata: {
          parsingStatus: 'failed',
          sectionCount: 0,
          extractedCharacterCount: 0,
          parserVersion: '1.1.0',
          extractionTimestamp: new Date(),
          failureReason: error.message,
        },
      });
      throw error;
    }
  }
}

export default new ResumeParserService();
