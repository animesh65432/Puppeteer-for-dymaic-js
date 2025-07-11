# Puppeteer PDF Generator

A web application that generates PDF documents from user input using Puppeteer and React.

## Features

- React frontend for user data input
- Express.js backend with PDF generation
- Puppeteer-powered PDF creation
- Deployment-ready configuration for Vercel

## Structure

- `/frontend` - React application for user interface
- `/backend` - Express.js API with PDF generation endpoint

## API Endpoints

### POST /generate-pdf
Generates a PDF document from user data.

**Request Body:**
```json
{
  "name": "John Doe",
  "mail": "john.doe@example.com", 
  "location": "New York, NY"
}
```

**Response:** PDF file download

## Deployment

The application is configured for deployment on Vercel with proper Puppeteer configuration for serverless environments.

### Key Features for Deployment:
- Automatic Chrome executable detection
- Serverless-friendly Puppeteer arguments
- Proper error handling and logging
- CORS enabled for frontend integration

## Local Development

1. Backend:
```bash
cd backend
npm install
# Set PUPPETEER_SKIP_DOWNLOAD=true if needed for local testing
node index.js
```

2. Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Recent Fixes

- Fixed PDF generation failures in deployment environments
- Improved Chrome executable path detection
- Enhanced error handling and logging
- Updated Vercel configuration for proper function timeouts