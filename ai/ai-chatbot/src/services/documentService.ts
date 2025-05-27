import { promises as fs, readFileSync } from 'fs';
import { extname } from 'path';
import OpenAI from 'openai';
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const pdfParseNew = require('pdf-parse-new');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key-here'
});

export interface ResumeAnalysis {
  overallScore: number;
  scoreBreakdown: {
    content: number;
    structure: number;
    keywords: number;
    experience: number;
    education: number;
  };
  skills: string[];
  experience: string;
  educationLevel: string;
  recommendedJobs: string[];
  improvements: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
}

export interface ResumeParsing {
  personalInfo: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
  };
  skills: string[];
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  certifications: string[];
  languages: string[];
}

// Enhanced job-related keywords for comprehensive scoring
const JOB_KEYWORDS = {
  technical: [
    // Programming Languages
    'javascript', 'typescript', 'python', 'java', 'c#', 'c++', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
    // Web Technologies
    'react', 'angular', 'vue.js', 'node.js', 'express', 'next.js', 'svelte', 'html', 'css', 'sass', 'bootstrap',
    // Backend & Databases
    'spring boot', 'django', 'flask', 'laravel', 'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch',
    // Cloud & DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'ci/cd', 'git', 'github',
    // AI/ML & Data
    'machine learning', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'data science', 'ai', 'nlp', 'computer vision',
    // Tools & Frameworks
    'api', 'rest', 'graphql', 'microservices', 'agile', 'scrum', 'jira', 'confluence'
  ],
  soft: [
    'communication', 'leadership', 'teamwork', 'problem-solving', 'analytical thinking', 'creative', 'adaptable',
    'project management', 'time management', 'mentoring', 'collaboration', 'negotiation', 'presentation skills',
    'critical thinking', 'decision making', 'conflict resolution', 'customer service', 'strategic planning'
  ],
  experience: [
    'years', 'experience', 'led', 'managed', 'developed', 'implemented', 'achieved', 'improved', 'designed',
    'created', 'built', 'delivered', 'optimized', 'reduced', 'increased', 'streamlined', 'architected',
    'mentored', 'coordinated', 'collaborated', 'spearheaded', 'pioneered', 'established'
  ],
  education: [
    'degree', 'bachelor', 'master', 'phd', 'doctorate', 'certification', 'diploma', 'university', 'college',
    'institute', 'academy', 'school', 'graduate', 'undergraduate', 'mba', 'computer science', 'engineering'
  ],
  industries: [
    'software', 'technology', 'fintech', 'healthcare', 'e-commerce', 'banking', 'consulting', 'startup',
    'enterprise', 'automotive', 'gaming', 'telecommunications', 'aerospace', 'defense', 'education'
  ]
};

/**
 * Parse text content from uploaded document with enhanced PDF support
 */
async function parseDocumentText(documentPath: string): Promise<string> {
  const fileBuffer = readFileSync(documentPath);
  const fileExtension = extname(documentPath).toLowerCase();

  if (fileExtension === '.pdf') {
    try {
      // Try primary parser first
      const data = await pdfParse(fileBuffer);
      if (data.text && data.text.trim().length > 50) {
        return data.text;
      }
      
      // If primary parser doesn't get good results, try alternative
      console.log('Primary PDF parser got limited results, trying alternative...');
      const alternativeData = await pdfParseNew(fileBuffer);
      return alternativeData.text || data.text;
    } catch (error) {
      console.error('PDF parsing error:', error);
      throw new Error('Failed to parse PDF. The PDF might be image-based or corrupted.');
    }
  } else if (fileExtension === '.txt') {
    return fileBuffer.toString('utf-8');
  } else if (fileExtension === '.docx') {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value;
  } else if (fileExtension === '.doc') {
    // For older .doc files, fallback to plain text extraction
    return fileBuffer.toString('utf-8');
  } else {
    throw new Error(`Unsupported file type: ${fileExtension}`);
  }
}

/**
 * AI-powered resume analysis using OpenAI
 */
async function analyzeResumeWithAI(text: string): Promise<Partial<ResumeAnalysis>> {
  try {
    const prompt = `
Analyze this resume and provide a detailed assessment:

${text}

Please provide a JSON response with the following structure:
{
  "overallScore": number (0-100),
  "scoreBreakdown": {
    "content": number (0-100),
    "structure": number (0-100), 
    "keywords": number (0-100),
    "experience": number (0-100),
    "education": number (0-100)
  },
  "skills": ["skill1", "skill2", ...],
  "experience": "brief summary of experience level",
  "educationLevel": "education level summary",
  "recommendedJobs": ["job1", "job2", "job3"],
  "improvements": ["improvement1", "improvement2", ...],
  "matchedKeywords": ["keyword1", "keyword2", ...],
  "missingKeywords": ["missing1", "missing2", ...]
}

Focus on:
- Technical skills and experience relevance
- Resume structure and formatting
- Industry-specific keywords
- Career progression and achievements
- Areas for improvement
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert HR recruiter and resume analyst. Provide detailed, constructive feedback on resumes."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1500
    });

    const response = completion.choices[0]?.message?.content;
    if (response) {
      try {
        return JSON.parse(response);
      } catch (parseError) {
        console.warn('Failed to parse AI response, using fallback analysis');
        return {};
      }
    }
    return {};
  } catch (error) {
    console.warn('AI analysis failed, using fallback:', error);
    return {};
  }
}

/**
 * AI-powered resume parsing using OpenAI
 */
async function parseResumeWithAI(text: string): Promise<Partial<ResumeParsing>> {
  try {
    const prompt = `
Extract structured information from this resume:

${text}

Please provide a JSON response with the following structure:
{
  "personalInfo": {
    "name": "extracted name",
    "email": "extracted email", 
    "phone": "extracted phone",
    "location": "extracted location"
  },
  "skills": ["skill1", "skill2", ...],
  "experience": [
    {
      "title": "job title",
      "company": "company name", 
      "duration": "time period",
      "description": "brief description"
    }
  ],
  "education": [
    {
      "degree": "degree type",
      "institution": "institution name",
      "year": "graduation year"
    }
  ],
  "certifications": ["cert1", "cert2", ...],
  "languages": ["lang1", "lang2", ...]
}

Extract as much accurate information as possible from the resume text.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert at extracting structured data from resumes. Be precise and accurate."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 1000
    });

    const response = completion.choices[0]?.message?.content;
    if (response) {
      try {
        return JSON.parse(response);
      } catch (parseError) {
        console.warn('Failed to parse AI response, using fallback parsing');
        return {};
      }
    }
    return {};
  } catch (error) {
    console.warn('AI parsing failed, using fallback:', error);
    return {};
  }
}
function calculateResumeScore(text: string): ResumeAnalysis['scoreBreakdown'] & { matchedKeywords: string[]; missingKeywords: string[] } {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  
  // Content scoring (0-100)
  const contentScore = Math.min(100, Math.max(20, words.length / 5)); // Based on word count
  
  // Structure scoring (based on common resume sections)
  const hasContact = /email|phone|@/.test(lowerText);
  const hasExperience = /experience|work|employment|job/.test(lowerText);
  const hasEducation = /education|degree|university|college/.test(lowerText);
  const hasSkills = /skills|technical|proficiencies/.test(lowerText);
  
  const structureScore = [hasContact, hasExperience, hasEducation, hasSkills]
    .filter(Boolean).length * 25;
  
  // Keywords scoring
  const allKeywords = [...JOB_KEYWORDS.technical, ...JOB_KEYWORDS.soft, ...JOB_KEYWORDS.experience];
  const matchedKeywords = allKeywords.filter(keyword => lowerText.includes(keyword));
  const keywordScore = Math.min(100, (matchedKeywords.length / allKeywords.length) * 200);
  
  // Experience scoring
  const experiencePattern = /(\d+)\+?\s*(years?|yrs?)/gi;
  const experienceMatches = text.match(experiencePattern);
  const experienceScore = experienceMatches ? Math.min(100, experienceMatches.length * 30) : 20;
  
  // Education scoring
  const educationKeywords = JOB_KEYWORDS.education.filter(keyword => lowerText.includes(keyword));
  const educationScore = Math.min(100, educationKeywords.length * 20);
  
  // Missing important keywords
  const importantKeywords = [...JOB_KEYWORDS.technical.slice(0, 5), ...JOB_KEYWORDS.soft.slice(0, 3)];
  const missingKeywords = importantKeywords.filter(keyword => !lowerText.includes(keyword));

  return {
    content: Math.round(contentScore),
    structure: structureScore,
    keywords: Math.round(keywordScore),
    experience: experienceScore,
    education: educationScore,
    matchedKeywords,
    missingKeywords
  };
}

/**
 * Extract name from resume text using enhanced patterns and AI techniques
 */
function extractName(text: string): string {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Common resume headers to skip
  const skipPatterns = [
    /^(resume|curriculum vitae|cv|profile|summary|objective|contact|bio|biography)$/i,
    /@|phone|email|tel:|mobile:|address|linkedin|github/i,
    /street|road|avenue|city|state|zip|country|postal/i,
    /\d{3,}|\+\d|\(\d/,  // Numbers/phone patterns
    /^(skills|experience|education|work|employment|projects|achievements)$/i
  ];
  
  // Enhanced name patterns
  const namePatterns = [
    // Standard first/last name patterns
    /^([A-Z][a-z]+(?:\s+[A-Z][a-z]*){1,3})$/,
    // Names with middle initials 
    /^([A-Z][a-z]+(?:\s+[A-Z]\.?\s*)?[A-Z][a-z]+)$/,
    // Names with Jr/Sr/III etc
    /^([A-Z][a-z]+(?:\s+[A-Z][a-z]*)*(?:\s+(?:Jr|Sr|III|IV|V))?)$/i,
    // Names with professional titles (but extract just the name)
    /^(?:Mr|Ms|Mrs|Dr|Prof)\.?\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]*)+)/i,
    // Handle comma-separated last, first format
    /^([A-Z][a-z]+),\s+([A-Z][a-z]+(?:\s+[A-Z]\.?)?)$/
  ];
  
  // Look through first 15 lines for name
  for (let i = 0; i < Math.min(15, lines.length); i++) {
    const line = lines[i];
    
    // Skip if line matches skip patterns
    if (skipPatterns.some(pattern => pattern.test(line))) {
      continue;
    }
    
    // Skip very long lines (likely descriptions)
    if (line.length > 60) continue;
    
    // Skip lines with too many words (likely not just a name)
    if (line.split(/\s+/).length > 5) continue;
    
    // Test against name patterns
    for (const pattern of namePatterns) {
      const match = line.match(pattern);
      if (match) {
        // Handle comma format (Last, First)
        if (match[2]) {
          return `${match[2]} ${match[1]}`.trim();
        }
        // Regular format
        return match[1].trim();
      }
    }
    
    // Fallback: simple capitalized words check
    const words = line.split(/\s+/);
    if (words.length >= 2 && words.length <= 4) {
      const allCapitalized = words.every(word => 
        /^[A-Z][a-z]+$/.test(word) || /^[A-Z]\.$/.test(word)
      );
      if (allCapitalized && line.length < 40) {
        return line;
      }
    }
  }
  
  // Last resort: look for any capitalized name-like pattern
  const nameMatch = text.match(/\b([A-Z][a-z]+\s+[A-Z][a-z]+)\b/);
  if (nameMatch) {
    return nameMatch[1];
  }
  
  return "Name not clearly identifiable";
}

/**
 * Extract location from resume text with enhanced intelligence
 */
function extractLocation(text: string): string {
  // Enhanced location patterns for different formats
  const locationPatterns = [
    // Explicit location labels
    /(?:address|location|based in|located in|residing in|lives in)[:\s]+([^\n,]+(?:,\s*[^\n]+)?)/i,
    // City, State ZIP format (US)
    /\b([A-Z][a-z]+,\s*[A-Z]{2}(?:\s+\d{5}(?:-\d{4})?)?)\b/,
    // City, State format
    /\b([A-Z][a-z]+,\s*[A-Z][a-z]+(?:\s+[A-Z]{2,3})?)\b/,
    // City, Country format
    /\b([A-Z][a-z]+,\s*[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/,
    // Full address pattern
    /(\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd)[^\n]*)/i,
    // International formats
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*\d{5,6}(?:\s+[A-Z][a-z]+)*)\b/,
    // State/Province abbreviations with ZIP
    /\b([A-Z]{2}\s+\d{5}(?:-\d{4})?)\b/,
    // Common international cities
    /\b(London|Paris|Berlin|Madrid|Rome|Amsterdam|Stockholm|Dublin|Prague|Vienna|Zurich|Geneva|Toronto|Vancouver|Montreal|Sydney|Melbourne|Tokyo|Seoul|Singapore|Hong Kong)\b/i
  ];
  
  // Countries and major regions to validate locations
  const knownLocations = [
    'usa', 'united states', 'canada', 'uk', 'united kingdom', 'germany', 'france', 'spain', 'italy',
    'netherlands', 'sweden', 'norway', 'denmark', 'ireland', 'australia', 'new zealand', 'japan',
    'singapore', 'california', 'texas', 'new york', 'florida', 'ontario', 'quebec', 'england', 'scotland'
  ];
  
  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match) {
      let location = match[1].trim();
      
      // Clean up common artifacts
      location = location.replace(/[,\s]*$/, ''); // Remove trailing commas/spaces
      location = location.replace(/^[,\s]*/, ''); // Remove leading commas/spaces
      
      // Validate if it's a reasonable location (not too long, contains location-like words)
      if (location.length > 3 && location.length < 100) {
        const locationLower = location.toLowerCase();
        
        // Check if it contains known location indicators
        const hasLocationIndicator = knownLocations.some(loc => locationLower.includes(loc)) ||
                                   /\b(city|state|country|province|county|region)\b/i.test(location) ||
                                   /\d{5}/.test(location) || // ZIP code
                                   /\b[A-Z]{2}\b/.test(location); // State abbreviation
        
        if (hasLocationIndicator || /^[A-Z][a-z]+,\s*[A-Z]/.test(location)) {
          return location;
        }
      }
    }
  }
  
  // Fallback: look for contact section and extract location from there
  const contactSection = text.match(/(?:contact|address|location)[:\n](.{0,200})/i);
  if (contactSection) {
    const contactText = contactSection[1];
    for (const pattern of locationPatterns.slice(1, 4)) { // Use simpler patterns for contact section
      const match = contactText.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
  }
  
  return "Location not specified";
}

/**
 * Extract skills with better intelligence
 */
function extractSkills(text: string): string[] {
  const skills: Set<string> = new Set();
  const lowerText = text.toLowerCase();
  
  // Define comprehensive skill lists
  const technicalSkills = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust',
    'react', 'angular', 'vue', 'svelte', 'next.js', 'nuxt.js', 'gatsby',
    'node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'rails',
    'html', 'css', 'sass', 'scss', 'less', 'tailwind', 'bootstrap',
    'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'gitlab',
    'git', 'github', 'bitbucket', 'jira', 'confluence',
    'firebase', 'graphql', 'rest api', 'microservices', 'devops',
    'machine learning', 'ai', 'data science', 'tensorflow', 'pytorch',
    'figma', 'sketch', 'adobe', 'photoshop', 'illustrator'
  ];
  
  const softSkills = [
    'leadership', 'communication', 'teamwork', 'problem solving', 'analytical thinking',
    'project management', 'time management', 'adaptability', 'creativity', 'critical thinking',
    'collaboration', 'negotiation', 'presentation', 'mentoring', 'coaching'
  ];
  
  const allSkills = [...technicalSkills, ...softSkills];
  
  // Check for explicit skills sections first
  const skillsSectionPattern = /(?:skills|technical skills|core competencies|technologies)[:\n](.+?)(?:\n\n|\n[A-Z][A-Z]|$)/is;
  const skillsMatch = text.match(skillsSectionPattern);
  
  if (skillsMatch) {
    const skillsText = skillsMatch[1];
    const extractedSkills = skillsText.split(/[,\n•\-\|]/)
      .map(s => s.trim())
      .filter(s => s.length > 2 && s.length < 30)
      .slice(0, 15);
    
    extractedSkills.forEach(skill => skills.add(skill));
  }
  
  // Find skills mentioned throughout the document
  allSkills.forEach(skill => {
    if (lowerText.includes(skill.toLowerCase())) {
      skills.add(skill);
    }
  });
  
  return Array.from(skills).slice(0, 12);
}

/**
 * Extract work experience with better parsing
 */
function extractExperience(text: string): Array<{title: string; company: string; duration: string; description: string}> {
  const experience = [];
  
  // Look for experience section
  const expSectionPattern = /(?:experience|work experience|employment|professional experience)[:\n](.+?)(?:\n(?:education|skills|projects)|$)/is;
  const expMatch = text.match(expSectionPattern);
  
  if (expMatch) {
    const expText = expMatch[1];
    
    // Split by common job entry patterns
    const jobEntries = expText.split(/\n(?=[A-Z][A-Za-z\s]+(?:at|@|\n)[A-Z])/);
    
    for (const entry of jobEntries.slice(0, 5)) { // Limit to 5 jobs
      const lines = entry.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      
      if (lines.length < 2) continue;
      
      // Try to extract job title, company, and duration
      let title = lines[0];
      let company = '';
      let duration = '';
      let description = '';
      
      // Look for company in second line or with "at" keyword
      const companyPattern = /(?:at\s+|@\s+)?([A-Z][A-Za-z\s&\.]+(?:Inc|LLC|Corp|Ltd|Company|Co|Technologies|Tech|Solutions|Systems|Group)?)/;
      const companyMatch = lines.slice(0, 3).join(' ').match(companyPattern);
      if (companyMatch) {
        company = companyMatch[1].trim();
      }
      
      // Look for duration patterns
      const durationPattern = /(\d{4}\s*[-–]\s*(?:\d{4}|present|current)|\w+\s+\d{4}\s*[-–]\s*(?:\w+\s+\d{4}|present|current))/i;
      const durationMatch = entry.match(durationPattern);
      if (durationMatch) {
        duration = durationMatch[1];
      }
      
      // Get description from remaining text
      description = lines.slice(2).join(' ').substring(0, 200);
      
      if (title.length > 2) {
        experience.push({
          title: title.length > 50 ? title.substring(0, 50) + '...' : title,
          company: company || 'Company name not specified',
          duration: duration || 'Duration not specified',
          description: description || 'Description not available'
        });
      }
    }
  }
  
  return experience;
}

/**
 * Extract education with better parsing
 */
function extractEducation(text: string): Array<{degree: string; institution: string; year: string}> {
  const education = [];
  
  // Look for education section
  const eduSectionPattern = /(?:education|academic background|qualifications)[:\n](.+?)(?:\n(?:experience|skills|projects)|$)/is;
  const eduMatch = text.match(eduSectionPattern);
  
  if (eduMatch) {
    const eduText = eduMatch[1];
    
    // Look for degree patterns
    const degreePatterns = [
      /(bachelor|master|phd|doctorate|diploma|certificate)[^,\n]*/gi,
      /(b\.?s\.?|m\.?s\.?|b\.?a\.?|m\.?a\.?|ph\.?d\.?)[^,\n]*/gi
    ];
    
    // Look for institution patterns
    const institutionPattern = /(?:at\s+|from\s+)?([A-Z][A-Za-z\s&]+(?:university|college|institute|school|academy))/gi;
      // Look for years
    const yearPattern = /\b(19|20)\d{2}\b/g;
    
    const degrees: string[] = [];
    degreePatterns.forEach(pattern => {
      const matches = eduText.match(pattern);
      if (matches) degrees.push(...matches);
    });
    
    const institutions = eduText.match(institutionPattern) || [];
    const years = eduText.match(yearPattern) || [];
    
    // Combine the information
    const maxEntries = Math.max(degrees.length, institutions.length, 1);
    for (let i = 0; i < Math.min(maxEntries, 3); i++) {
      education.push({
        degree: degrees[i] || 'Degree not specified',
        institution: institutions[i] || 'Institution not specified', 
        year: years[i] || 'Year not specified'
      });
    }
  }
  
  return education;
}

/**
 * Extract certifications
 */
function extractCertifications(text: string): string[] {
  const certifications = [];
  const lowerText = text.toLowerCase();
  
  // Look for certification sections
  const certSectionPattern = /(?:certifications?|certificates?|licenses?)[:\n](.+?)(?:\n\n|\n[A-Z][A-Z]|$)/is;
  const certMatch = text.match(certSectionPattern);
  
  if (certMatch) {
    const certText = certMatch[1];
    const certs = certText.split(/[,\n•\-]/)
      .map(c => c.trim())
      .filter(c => c.length > 5 && c.length < 100)
      .slice(0, 8);
    
    certifications.push(...certs);
  }
  
  // Look for common certifications mentioned anywhere
  const commonCerts = [
    'aws certified', 'microsoft certified', 'google cloud certified', 'cissp', 'pmp',
    'scrum master', 'agile certified', 'itil', 'comptia', 'cisco certified'
  ];
  
  commonCerts.forEach(cert => {
    if (lowerText.includes(cert)) {
      certifications.push(cert);
    }
  });
  
  return [...new Set(certifications)].slice(0, 6);
}

/**
 * Extract languages
 */
function extractLanguages(text: string): string[] {
  const languages = [];
  const lowerText = text.toLowerCase();
  
  // Look for language sections
  const langSectionPattern = /(?:languages?|linguistic)[:\n](.+?)(?:\n\n|\n[A-Z][A-Z]|$)/is;
  const langMatch = text.match(langSectionPattern);
  
  if (langMatch) {
    const langText = langMatch[1];
    const langs = langText.split(/[,\n•\-]/)
      .map(l => l.trim())
      .filter(l => l.length > 2 && l.length < 30)
      .slice(0, 6);
    
    languages.push(...langs);
  }
  
  // Common languages to detect
  const commonLanguages = [
    'english', 'spanish', 'french', 'german', 'italian', 'portuguese', 'chinese',
    'japanese', 'korean', 'arabic', 'russian', 'hindi', 'dutch', 'swedish'
  ];
  
  commonLanguages.forEach(lang => {
    if (lowerText.includes(lang)) {
      languages.push(lang.charAt(0).toUpperCase() + lang.slice(1));
    }
  });
  
  return [...new Set(languages)].slice(0, 5);
}

/**
 * Parse structured data from resume text
 */
function parseResumeData(text: string): ResumeParsing {
  console.log('Starting intelligent resume parsing...');
  
  // Extract personal info with better intelligence
  const emailMatch = text.match(/[\w\.-]+@[\w\.-]+\.\w+/);
  const phoneMatch = text.match(/[\+]?[\d\s\-\(\)]{10,}/);
  const name = extractName(text);
  const location = extractLocation(text);
  
  // Extract all sections with improved intelligence
  const skills = extractSkills(text);
  const experience = extractExperience(text);
  const education = extractEducation(text);
  const certifications = extractCertifications(text);
  const languages = extractLanguages(text);

  console.log(`Extracted: ${skills.length} skills, ${experience.length} jobs, ${education.length} education entries`);

  return {
    personalInfo: {
      name,
      email: emailMatch?.[0] || 'Email not found',
      phone: phoneMatch?.[0] || 'Phone not found',
      location
    },
    skills,
    experience,
    education,
    certifications,
    languages
  };
}

/**
 * Analyze a document (resume/CV) and provide scoring
 * @param documentPath Path to the uploaded document
 * @returns Analysis results with scoring
 */
export async function analyzeDocument(documentPath: string): Promise<ResumeAnalysis> {
  console.log(`Analyzing document: ${documentPath}`);
  
  try {
    const text = await parseDocumentText(documentPath);
    
    // Try AI analysis first, fallback to rule-based analysis
    let aiAnalysis: Partial<ResumeAnalysis> = {};
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
      console.log('Using AI-powered analysis...');
      aiAnalysis = await analyzeResumeWithAI(text);
    } else {
      console.log('Using rule-based analysis (AI not configured)...');
    }
    
    // Fallback to rule-based analysis for missing data
    const scoreData = calculateResumeScore(text);
    
    // Merge AI and rule-based results
    const overallScore = aiAnalysis.overallScore || Math.round(
      (scoreData.content * 0.2 + 
       scoreData.structure * 0.25 + 
       scoreData.keywords * 0.25 + 
       scoreData.experience * 0.2 + 
       scoreData.education * 0.1)
    );

    const scoreBreakdown = aiAnalysis.scoreBreakdown || {
      content: scoreData.content,
      structure: scoreData.structure,
      keywords: scoreData.keywords,
      experience: scoreData.experience,
      education: scoreData.education
    };

    // Generate improvements if not provided by AI
    let improvements = aiAnalysis.improvements || [];
    if (improvements.length === 0) {
      if (scoreBreakdown.structure < 75) improvements.push("Improve resume structure with clear sections");
      if (scoreBreakdown.keywords < 60) improvements.push("Add more relevant industry keywords");
      if (scoreBreakdown.content < 50) improvements.push("Expand content with more detailed descriptions");
      if (scoreBreakdown.experience < 50) improvements.push("Highlight your work experience more prominently");
      if (scoreBreakdown.education < 50) improvements.push("Add more educational background details");
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      overallScore,
      scoreBreakdown,
      skills: aiAnalysis.skills || scoreData.matchedKeywords.slice(0, 8),
      experience: aiAnalysis.experience || "Extracted from resume analysis",
      educationLevel: aiAnalysis.educationLevel || "Determined from content analysis", 
      recommendedJobs: aiAnalysis.recommendedJobs || ["Software Developer", "Frontend Engineer", "Full Stack Developer"],
      improvements,
      matchedKeywords: aiAnalysis.matchedKeywords || scoreData.matchedKeywords,
      missingKeywords: aiAnalysis.missingKeywords || scoreData.missingKeywords.slice(0, 5)
    };
  } catch (error) {
    console.error('Error analyzing document:', error);
    throw new Error('Failed to analyze document');
  }
}

/**
 * Parse resume and extract structured data
 * @param documentPath Path to the uploaded document
 * @returns Parsed resume data
 */
export async function parseResume(documentPath: string): Promise<ResumeParsing> {
  console.log(`Parsing document: ${documentPath}`);
  
  try {
    const text = await parseDocumentText(documentPath);
    
    // Try AI parsing first, fallback to rule-based parsing
    let aiParsedData: Partial<ResumeParsing> = {};
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
      console.log('Using AI-powered parsing...');
      aiParsedData = await parseResumeWithAI(text);
    } else {
      console.log('Using rule-based parsing (AI not configured)...');
    }
    
    // Fallback to rule-based parsing for missing data
    const fallbackData = parseResumeData(text);
    
    // Merge AI and rule-based results
    const result: ResumeParsing = {
      personalInfo: {
        name: aiParsedData.personalInfo?.name || fallbackData.personalInfo.name,
        email: aiParsedData.personalInfo?.email || fallbackData.personalInfo.email,
        phone: aiParsedData.personalInfo?.phone || fallbackData.personalInfo.phone,
        location: aiParsedData.personalInfo?.location || fallbackData.personalInfo.location
      },
      skills: aiParsedData.skills?.length ? aiParsedData.skills : fallbackData.skills,
      experience: aiParsedData.experience?.length ? aiParsedData.experience : fallbackData.experience,
      education: aiParsedData.education?.length ? aiParsedData.education : fallbackData.education,
      certifications: aiParsedData.certifications?.length ? aiParsedData.certifications : fallbackData.certifications,
      languages: aiParsedData.languages?.length ? aiParsedData.languages : fallbackData.languages
    };
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return result;
  } catch (error) {
    console.error('Error parsing document:', error);
    throw new Error('Failed to parse document');
  }
}
