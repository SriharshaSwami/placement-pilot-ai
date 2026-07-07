export const EDITOR_SCHEMA = [
  {
    key: 'candidate',
    title: 'Personal Information',
    type: 'object',
    fields: [
      { key: 'name', label: 'Full Name', type: 'text', col: true },
      { key: 'email', label: 'Email', type: 'email', col: true },
      { key: 'phone', label: 'Phone', type: 'text', col: true },
      { key: 'location', label: 'Location', type: 'text', col: true },
      { key: 'linkedin', label: 'LinkedIn URL', type: 'text', col: true },
      { key: 'github', label: 'GitHub URL', type: 'text', col: true },
      { key: 'portfolio', label: 'Portfolio URL', type: 'text', col: true }
    ]
  },
  {
    key: 'candidate.links',
    title: 'Custom Links',
    type: 'array-simple',
    itemTitle: 'Link',
    fields: [
      { key: 'name', label: 'Platform (e.g. Medium)', type: 'text', col: true },
      { key: 'url', label: 'URL', type: 'text', col: true }
    ],
    defaultItem: { name: '', url: '' }
  },
  {
    key: 'professionalSummary',
    title: 'Professional Summary',
    type: 'field',
    fieldType: 'multiline',
    label: 'Summary'
  },
  {
    key: 'experience',
    title: 'Experience',
    type: 'array',
    itemTitle: 'Experience',
    fields: [
      { key: 'company', label: 'Company', type: 'text', col: true },
      { key: 'role', label: 'Role', type: 'text', col: true },
      { key: 'startDate', label: 'Start Date', type: 'text', col: true },
      { key: 'endDate', label: 'End Date', type: 'text', col: true },
      { key: 'location', label: 'Location', type: 'text', col: true },
      { key: 'responsibilities', label: 'Responsibilities', type: 'string-array' }
    ],
    defaultItem: { company: { value: '' }, role: { value: '' }, startDate: { value: '' }, endDate: { value: '' }, location: { value: '' }, responsibilities: [] }
  },
  {
    key: 'education',
    title: 'Education',
    type: 'array',
    itemTitle: 'Education',
    fields: [
      { key: 'institution', label: 'Institution', type: 'text', col: true },
      { key: 'degree', label: 'Degree', type: 'text', col: true },
      { key: 'specialization', label: 'Specialization', type: 'text', col: true },
      { key: 'location', label: 'Location', type: 'text', col: true },
      { key: 'startDate', label: 'Start Date', type: 'text', col: true },
      { key: 'endDate', label: 'End Date', type: 'text', col: true },
      { key: 'cgpa', label: 'CGPA/Percentage', type: 'text', col: true }
    ],
    defaultItem: { institution: { value: '' }, degree: { value: '' }, specialization: { value: '' }, location: { value: '' }, startDate: { value: '' }, endDate: { value: '' }, cgpa: { value: '' } }
  },
  {
    key: 'projects',
    title: 'Projects',
    type: 'array',
    itemTitle: 'Project',
    fields: [
      { key: 'title', label: 'Project Title', type: 'text', col: true },
      { key: 'github.name', label: 'Link 1 Name (e.g. GitHub)', type: 'text', col: true },
      { key: 'github', label: 'Link 1 URL', type: 'text', col: true },
      { key: 'liveDemo.name', label: 'Link 2 Name (e.g. Live Demo)', type: 'text', col: true },
      { key: 'liveDemo', label: 'Link 2 URL', type: 'text', col: true },
      { key: 'bullets', label: 'Bullets', type: 'string-array' }
    ],
    defaultItem: { title: { value: '' }, github: { value: '' }, liveDemo: { value: '' }, bullets: [] }
  },
  {
    key: 'skills',
    title: 'Skills',
    type: 'skills'
  },
  {
    key: 'certifications',
    title: 'Certifications',
    type: 'array',
    itemTitle: 'Certification',
    fields: [
      { key: 'name', label: 'Name', type: 'text', col: true },
      { key: 'issuer', label: 'Issuer', type: 'text', col: true },
      { key: 'date', label: 'Date', type: 'text', col: true },
      { key: 'url.name', label: 'Link Name (e.g. Credential)', type: 'text', col: true },
      { key: 'url', label: 'URL', type: 'text', col: true }
    ],
    defaultItem: { name: { value: '' }, issuer: { value: '' }, date: { value: '' }, url: { value: '' } }
  },
  {
    key: 'achievements',
    title: 'Achievements',
    type: 'array',
    itemTitle: 'Achievement',
    fields: [
      { key: 'title', label: 'Title', type: 'text', col: true },
      { key: 'url.name', label: 'Link Name', type: 'text', col: true },
      { key: 'url', label: 'URL', type: 'text', col: true },
      { key: 'description', label: 'Description', type: 'multiline' }
    ],
    defaultItem: { title: { value: '' }, description: { value: '' } }
  }
];
