import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!, 
});

export async function POST(req: Request) {
  try {
    const { category } = await req.json(); 

    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    const prompt = `Generate a challenging trivia question in the category of ${category}. Provide the question, four answer choices, and the correct answer in JSON format: { "question": "...", "choices": ["A", "B", "C", "D"], "answer": "A" }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: "You are a trivia master." }, { role: "user", content: prompt }],
      temperature: 1.3,
    });

    const triviaQuestion = response.choices[0]?.message?.content;

    return NextResponse.json({ triviaQuestion });
  } catch (error) {
    console.error("Error fetching trivia question:", error);
    return NextResponse.json({ error: "Failed to generate trivia question" }, { status: 500 });
  }
}
