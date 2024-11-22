import { create } from 'zustand';
import { Task, FlashcardBundle } from './types';

interface StudyStore {
  tasks: Task[];
  selectedDate: Date;
  studyStartTime: Date | null;
  flashcardBundles: FlashcardBundle[];
  completedFlashcards: Set<string>;
  addTask: (title: string, dueDate: Date) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  setSelectedDate: (date: Date) => void;
  startStudySession: () => void;
  addFlashcardBundle: (bundle: FlashcardBundle) => void;
  toggleFlashcard: (flashcardId: string) => void;
}

export const useStudyStore = create<StudyStore>((set) => ({
  tasks: [],
  selectedDate: new Date(),
  studyStartTime: null,
  flashcardBundles: [],
  completedFlashcards: new Set<string>(),
  addTask: (title, dueDate) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          id: crypto.randomUUID(),
          title,
          completed: false,
          createdAt: new Date(),
          dueDate,
        },
      ],
    })),
  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    })),
  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
  setSelectedDate: (date) => set({ selectedDate: date }),
  startStudySession: () => set({ studyStartTime: new Date() }),
  addFlashcardBundle: (bundle) =>
    set((state) => ({
      flashcardBundles: [bundle, ...state.flashcardBundles],
    })),
  toggleFlashcard: (flashcardId) =>
    set((state) => {
      const newCompleted = new Set(state.completedFlashcards);
      if (newCompleted.has(flashcardId)) {
        newCompleted.delete(flashcardId);
      } else {
        newCompleted.add(flashcardId);
      }
      return { completedFlashcards: newCompleted };
    }),
}));