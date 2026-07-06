export const agentTemplates = {
  ResumeAgent: (context) => {
    if (!context || !context.resume) return '';
    const r = context.resume;
    let text = '';
    if (r.summary) text += `Resume Summary:\n${r.summary}\n\n`;
    if (r.skills && Object.keys(r.skills).length > 0) text += `Skills:\n${JSON.stringify(r.skills, null, 2)}\n\n`;
    if (r.experience && r.experience.length > 0) text += `Experience:\n${JSON.stringify(r.experience, null, 2)}\n\n`;
    if (r.education && r.education.length > 0) text += `Education:\n${JSON.stringify(r.education, null, 2)}\n\n`;
    if (r.projects && r.projects.length > 0) text += `Projects:\n${JSON.stringify(r.projects, null, 2)}\n\n`;
    if (r.atsData) text += `ATS Parsed Data (Feedback/Scores):\n${JSON.stringify(r.atsData, null, 2)}\n\n`;
    return text.trim();
  },

  JobAgent: (context) => {
    if (!context) return '';
    let text = '';
    if (context.jobs && context.jobs.length > 0) {
      text += `Relevant/Saved Jobs:\n${JSON.stringify(context.jobs, null, 2)}\n\n`;
    }
    if (context.applications && context.applications.length > 0) {
      text += `User's Applications:\n${JSON.stringify(context.applications, null, 2)}\n\n`;
    }
    return text.trim();
  },

  InterviewAgent: (context) => {
    if (!context || !context.interviews || context.interviews.length === 0) return '';
    return `Interview History:\n${JSON.stringify(context.interviews, null, 2)}`;
  },

  CareerAgent: (context) => {
    if (!context || !context.profile) return '';
    return `User Profile & Career Goals:\n${JSON.stringify(context.profile, null, 2)}`;
  },

  CodingAgent: (context) => {
    if (!context || !context.codingHistory || context.codingHistory.length === 0) return '';
    return `Coding History & Statistics:\n${JSON.stringify(context.codingHistory, null, 2)}`;
  }
};
