class JobParserService {
  parseJobDescription(rawText) {
    if (!rawText) return { extractedText: '', parsedSections: {}, keywords: [], requiredSkills: [] };

    const cleanedText = rawText
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    // Naive keyword extraction (a real system might use NLP or a predefined dictionary)
    const techDictionary = ['react', 'node.js', 'python', 'java', 'sql', 'aws', 'docker', 'kubernetes', 'agile', 'git', 'javascript', 'typescript', 'mongodb', 'express', 'c++', 'c#', 'ruby', 'go', 'rust'];
    
    const words = cleanedText.toLowerCase().split(/[\s,]+/);
    const keywords = [...new Set(words.filter(w => techDictionary.includes(w)))];

    // Simple sectioning based on common JD headers
    const sections = {};
    let currentSection = 'Description';
    let currentContent = [];
    
    const headers = ['responsibilities', 'requirements', 'qualifications', 'what you will do', 'what we are looking for', 'skills'];

    const lines = cleanedText.split('\n');
    for (const line of lines) {
      const lowerLine = line.trim().toLowerCase().replace(/:$/, '');
      if (headers.includes(lowerLine)) {
        if (currentContent.length > 0) {
          sections[currentSection] = currentContent.join('\n');
        }
        currentSection = line.trim();
        currentContent = [];
      } else {
        currentContent.push(line.trim());
      }
    }
    
    if (currentContent.length > 0) {
      sections[currentSection] = currentContent.join('\n');
    }

    return {
      extractedText: cleanedText,
      parsedSections: sections,
      keywords,
      requiredSkills: keywords, // Fallback mapping
    };
  }
}

export default new JobParserService();
