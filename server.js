const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Resume Schema
const resumeSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  extractedText: String,
  aiAnalysis: String,
  uploadDate: { type: Date, default: Date.now }
});

const Resume = mongoose.model('Resume', resumeSchema);

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Function to extract text from PDF
async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    throw new Error('Error extracting text from PDF: ' + error.message);
  }
}

// Function to extract text from DOCX
async function extractTextFromDOCX(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    throw new Error('Error extracting text from DOCX: ' + error.message);
  }
}

// Function to analyze resume with Gemini API
async function analyzeResumeWithGemini(resumeText) {
  try {
    const prompt = `Act like a professional resume reviewer. Analyze the following text as a resume and return:
- Summary of strengths
- Areas of improvement
- Missing keywords or skills
- Career roles that match

Resume:
${resumeText}`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    throw new Error('Error analyzing resume with AI: ' + error.message);
  }
}

// Routes
app.post('/api/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    let extractedText = '';

    // Extract text based on file type
    if (req.file.mimetype === 'application/pdf') {
      extractedText = await extractTextFromPDF(filePath);
    } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      extractedText = await extractTextFromDOCX(filePath);
    }

    if (!extractedText.trim()) {
      return res.status(400).json({ error: 'Could not extract text from the uploaded file' });
    }

    // Analyze with Gemini API
    const aiAnalysis = await analyzeResumeWithGemini(extractedText);

    // Save to MongoDB
    const resume = new Resume({
      filename: req.file.filename,
      originalName: req.file.originalname,
      extractedText: extractedText,
      aiAnalysis: aiAnalysis
    });

    await resume.save();

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      analysis: aiAnalysis,
      extractedText: extractedText
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/resumes', async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ uploadDate: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/resumes/:id', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
} else {
  // Development route
  app.get('/', (req, res) => {
    res.json({ message: 'AI Resume Analyzer API is running' });
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 