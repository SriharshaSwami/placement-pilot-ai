# PlacementPilot AI

## Project Overview

PlacementPilot AI is an advanced placement assistance platform that leverages AI to help users create compelling resumes, track job applications, prepare for interviews, and optimize their job search strategy. It uses an AI-first approach for tailored guidance and intelligent insights.

## Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- React Router
- TanStack Query
- Axios
- React Hook Form
- Zod

**Backend:**
- Node.js / Express
- MongoDB (Mongoose)
- Cloudinary SDK
- Google Gemini AI SDK

## Folder Structure

```text
placementpilot-ai/
├── client/         # React (Vite) frontend application
├── server/         # Express backend application
├── docs/           # Engineering documentation
└── .github/        # GitHub Actions workflows
```

## Local Setup

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)
- NPM or Yarn

### Installation

1. Clone the repository
2. Install dependencies from the root directory:
   ```bash
   npm install
   ```
3. Install dependencies for the client and server:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

### Running Locally

To run both the client and server concurrently, run the following command from the root directory:

```bash
npm run dev
```

Alternatively, you can run them separately:

**Client:**
```bash
cd client
npm run dev
```

**Server:**
```bash
cd server
npm run dev
```

## Environment Variables

Copy the `.env.example` file in the `server` directory to `.env` and configure the necessary values.

```bash
cp server/.env.example server/.env
```

**Example Environment Variables:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/placementpilot
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_api_key
```

## Development Workflow

- Follow the architectural guidelines outlined in the `docs` directory.
- Features should be isolated into their respective folders (`client/src/features` and `server/src/ai`, `server/src/controllers`, etc.).
- Ensure code quality by running `npm run lint` before committing.
- Adhere to the established Engineering Standards for consistency and scalability.
