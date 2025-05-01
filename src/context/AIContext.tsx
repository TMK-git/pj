import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface AIContextType {
  evaluateAnswer: (
    userAnswer: string,
    correctAnswer: string | string[]
  ) => {
    isCorrect: boolean;
    feedback: string;
  };
  saveQuestion: (question: string, answer: string, type?: string, options?: string[]) => Promise<void>;
  getQuestions: () => Promise<any[]>;
  saveQuizAttempt: (score: number) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const useAI = (): AIContextType => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

interface AIProviderProps {
  children: ReactNode;
}

export const AIProvider: React.FC<AIProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        // Clear any cached data
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const evaluateAnswer = (
    userAnswer: string,
    correctAnswer: string | string[]
  ): { isCorrect: boolean; feedback: string } => {
    if (!userAnswer.trim()) {
      return {
        isCorrect: false,
        feedback: "Please provide an answer before submitting.",
      };
    }

    const userAnswerLower = userAnswer.toLowerCase().trim();
    
    if (Array.isArray(correctAnswer)) {
      const correctString = correctAnswer.join(' ').toLowerCase();
      const isCorrect = userAnswerLower === correctString;
      
      return {
        isCorrect,
        feedback: isCorrect
          ? "Perfect! You arranged the sentence correctly."
          : "The sentence order isn't quite right. Try again!"
      };
    } else {
      const correctAnswerLower = correctAnswer.toLowerCase().trim();
      
      if (userAnswerLower === correctAnswerLower) {
        return {
          isCorrect: true,
          feedback: "Your answer is exactly correct!",
        };
      }
      
      const keyTerms = correctAnswerLower.split(' ').filter(word => word.length > 3);
      const matchedTermsCount = keyTerms.filter(term => userAnswerLower.includes(term)).length;
      const matchPercentage = keyTerms.length > 0 ? matchedTermsCount / keyTerms.length : 0;
      
      if (matchPercentage >= 0.8) {
        return {
          isCorrect: true,
          feedback: "Your answer contains all the key points! Well done.",
        };
      } else if (matchPercentage >= 0.5) {
        return {
          isCorrect: false,
          feedback: "Your answer includes some correct elements, but is missing key information.",
        };
      } else {
        return {
          isCorrect: false,
          feedback: "Your answer doesn't match the expected response. Try a different approach.",
        };
      }
    }
  };

  const saveQuestion = async (
    question: string,
    answer: string,
    type: string = 'text',
    options?: string[]
  ) => {
    try {
      setLoading(true);
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      const { error } = await supabase
        .from('questions')
        .insert({
          user_id: userData.user.id,
          question,
          correct_answer: answer,
          type,
          options: options ? JSON.stringify(options) : null
        });

      if (error) throw error;
      toast.success('Question saved successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save question';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getQuestions = async () => {
    try {
      setLoading(true);
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch questions';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const saveQuizAttempt = async (score: number) => {
    try {
      setLoading(true);
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      const { error } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: userData.user.id,
          score,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success('Quiz attempt saved!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save quiz attempt';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AIContext.Provider value={{
      evaluateAnswer,
      saveQuestion,
      getQuestions,
      saveQuizAttempt,
      loading,
      error
    }}>
      {children}
    </AIContext.Provider>
  );
};