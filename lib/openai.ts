import OpenAI from 'openai';
import { getStudyGuidePrompt } from './prompts/study-guide-prompt';
import { getSubjectPrompt } from './prompts/subject-prompt';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateFlashcards(topic: string, mode: 'study_guide' | 'subject') {
  const prompt = mode === 'study_guide' 
    ? getStudyGuidePrompt(topic)
    : getSubjectPrompt(topic);

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: prompt
      }
    ],
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
  });

  try {
    return JSON.parse(completion.choices[0].message.content || '[]');
  } catch (error) {
    console.error('Error parsing flashcards:', error);
    return [];
  }
}