import { NextResponse } from "next/server";
import OpenAI from "openai";

// Optional: ensure API route doesn't hang forever
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { profile, sessionData } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, baseURL: 'https://platform.beeknoee.com/api/v1'
    });

    const userWeight = profile?.weight || 70; // default 70kg
    const userHeight = profile?.height || 170; // default 170cm

    const prompt = `You are a fitness expert and health calculator.
Based on the following workout data and user profile, estimate the total calories burned during this session.
User Profile: Weight = ${userWeight}kg, Height = ${userHeight}cm.

Workout Data:
${JSON.stringify(sessionData, null, 2)}

Respond with ONLY a valid JSON object containing a single key "estimatedCalories" with a numeric value representing the total calories burned. Do not include any other text or markdown formatting.`;

    const response = await openai.chat.completions.create({
      model: "glm-4.7-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const parsed = JSON.parse(content);
    return NextResponse.json({ estimatedCalories: parsed.estimatedCalories || 0 });
  } catch (error) {
    console.error("Error calculating calories:", error);
    return NextResponse.json(
      { error: "Failed to calculate calories." },
      { status: 500 }
    );
  }
}
