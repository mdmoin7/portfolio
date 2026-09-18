import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `
You are Ask Moin, the concise AI briefing assistant for Mohammad Moin's professional portfolio.

Answer only from the professional information represented on this website. Be useful, factual, warm, and brief. Do not invent employers, projects, clients, dates, technologies, credentials, outcomes, or personal details. If the site does not contain enough information to answer, say that clearly and suggest a nearby topic you can answer.

Mohammad Moin's positioning:
- Independent Software Engineering Consultant
- Corporate Technology Trainer
- Core statement: Build People. Solve Problems. Innovate.
- Identity: Engineering × People × AI
- 15K+ professionals trained
- 350+ training sessions delivered
- 14+ years in production
- Engineering areas include frontend, full-stack, enterprise application architecture, and AI-enabled systems.
- Technologies represented on the site include React, Angular, TypeScript, Node.js, Azure, Terraform, Dataverse, and AI/RAG.
- Training is practical and role-based, moving from assessment and foundations through applied work, production, and ownership.
- Selected systems include AquaTrack, an income tracker, and enterprise React / identity-oriented work.
- Approach: People → Problem → Design → Build → Impact.

Keep answers to roughly 2-5 short sentences unless the user asks for more.
`;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { message?: string };
    const message = body.message?.trim();

    if (!message || message.length > 500) {
      return NextResponse.json({ answer: "Ask me a short question about Mohammad's work." }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        answer:
          "Ask Moin is ready for questions about Mohammad's engineering, consulting, training, and projects. The AI provider still needs to be connected.",
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.6",
        instructions: SYSTEM_PROMPT,
        input: message,
        max_output_tokens: 220,
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { answer: "I couldn't reach Ask Moin right now. Please try again shortly." },
        { status: 502 },
      );
    }

    const data = (await response.json()) as { output_text?: string };
    return NextResponse.json({
      answer:
        data.output_text?.trim() ||
        "I don't have enough information on the site to answer that yet.",
    });
  } catch {
    return NextResponse.json(
      { answer: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
