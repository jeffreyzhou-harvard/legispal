import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      );
    }

    const prompt = `Please analyze this legislative bill and provide:
1. A concise summary
2. Key points and provisions
3. Potential impact on stakeholders
4. Recommendations for consideration

Bill text:
${text}

Please format the response as JSON with the following structure:
{
  "title": "Bill title or identifier",
  "summary": "Concise summary",
  "keyPoints": ["point 1", "point 2", ...],
  "impact": "Impact analysis",
  "recommendations": ["recommendation 1", "recommendation 2", ...]
}`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert legislative analyst. Provide clear, concise, and objective analysis of legislative bills."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE || "0.7"),
    });

    const analysis = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze bill' },
      { status: 500 }
    );
  }
} 