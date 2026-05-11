# Development Log

## Day 1

**Hours worked:** 4
**What I did:** Project initialization. Defined the core audit logic and set up the React + Express boilerplate. Configured PostgreSQL on Render for the database.
**What I learned:** Startup founders are overwhelmed by AI tool choices; simplicity in the audit input is key.
**Blockers / what I'm stuck on:** None.
**Plan for tomorrow:** Build the spend input form with persistence.

## Day 2

**Hours worked:** 6
**What I did:** Completed the spend input form. Implemented `localStorage` persistence so users don't lose data on refresh. Started the audit engine logic.
**What I learned:** Handling multiple tools with different pricing tiers requires a clean data structure.
**Blockers / what I'm stuck on:** Mapping Cursor tiers vs. Copilot tiers correctly.
**Plan for tomorrow:** Finalize audit engine and build results page.

## Day 3

**Hours worked:** 5
**What I did:** Built the Audit Results page. Implemented the hero section showing total savings. Wrote the first 3 audit rules (downgrade, redundancy, API spend).
**What I learned:** Financial reasoning must be extremely clear; added "reasons" to every recommendation.
**Blockers / what I'm stuck on:** Making the results page look "Premium."
**Plan for tomorrow:** Integrate OpenAI for personalized summaries.

## Day 4

**Hours worked:** 4
**What I did:** Integrated OpenAI API. Wrote the prompt for summary generation. Added error handling for API failures with a fallback template.
**What I learned:** Prompt engineering for financial summaries requires strict constraints on word count and tone.
**Blockers / what I'm stuck on:** OpenAI API latency.
**Plan for tomorrow:** Implement lead capture and Resend email integration.

## Day 5

**Hours worked:** 7
**What I did:** Set up PostgreSQL database on Render for lead storage. Integrated Resend for transactional emails. Added rate limiting to the lead capture endpoint.
**What I learned:** Transactional emails are a great way to provide immediate value while confirming lead quality. PostgreSQL connection pooling ensures reliable database operations at scale.
**Blockers / what I'm stuck on:** Resend domain verification (switched to test mode for local).
**Plan for tomorrow:** Implement public shareable URLs.

## Day 6

**Hours worked:** 5
**What I did:** Created the public report view. Implemented unique hash IDs for reports. Added Open Graph tags for Twitter/X and LinkedIn previews.
**What I learned:** Social sharing is the biggest viral factor for a tool like this.
**Blockers / what I'm stuck on:** Meta tags not rendering for client-side routes (added server-side inject).
**Plan for tomorrow:** Final polish, tests, and documentation.

## Day 7

**Hours worked:** 8
**What I did:** Wrote automated tests for the audit engine. Finalized all documentation files (`ARCHITECTURE.md`, `GTM.md`, etc.). Polished the UI for Lighthouse scores. Deployed to production.
**What I learned:** The "Entrepreneurial" part of the assignment (GTM/Economics) is just as important as the code.
**Blockers / what I'm stuck on:** Achieving 90+ Lighthouse score on mobile (fixed with image optimization).
**Plan for tomorrow:** Submit!
