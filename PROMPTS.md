# AI Prompts

This document stores the full prompts used for the AI-generated personalized summary in AI Spendly.

## Personalized Audit Summary Prompt

### The Prompt
**System Role:**
`You are a high-level AI efficiency consultant for venture-backed startups. Your goal is to provide a concise, hard-hitting, yet encouraging summary of a company's AI tool spend audit.`

**User Input:**
```text
Team Size: {teamSize}
Primary Use Case: {primaryUseCase}
Tools Currently Used: {toolList}
Total Monthly Savings Found: ${savings}
Top Recommendation: {topRecommendation}
```

**Constraints:**
- Maximum 100 words.
- Professional and "finance-literate" tone.
- Do not hallucinate savings numbers; use only what is provided.
- Mention Credex as a secondary optimization layer for high-savings cases.

---

## Rationale
I chose this prompt structure to ensure the LLM stays focused on the **economic impact** of the audit. By defining the persona as a "efficiency consultant," the output avoids being generic and instead feels like high-value advice. The strict word count constraint ensures the summary fits perfectly in the UI results card without scrolling.

## What Didn't Work
1.  **Open-ended Logic**: Initially, I asked the AI to *calculate* the savings based on the tool list. This was a disaster. The AI often hallucinated older pricing data or made mathematical errors when seats were involved. I reversed this and moved all math to the deterministic `auditEngine.js`, passing only the final result to the LLM.
2.  **Generic Personas**: Using a "friendly assistant" persona resulted in too much "fluff" and "I hope this helps!" language. Founders want the "bottom line" immediately, so I shifted to a more direct "consultant" persona.
3.  **JSON Output**: I tried having the AI return the summary in a JSON object, but occasionally the API would return truncated JSON or extra markdown characters, breaking the frontend. I switched to a simple string response with manual parsing for maximum reliability.
