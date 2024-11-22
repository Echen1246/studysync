import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getStudyGuidePrompt } from '@/lib/prompts/study-guide-prompt';
import { getSubjectPrompt } from '@/lib/prompts/subject-prompt';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { input, mode } = await req.json();
    
    const prompt = mode === 'study_guide' 
      ? getStudyGuidePrompt(input)
      : getSubjectPrompt(input);

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: prompt
        }
      ],
      model: "gpt-4",
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    // Add unique IDs to flashcards if they don't have them
    const flashcards = result.flashcards.map((card: any) => ({
      ...card,
      id: card.id || crypto.randomUUID()
    }));

    return NextResponse.json({
      ...result,
      flashcards
    });
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return NextResponse.json(
      { error: 'Failed to generate flashcards' },
      { status: 500 }
    );
  }
}