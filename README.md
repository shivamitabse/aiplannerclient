# AI Spendly

AI Spendly is a free, end-to-end audit tool designed for startup founders and engineering managers to visualize, analyze, and optimize their AI infrastructure spend. By surfacing hidden overspend and recommending better-fit plans, it helps startups save thousands annually while acting as a high-value lead-gen asset for Credex.

## Features

- **Instant Audit**: Input your tool stack (Cursor, Claude, ChatGPT, etc.) and get immediate savings insights.
- **Rule-Based Engine**: Defensible logic that identifies redundant tools and sub-optimal plan tiers.
- **AI Summary**: Personalized, LLM-generated breakdown of your spending profile.
- **Lead Capture**: Seamless email-gated reports and Credex consultation booking for high-savings cases.
- **Shareable Reports**: Unique public URLs with Open Graph previews for easy sharing.

## Deployed URL

www.testmysite.in

## Screenshots

[Screenshot 1: Landing Page]
[Screenshot 2: Audit Results]
[Screenshot 3: Shareable Report]

## Quick Start

### 1. Install Dependencies

- **Server**: `cd server && npm install`
- **Client**: `cd client && npm install`

### 2. Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=3000
DATABASE_URL=postgresql://user:password@your-render-postgres-url:5432/aispend
OPENAI_API_KEY=your_key
RESEND_API_KEY=your_key
```

**Note**: Set `DATABASE_URL` to your Render PostgreSQL connection string. You can find this in your Render dashboard under your PostgreSQL instance settings.

### 3. Run Locally

- **Backend**: `cd server && npm run dev`
- **Frontend**: `cd client && npm run dev`

## Decisions & Trade-offs

1. **PostgreSQL on Render**: Transitioned from SQLite (used for initial MVP development) to PostgreSQL on Render for production. This provides scalability, concurrent write handling, and reliable backup/recovery while remaining cost-effective for a startup.
2. **Rule-Based Audit vs. AI Audit**: I deliberately used hardcoded rules for the audit math rather than an LLM. Financial advice must be deterministic and defensible. I used AI only for the qualitative summary where nuance matters.
3. **Tailwind CSS**: Used Tailwind for rapid UI development and "glassmorphism" aesthetics. It allowed for a premium, Product-Hunt-ready look without writing custom CSS from scratch.
4. **React Router for Public URLs**: Implemented a dynamic routing system where audit results are stored by ID, allowing for shareable public URLs while keeping sensitive data private in the DB.
5. **Node/Express Backend**: Chose a traditional Express server to easily integrate with the Resend and OpenAI SDKs, providing a robust middle-layer for API failure handling and rate limiting.
