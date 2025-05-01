export interface Question {
  id: string;
  user_id: string;
  question: string;
  correct_answer: string;
  type: 'text' | 'mcq' | 'jumbled';
  options?: string[];
  created_at: string;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  score: number;
  completed_at: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}