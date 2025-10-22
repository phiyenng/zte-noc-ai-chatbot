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

# AI Models (Default: CS Minh)
INTERNAL_AI_SERVER_IP="10.196.5.134"
INTERNAL_AI_PORT="28001"
INTERNAL_AI_ASSET_ID="68"
INTERNAL_AI_USERNAME="aiteam1"
INTERNAL_AI_PASSWORD="AInow123@"

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

## Tech Stack

- **Next.js 15** - React framework
- **AI SDK** - AI model integration
- **PostgreSQL** - Database
- **Auth.js** - Authentication
- **Tailwind CSS** - Styling