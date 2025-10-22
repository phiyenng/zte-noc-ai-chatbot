# ZTE NOC AI Chatbot

## Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm

### Installation & Run

```bash
# Install pnpm globally (if not installed)
npm install -g pnpm

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Environment Setup

Create a `.env.local` file with required environment variables:

```env
# Database
DATABASE_URL="your_database_url"
# Auth
AUTH_SECRET="your_auth_secret"

# File Upload (Optional - for production)
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"
```

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run linter
pnpm format       # Format code
```

## Features

- **AI Chat** - Multiple AI models (CS Minh, NPO Yen, CS AI)
- **File Analysis** - Upload and analyze images, PDFs, text files
- **OCR Support** - Extract text from images using Tesseract.js
- **PDF Processing** - Extract text from PDF documents
- **Authentication** - Secure user login system

## Tech Stack

- **Next.js 15** - React framework
- **AI SDK** - AI model integration
- **PostgreSQL** - Database
- **Auth.js** - Authentication
- **Tailwind CSS** - Styling
- **Tesseract.js** - OCR for image text extraction
- **PDF.js** - PDF text extraction
