import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateAISummary(teamSize, tools, auditResults, primaryUseCase) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const recommendationsText = auditResults.recommendations
      .map(
        (rec, idx) =>
          `${idx + 1}. ${rec.tool}: ${rec.message} (Potential savings: $${rec.savings || rec.potentialSavings}/month)`,
      )
      .join("\n");

    const currentSpend = tools.reduce((sum, t) => sum + Number(t.monthlySpend), 0);

    const prompt = `You are an AI spend optimization consultant. Analyze this team's AI stack and provide a personalized summary.

Team Information:
- Team Size: ${teamSize} people
- Primary Use Case: ${primaryUseCase || "Mixed"}
- Current Monthly Spend: $${currentSpend}
- Current Annual Spend: $${currentSpend * 12}

Current Tools (${tools.length} total):
${tools.map((t) => `- ${t.name} (${t.plan}): $${t.monthlySpend}/month (${t.seats} seat${t.seats > 1 ? "s" : ""})`).join("\n")}

Audit Findings:
${recommendationsText || "No optimization opportunities identified - stack is well-optimized"}

Potential Savings:
- Monthly: $${auditResults.totalMonthlySavings}
- Annual: $${auditResults.totalAnnualSavings}

Based on this audit data, write a personalized, encouraging summary (80-120 words) that:
1. Acknowledges their current setup
2. Highlights the key opportunities for optimization
3. Motivates them to take action
4. References specific recommendations

Make it conversational and actionable. Return only the summary text, no extra formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to generate AI summary: " + error.message);
  }
}
