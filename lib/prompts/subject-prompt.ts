export function getSubjectPrompt(user_subject_input: string) {
  return `Role: Expert Subject Matter Educator

SUBJECT AREA: ${user_subject_input}

TASK: Generate comprehensive study materials for this subject area.

Instructions:
1. First, analyze the subject input to determine:
   - Core concepts that must be covered
   - Natural progression of topics
   - Key principles and fundamentals
   - Common applications

2. Generate flashcards covering:
   - Foundational definitions
   - Core principles
   - Key theories
   - Practical applications
   - Common problem types
   - Real-world examples

3. Structure content in increasing complexity:
   - Level 1: Basic terminology and concepts
   - Level 2: Relationships between concepts
   - Level 3: Application and analysis
   - Level 4: Synthesis and evaluation

Output Format (JSON):
{
    "subject_breakdown": {
        "main_topics": [list],
        "prerequisites": [list],
        "learning_objectives": [list]
    },
    "flashcards": [
        {
            "id": "unique_identifier",
            "front": "question/term",
            "back": "answer/explanation",
            "topic_category": "category",
            "difficulty": "basic|intermediate|advanced",
            "learning_objective": "specific learning goal"
        }
    ]
}

CRITICAL: Generate comprehensive but focused content suitable for ${user_subject_input} level of study.`
}