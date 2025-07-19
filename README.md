# 🤖 AI Resume Analyzer

A full-stack web application that analyzes resumes using Google's Gemini AI API. Upload your resume (PDF or DOCX) and receive professional feedback on strengths, areas for improvement, missing keywords, and career role matches.

## 🚀 Features

- **File Upload**: Support for PDF and DOCX files (up to 5MB)
- **AI Analysis**: Powered by Google Gemini API for professional resume review
- **Text Extraction**: Automatic text extraction from PDF and DOCX files
- **Responsive Design**: Modern, mobile-friendly UI
- **Drag & Drop**: Intuitive file upload interface
- **MongoDB Storage**: Persistent storage of uploads and analysis results

## 🛠️ Tech Stack

- **Frontend**: React.js with modern CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **File Processing**: 
  - PDF: `pdf-parse`
  - DOCX: `mammoth`
- **AI Engine**: Google Gemini API
- **File Upload**: Multer
- **Styling**: Custom CSS (no external UI libraries)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Google Gemini API key

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-resume-analyzer
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Setup**
   - Copy `env.example` to `.env`
   - Update the following variables:
     ```env
     MONGODB_URI=mongodb://localhost:27017/resume-analyzer
     GEMINI_API_KEY=your_gemini_api_key_here
     PORT=5000
     ```

5. **Get Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env` file

## 🚀 Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   npm run dev
   ```

2. **Start the React frontend** (in a new terminal)
   ```bash
   npm run client
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Production Mode

1. **Build the React app**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
ai-resume-analyzer/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # App-specific styles
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   └── package.json
├── uploads/               # Temporary file storage
├── server.js             # Express server
├── package.json          # Backend dependencies
├── .env                  # Environment variables
└── README.md
```

## 🔌 API Endpoints

- `POST /api/upload` - Upload and analyze resume
- `GET /api/resumes` - Get all analyzed resumes
- `GET /api/resumes/:id` - Get specific resume analysis

## 🎯 How It Works

1. **File Upload**: User uploads a PDF or DOCX resume file
2. **Text Extraction**: Server extracts text using appropriate parser
3. **AI Analysis**: Text is sent to Gemini API with professional review prompt
4. **Storage**: Results are saved to MongoDB
5. **Display**: Analysis results are shown to the user

## 🤖 AI Analysis Prompt

The application sends the following prompt to Gemini API:

```
Act like a professional resume reviewer. Analyze the following text as a resume and return:
- Summary of strengths
- Areas of improvement
- Missing keywords or skills
- Career roles that match

Resume:
{{resume text here}}
```

## 🔒 Security Features

- File type validation (PDF/DOCX only)
- File size limits (5MB)
- Environment variable protection
- CORS configuration
- Input sanitization

## 🎨 UI Features

- **Modern Design**: Gradient backgrounds and smooth animations
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Loading States**: Visual feedback during analysis
- **Error Handling**: Clear error messages
- **Success Feedback**: Confirmation messages
- **Drag & Drop**: Intuitive file upload

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check your connection string in `.env`

2. **Gemini API Error**
   - Verify your API key is correct
   - Check API quota limits

3. **File Upload Issues**
   - Ensure file is PDF or DOCX
   - Check file size (max 5MB)
   - Verify file is not corrupted

4. **Port Conflicts**
   - Change PORT in `.env` if 5000 is in use
   - Ensure no other services are using the ports

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Happy Resume Analyzing! 🚀** 