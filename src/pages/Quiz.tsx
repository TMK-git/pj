import React, { useState, useEffect } from 'react';
import { CheckCircle, ChevronRight, RotateCcw, BarChart } from 'lucide-react';
import { useAI } from '../context/AIContext';

type QuizQuestion = {
  id: number;
  type: 'mcq' | 'short-answer' | 'jumbled';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  jumbledSentence?: string[];
};

type QuizResult = {
  questionId: number;
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string | string[];
};

const demoQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    type: 'mcq',
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 'Mars'
  },
  {
    id: 2,
    type: 'short-answer',
    question: 'What is the chemical symbol for gold?',
    correctAnswer: 'Au'
  },
  {
    id: 3,
    type: 'jumbled',
    question: 'Arrange the words to form a proper sentence:',
    jumbledSentence: ['sun', 'rises', 'the', 'east', 'in', 'the'],
    correctAnswer: ['the', 'sun', 'rises', 'in', 'the', 'east']
  },
  {
    id: 4,
    type: 'mcq',
    question: 'Which of the following is NOT a primary color?',
    options: ['Red', 'Blue', 'Green', 'Yellow'],
    correctAnswer: 'Green'
  },
  {
    id: 5,
    type: 'short-answer',
    question: 'What is the largest organ in the human body?',
    correctAnswer: 'Skin'
  }
];

const Quiz: React.FC = () => {
  const { evaluateAnswer } = useAI();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string | string[]>>({});
  const [quizComplete, setQuizComplete] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  
  const currentQuestion = demoQuizQuestions[currentQuestionIndex];

  useEffect(() => {
    if (currentQuestion?.type === 'jumbled' && currentQuestion.jumbledSentence) {
      // Shuffle words for jumbled sentence questions
      setShuffledWords([...currentQuestion.jumbledSentence].sort(() => Math.random() - 0.5));
      setSelectedWords([]);
    }
  }, [currentQuestionIndex, currentQuestion]);

  const handleMCQSelect = (option: string) => {
    setUserAnswers({ ...userAnswers, [currentQuestion.id]: option });
  };

  const handleShortAnswerChange = (answer: string) => {
    setUserAnswers({ ...userAnswers, [currentQuestion.id]: answer });
  };

  const handleWordSelect = (word: string, index: number) => {
    // Remove the word from shuffled array and add to selected
    const newShuffled = [...shuffledWords];
    newShuffled.splice(index, 1);
    setShuffledWords(newShuffled);
    setSelectedWords([...selectedWords, word]);
    setUserAnswers({ ...userAnswers, [currentQuestion.id]: [...selectedWords, word] });
  };

  const handleWordRemove = (word: string, index: number) => {
    // Remove from selected and put back in shuffled
    const newSelected = [...selectedWords];
    newSelected.splice(index, 1);
    setSelectedWords(newSelected);
    setShuffledWords([...shuffledWords, word]);
    setUserAnswers({ ...userAnswers, [currentQuestion.id]: newSelected });
  };

  const handleResetJumbled = () => {
    if (currentQuestion?.type === 'jumbled' && currentQuestion.jumbledSentence) {
      setShuffledWords([...currentQuestion.jumbledSentence].sort(() => Math.random() - 0.5));
      setSelectedWords([]);
      setUserAnswers({ ...userAnswers, [currentQuestion.id]: [] });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < demoQuizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    const quizResults: QuizResult[] = demoQuizQuestions.map((q) => {
      const userAnswer = userAnswers[q.id] || '';
      let isCorrect = false;
      
      if (q.type === 'mcq' || q.type === 'short-answer') {
        const answer = typeof userAnswer === 'string' ? userAnswer : '';
        const result = evaluateAnswer(answer, q.correctAnswer as string);
        isCorrect = result.isCorrect;
      } else if (q.type === 'jumbled') {
        // Compare arrays for jumbled sentence
        const selectedArray = userAnswer as string[];
        const correctArray = q.correctAnswer as string[];
        isCorrect = selectedArray.length === correctArray.length && 
          selectedArray.every((word, i) => word.toLowerCase() === correctArray[i].toLowerCase());
      }
      
      return {
        questionId: q.id,
        isCorrect,
        userAnswer: Array.isArray(userAnswer) ? userAnswer.join(' ') : userAnswer,
        correctAnswer: Array.isArray(q.correctAnswer) ? q.correctAnswer.join(' ') : q.correctAnswer
      };
    });
    
    setResults(quizResults);
    setQuizComplete(true);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizComplete(false);
    setResults([]);
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'mcq':
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{currentQuestion.question}</h2>
            <div className="space-y-3">
              {currentQuestion.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleMCQSelect(option)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                    userAnswers[currentQuestion.id] === option
                      ? 'bg-blue-100 border-blue-300 text-blue-800'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="inline-block w-6 h-6 rounded-full bg-gray-100 text-gray-800 text-center mr-3">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
        
      case 'short-answer':
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{currentQuestion.question}</h2>
            <div className="mb-6">
              <input
                type="text"
                value={(userAnswers[currentQuestion.id] || '') as string}
                onChange={(e) => handleShortAnswerChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Type your answer here..."
              />
            </div>
          </div>
        );
        
      case 'jumbled':
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{currentQuestion.question}</h2>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 min-h-16 flex flex-wrap items-center gap-2">
              {selectedWords.length > 0 ? (
                selectedWords.map((word, index) => (
                  <button
                    key={`selected-${index}`}
                    onClick={() => handleWordRemove(word, index)}
                    className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
                  >
                    {word}
                  </button>
                ))
              ) : (
                <span className="text-gray-500">Select words to form a sentence</span>
              )}
            </div>
            
            <div className="flex justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700">Available Words:</h3>
              <button
                onClick={handleResetJumbled}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {shuffledWords.map((word, index) => (
                <button
                  key={`shuffled-${index}`}
                  onClick={() => handleWordSelect(word, index)}
                  className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        );
        
      default:
        return <p>Question type not supported</p>;
    }
  };

  const renderResults = () => {
    const correctCount = results.filter(r => r.isCorrect).length;
    const percentage = Math.round((correctCount / demoQuizQuestions.length) * 100);
    
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 text-blue-600 mb-4">
            <span className="text-2xl font-bold">{percentage}%</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Quiz Complete!</h2>
          <p className="text-gray-600">You got {correctCount} out of {demoQuizQuestions.length} questions correct.</p>
        </div>
        
        <div className="space-y-4 mb-8">
          {results.map((result, index) => {
            const question = demoQuizQuestions.find(q => q.id === result.questionId);
            return (
              <div key={index} className={`p-4 rounded-lg border ${
                result.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex">
                  <div className={`flex-shrink-0 h-6 w-6 rounded-full ${
                    result.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  } flex items-center justify-center mr-3`}>
                    {result.isCorrect ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <span className="text-xs">✕</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{question?.question}</h3>
                    <p className={`text-sm ${result.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      Your answer: {result.userAnswer || '(No answer)'}
                    </p>
                    {!result.isCorrect && (
                      <p className="text-sm text-gray-600">
                        Correct answer: {Array.isArray(result.correctAnswer) 
                          ? result.correctAnswer.join(' ') 
                          : result.correctAnswer}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={restartQuiz}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Restart Quiz
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Mode</h1>
        <p className="text-gray-600">
          Test your knowledge with different types of questions.
        </p>
      </div>
      
      {quizComplete ? (
        renderResults()
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-blue-50 px-6 py-4 flex items-center justify-between">
            <span className="text-sm font-medium text-blue-700">
              Question {currentQuestionIndex + 1} of {demoQuizQuestions.length}
            </span>
            <div className="flex items-center space-x-1">
              {demoQuizQuestions.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full ${
                    i === currentQuestionIndex
                      ? 'bg-blue-600' 
                      : i < currentQuestionIndex
                        ? 'bg-blue-300'
                        : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="p-6">
            {renderQuestion()}
          </div>
          
          <div className="px-6 py-4 bg-gray-50 flex justify-between">
            <button
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              className={`px-4 py-2 border border-gray-300 rounded-md ${
                currentQuestionIndex === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>
            <button
              onClick={handleNextQuestion}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center"
              disabled={!userAnswers[currentQuestion.id]}
            >
              {currentQuestionIndex === demoQuizQuestions.length - 1 ? 'Finish' : 'Next'}
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;