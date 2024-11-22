export function getStudyGuidePrompt(study_guide_content: string) {
  return `Role: Expert Educational Content Processor

TASK: Convert this study guide into precise, comprehensive flashcards.

Study Guide Content:
${study_guide_content}

Instructions:
1. Extract every key term, concept, and definition directly from the provided material
2. Create flashcards that strictly adhere to the provided content
3. Maintain the exact terminology and definitions from the source material
4. Generate three types of cards for core concepts:
   - Direct term/definition pairs
   - Concept application scenarios
   - Term relationships/comparisons

Output Format (JSON):
{
    "flashcards": [
        {
            "id": "unique_identifier",
            "front": "question/term",
            "back": "answer/explanation",
            "source_section": "which part of guide",
            "difficulty": "basic|intermediate|advanced"
        }
    ],
    "metadata": {
        "total_terms": number,
        "main_topics": [list of main topics],
        "suggested_study_order": [ordered list]
    }
}

CRITICAL: Stay within the scope of the provided material. Do not add external information.`
}