import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setError(null);
        setSuccess(null);
        setAnalysis(null);
      } else {
        setError('Please select a PDF or DOCX file only.');
        setFile(null);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFileSelect(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setAnalysis(response.data.analysis);
      setSuccess('Resume analyzed successfully!');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.response?.data?.error || 'An error occurred while analyzing the resume.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header">
          <h1>🤖 AI Resume Analyzer</h1>
          <p>Upload your resume and get professional AI-powered feedback</p>
        </div>

        <div className="upload-section">
          <div
            className={`upload-area ${isDragOver ? 'dragover' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="upload-icon">📄</div>
            <div className="upload-text">
              {isDragOver ? 'Drop your resume here' : 'Click to upload or drag and drop'}
            </div>
            <div className="upload-subtext">
              Supports PDF and DOCX files (max 5MB)
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="file-input"
              accept=".pdf,.docx"
              onChange={handleFileInputChange}
            />
          </div>

          {file && (
            <div className="file-info">
              <h3>Selected File:</h3>
              <p><strong>Name:</strong> {file.name}</p>
              <p><strong>Size:</strong> {formatFileSize(file.size)}</p>
              <p><strong>Type:</strong> {file.type}</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              <strong>Success:</strong> {success}
            </div>
          )}

          <button
            className="upload-button"
            onClick={handleUpload}
            disabled={!file || isLoading}
          >
            {isLoading ? 'Analyzing...' : 'Analyze Resume'}
          </button>
        </div>

        {isLoading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Analyzing your resume with AI...</p>
            <p>This may take a few moments.</p>
          </div>
        )}

        {analysis && (
          <div className="analysis-section">
            <div className="analysis-header">
              <div className="analysis-icon">💡</div>
              <h2 className="analysis-title">AI Analysis Results</h2>
            </div>
            <div className="analysis-content">
              {analysis}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 