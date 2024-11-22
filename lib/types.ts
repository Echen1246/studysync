export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  dueDate: Date;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  topic_category?: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  learning_objective?: string;
  source_section?: string;
}

export interface FlashcardBundle {
  id: string;
  title: string;
  createdAt: Date;
  mode: 'study_guide' | 'subject';
  flashcards: Flashcard[];
  metadata: StudyGuideResponse['metadata'] | SubjectResponse['subject_breakdown'];
}

export interface StudyGuideResponse {
  flashcards: Flashcard[];
  metadata: {
    total_terms: number;
    main_topics: string[];
    suggested_study_order: string[];
  };
}

export interface SubjectResponse {
  subject_breakdown: {
    main_topics: string[];
    prerequisites: string[];
    learning_objectives: string[];
  };
  flashcards: Flashcard[];
}