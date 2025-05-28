import express from 'express';
import multer from 'multer';
import { analyzeDocument, parseResume, ResumeParsing } from '../services/documentService';

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/documents/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Resume analysis endpoint - provides scoring and recommendations
router.post('/analyze', upload.single('document'), async (req, res) => {
  try {
    console.log('Analyze endpoint hit:', req.file ? req.file.originalname : 'No file');
    
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ error: 'Document file is required' });
    }
    
    console.log('Analyzing file:', req.file.path);
    const analysis = await analyzeDocument(req.file.path);
    console.log('Analysis completed successfully');
    return res.json({ analysis });
  } catch (error) {
    console.error('Error analyzing document:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: 'Failed to analyze document', details: errorMessage });
  }
});

// Resume parsing endpoint - extracts structured data
router.post('/parse', upload.single('document'), async (req, res) => {
  try {
    console.log('Parse endpoint hit:', req.file ? req.file.originalname : 'No file');
    
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ error: 'Document file is required' });
    }
    
    console.log('Parsing file:', req.file.path);
    const parsedData = await parseResume(req.file.path);
    console.log('Parsing completed successfully');
      // Format the response to match frontend expectations
    const formattedResponse = {
      success: true,
      message: `📋 **Resume Parsing Results**`,
      data: {
        personalInfo: {
          name: parsedData.personalInfo.name,
          email: parsedData.personalInfo.email,
          phone: parsedData.personalInfo.phone,
          location: parsedData.personalInfo.location
        },
        skills: parsedData.skills,
        experience: parsedData.experience.map(exp => ({
          title: exp.title || exp.position || 'Position not specified',
          company: exp.company || 'Company not specified',
          duration: exp.duration || 'Duration not specified'
        })),
        education: parsedData.education.map(edu => ({
          degree: edu.degree || 'Degree not specified',
          institution: edu.institution || edu.school || 'Institution not specified',
          year: edu.year || 'Year not specified'
        })),
        certifications: parsedData.certifications,
        languages: parsedData.languages
      },
      formattedOutput: formatResumeParsingOutput(parsedData)
    };
    
    return res.json(formattedResponse);
  } catch (error) {
    console.error('Error parsing document:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ 
      success: false,
      error: 'Failed to parse document', 
      details: errorMessage 
    });
  }
});

/**
 * Format resume parsing output for display
 */
function formatResumeParsingOutput(data: ResumeParsing): string {
  let output = "📋 **Enhanced Resume Parsing Results**\n\n";
  
  output += "👤 **Personal Information:**\n";
  output += `• **Name:** ${data.personalInfo.name || 'Not specified'}\n`;
  output += `• **Email:** ${data.personalInfo.email || 'Not found'}\n`;
  output += `• **Phone:** ${data.personalInfo.phone || 'Not found'}\n`;
  output += `• **Location:** ${data.personalInfo.location || 'Not specified'}\n\n`;
  if (data.skills.length > 0) {
    output += "🛠️ **Technical & Soft Skills:**\n";
    data.skills.forEach((skill, index) => {
      output += `${index < 9 ? ` ${index + 1}` : `${index + 1}`}. ${skill}\n`;
    });
    output += "\n";
  }
  if (data.experience.length > 0) {
    output += "💼 **Professional Experience:**\n";
    data.experience.forEach((exp, index) => {
      output += `**${index + 1}. ${exp.title}**\n`;
      output += `   🏢 Company: ${exp.company}\n`;
      output += `   ⏰ Duration: ${exp.duration}\n`;
      if (exp.description && exp.description !== 'Description not available') {
        output += `   📝 ${exp.description.substring(0, 120)}...\n`;
      }
      output += "\n";
    });
  }
    if (data.education.length > 0) {
    output += "🎓 **Education Background:**\n";
    data.education.forEach((edu, index) => {
      output += `**${index + 1}. ${edu.degree}**\n`;
      output += `   🏫 Institution: ${edu.institution}\n`;
      output += `   📅 Year: ${edu.year}\n\n`;
    });
  }
  
  if (data.certifications.length > 0) {
    output += "📜 **Certifications & Awards:**\n";
    data.certifications.forEach((cert, index) => {
      output += `${index < 9 ? ` ${index + 1}` : `${index + 1}`}. ${cert}\n`;
    });
    output += "\n";
  }
    if (data.languages.length > 0) {
    output += "🌐 **Languages:**\n";
    data.languages.forEach((lang, index) => {
      output += `${index < 9 ? ` ${index + 1}` : `${index + 1}`}. ${lang}\n`;
    });
    output += "\n";
  }
  
  if (data.skills.length === 0 && data.experience.length === 0 && data.education.length === 0) {
    output += "⚠️ **Parsing Notice:**\n";
    output += "Limited information could be extracted from this resume. This might be due to:\n";
    output += "• Unusual formatting or layout\n";
    output += "• Image-based PDF without text layer\n";
    output += "• Complex document structure\n\n";
    output += "💡 **Tip:** For optimal results, use a text-based resume with standard formatting.\n";
  } else {
    output += "✅ **Enhanced Parsing Summary:**\n";
    output += `Successfully extracted **${data.skills.length} skills**, **${data.experience.length} work experiences**, `;
    output += `**${data.education.length} education entries**, **${data.certifications.length} certifications**, `;
    output += `and **${data.languages.length} languages** from your resume.\n\n`;
    output += "🚀 **Next Steps:** Use this parsed data to optimize your job applications and identify skill gaps!";
  }
  
  return output;
}

export default router;
