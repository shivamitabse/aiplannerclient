# Reflection

## 1. The Hardest Bug

The hardest bug I encountered was the Open Graph (OG) tags not appearing correctly when sharing a unique report URL on X (formerly Twitter). Because I built a Single Page Application (SPA) with React, the social media crawlers were only seeing the base `index.html` file before the JavaScript could execute and inject the specific report data (savings amount, tool count).

To debug this, I first used the "X Post Inspector" and "Meta Tags" tools to confirm that the crawlers weren't executing JS. My hypothesis was that I needed server-side injection. I tried `react-helmet`, but it only works client-side. I then implemented a simple middleware in my Express backend that checks the User-Agent. If it's a crawler (e.g., `Twitterbot`), the server reads the audit data from PostgreSQL, replaces placeholders in the `index.html` string with actual OG meta tags, and sends the modified HTML. This worked perfectly, ensuring every shared report has a personalized preview.

## 2. Database Migration to PostgreSQL

During development, I initially used SQLite for the MVP to keep the project portable and zero-config for reviewers. However, as the project matured and moved toward production, I migrated to PostgreSQL hosted on Render for better scalability, concurrent write handling, and connection pooling.

PostgreSQL on Render provides enterprise-grade reliability while remaining cost-effective for a startup. The migration involved:

- Updating the database connection logic in `db.js` to use the `pg` driver instead of `sqlite3`
- Setting up environment variables for the Render PostgreSQL connection string
- Running migrations to create the production schema

This ensures the project can scale to handle 10,000+ audits per day without performance degradation, as outlined in the ARCHITECTURE.md scaling plan.

## 3. Week 2 Roadmap

If I had a second week, I would focus on three major areas:

1. **Benchmark Mode**: I'd aggregate the anonymized audit data to create "AI Spend Benchmarks" by industry and team size. Users could see if they are in the 90th percentile of spenders for their stage.
2. **Embeddable Widget**: I'd build a `<script>` tag that bloggers or VCs could drop onto their sites. It would show a "Mini Audit" form and redirect to my app for the full report, expanding the distribution footprint.
3. **Automated Credit Matching**: I would integrate more deeply with Credex's specific inventory. Instead of just saying "You can save $500," I would show exactly which Credex credit package (e.g., "Claude Enterprise Credits - 40% Off") matches their specific overspend.

## 4. Usage of AI Tools

I used **Cursor** as my primary IDE and **Claude 3.5 Sonnet** for specific coding tasks.

- **Where I used it**: Writing the initial boilerplate for the Express routes, generating the Tailwind "glassmorphism" CSS classes, and drafting the Mermaid diagrams.
- **What I didn't trust**: I did not trust the AI with the audit logic or pricing data. Pricing changes too fast for LLM training data, and the logic had to be 100% deterministic to be "finance-literate."
- **Caught a mistake**: At one point, I asked the AI to generate a list of Claude's pricing tiers. It hallucinated a "Claude Business" tier at $25/mo, which doesn't exist (it's actually Pro $20 and Team $30). I caught this during my manual verification phase for `PRICING_DATA.md` and corrected the audit engine rules immediately.

## 5. Self-Rating

- **Discipline (10/10)**: I maintained a consistent 4-8 hour daily workflow over the full 7 days, as documented in my git history and `DEVLOG.md`.
- **Code Quality (9/10)**: Used clean, modular JavaScript with clear separation between the audit engine logic and the Express routes. TypeScript would have made it a 10.
- **Design Sense (8/10)**: The UI is clean and modern with a focus on "Screenshotability," though there is always room for more subtle micro-animations.
- **Problem Solving (9/10)**: Successfully navigated the OG tag issue and API integration failures with robust fallbacks.
- **Entrepreneurial Thinking (10/10)**: I treated this as a lead-gen product, focusing heavily on the GTM strategy and the viral sharing loop rather than just the code.
