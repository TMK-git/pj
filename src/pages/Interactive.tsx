import React, { useState, useEffect } from 'react';
import { Lightbulb, ThumbsUp, ThumbsDown, RefreshCw, Clock } from 'lucide-react';
import { useAI } from '../context/AIContext';

type InteractiveQuestion = {
  id: number;
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  answer: string;
  hints: string[];
};

const sampleQuestions: InteractiveQuestion[] = [
  {
    id: 1,
    question: "What is the capital of France?",
    difficulty: 'easy',
    answer: "Paris",
    hints: ["It's located on the Seine River", "It's known as the City of Light"]
  },
  {
    id: 2,
    question: "Who wrote 'Pride and Prejudice'?",
    difficulty: 'easy',
    answer: "Jane Austen",
    hints: ["She was an English novelist who lived in the early 19th century", "Her other works include 'Sense and Sensibility' and 'Emma'"]
  },
  {
    id: 3,
    question: "What is photosynthesis?",
    difficulty: 'medium',
    answer: "The process by which green plants and some other organisms use sunlight to synthesize foods with carbon dioxide and water, generating oxygen as a byproduct",
    hints: ["It's a process that converts one thing into another", "It requires sunlight, water, and carbon dioxide"]
  },
  {
    id: 4,
    question: "Explain the concept of gravity according to Newton's law of universal gravitation",
    difficulty: 'hard',
    answer: "Newton's law of universal gravitation states that every particle attracts every other particle in the universe with a force that is directly proportional to the product of their masses and inversely proportional to the square of the distance between their centers",
    hints: ["It involves an inverse square relationship", "It explains why objects fall to Earth"]
  },
  {
    id: 5,
    question: "What is the main difference between mitosis and meiosis?",
    difficulty: 'hard',
    answer: "Mitosis is a process of cell division that results in two genetically identical daughter cells, while meiosis is a process of cell division that results in four genetically diverse daughter cells with half the number of chromosomes as the parent cell",
    hints: ["One produces genetically identical cells, the other doesn't", "They differ in the number of divisions and resulting cells"]
  }
];

const Interactive: React.FC = () => {
  const { evaluateAnswer } = useAI();
  const [currentQuestion, setCurrentQuestion] = useState<InteractiveQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    message: string;
    relevanceScore?: number;
  } | null>(null);
  const [showingHint, setShowingHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [streak, setStreak] = useState(0);
  const [stats, setStats] = useState({
    correct: 0,
    incorrect: 0,
    hintsUsed: 0,
  });

  useEffect(() => {
    // Load a question when component mounts
    getNewQuestion();
  }, [difficulty]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const getNewQuestion = () => {
    // Filter questions by difficulty
    const filteredQuestions = sampleQuestions.filter(q => q.difficulty === difficulty);
    
    // If no questions match the difficulty, use all questions
    const questions = filteredQuestions.length > 0 ? filteredQuestions : sampleQuestions;
    
    // Randomly select a question
    const randomIndex = Math.floor(Math.random() * questions.length);
    setCurrentQuestion(questions[randomIndex]);
    setUserAnswer("");
    setFeedback(null);
    setShowingHint(false);
    setHintIndex(0);
    setTimer(0);
    setIsTimerRunning(true);
  };

  const handleSubmitAnswer = () => {
    if (!currentQuestion || !userAnswer.trim()) return;
    
    setIsTimerRunning(false);
    const result = evaluateAnswer(userAnswer, currentQuestion.answer);
    
    // Simulate a more detailed AI feedback with relevance score
    const relevanceScore = result.isCorrect ? 
      Math.floor(Math.random() * 20) + 80 : // 80-100 if correct
      Math.floor(Math.random() * 50) + 30;  // 30-80 if incorrect
    
    let feedbackMessage = result.feedback;
    
    if (result.isCorrect) {
      setStreak(prev => prev + 1);
      setStats(prev => ({
        ...prev,
        correct: prev.correct + 1
      }));
      feedbackMessage += " Great job!";
    } else {
      setStreak(0);
      setStats(prev => ({
        ...prev,
        incorrect: prev.incorrect + 1
      }));
      feedbackMessage += " The correct answer is: " + currentQuestion.answer;
    }
    
    setFeedback({
      isCorrect: result.isCorrect,
      message: feedbackMessage,
      relevanceScore
    });
  };

  const showHint = () => {
    if (!currentQuestion) return;
    
    setShowingHint(true);
    setStats(prev => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1
    }));
    
    // Move to next hint if available
    if (hintIndex < currentQuestion.hints.length - 1) {
      setHintIndex(prevIndex => prevIndex + 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Interactive Learning</h1>
        <p className="text-gray-600">
          Engage in an adaptive learning session with personalized questions and feedback.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-600">Correct Answers</span>
                  <span className="text-sm font-medium text-green-600">{stats.correct}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${stats.correct > 0 ? (stats.correct / (stats.correct + stats.incorrect) * 100) : 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-600">Current Streak</span>
                  <span className="text-sm font-medium text-blue-600">{streak}</span>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-2 rounded-full mr-1 ${i < streak ? 'bg-blue-500' : 'bg-gray-200'}`}
                    ></div>
                  ))}
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-sm text-gray-600 mb-2">Difficulty Level</p>
                <div className="flex space-x-2">
                  {(['easy', 'medium', 'hard'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`px-3 py-1 text-xs rounded-full capitalize ${
                        difficulty === level
                          ? 'bg-blue-100 text-blue-800 font-medium'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Learning Tips</h2>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2">
                  <span className="text-xs">1</span>
                </div>
                <p>Try to answer from memory before viewing hints</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2">
                  <span className="text-xs">2</span>
                </div>
                <p>Use complete sentences for better evaluation</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2">
                  <span className="text-xs">3</span>
                </div>
                <p>After submitting, review the feedback thoroughly</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2">
                  <span className="text-xs">4</span>
                </div>
                <p>Challenge yourself by increasing the difficulty</p>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="md:col-span-2">
          {currentQuestion ? (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-blue-50 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center">
                  <span className={`inline-block h-3 w-3 rounded-full mr-2 ${
                    currentQuestion.difficulty === 'easy' ? 'bg-green-500' :
                    currentQuestion.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></span>
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {currentQuestion.difficulty} Question
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">{formatTime(timer)}</span>
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {currentQuestion.question}
                </h2>
                
                {showingHint && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <Lightbulb className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-amber-800 mb-1">Hint {hintIndex + 1}</h3>
                        <p className="text-amber-700">{currentQuestion.hints[hintIndex]}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {feedback ? (
                  <div className={`p-4 rounded-lg mb-6 ${
                    feedback.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
                  }`}>
                    <h3 className={`font-medium ${
                      feedback.isCorrect ? 'text-green-800' : 'text-amber-800'
                    } mb-2`}>
                      {feedback.isCorrect ? 'Correct Answer!' : 'Not Quite Right'}
                    </h3>
                    <p className={feedback.isCorrect ? 'text-green-700' : 'text-amber-700'}>
                      {feedback.message}
                    </p>
                    
                    {feedback.relevanceScore !== undefined && (
                      <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium text-gray-600">Answer Relevance</span>
                          <span className="text-xs font-medium text-gray-600">{feedback.relevanceScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              feedback.relevanceScore > 80 ? 'bg-green-500' :
                              feedback.relevanceScore > 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${feedback.relevanceScore}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Answer
                    </label>
                    <textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Type your answer here..."
                    />
                  </div>
                )}
                
                <div className="flex flex-wrap justify-between gap-2">
                  {feedback ? (
                    <div className="flex gap-2">
                      <button
                        onClick={getNewQuestion}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Next Question
                      </button>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {/* Implement thumbs up feedback */}}
                          className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                          title="This feedback was helpful"
                        >
                          <ThumbsUp className="h-4 w-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => {/* Implement thumbs down feedback */}}
                          className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                          title="This feedback wasn't helpful"
                        >
                          <ThumbsDown className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSubmitAnswer}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                        disabled={!userAnswer.trim()}
                      >
                        Submit Answer
                      </button>
                      <button
                        onClick={showHint}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                        disabled={showingHint && hintIndex >= currentQuestion.hints.length - 1}
                      >
                        {!showingHint ? 'Show Hint' : 'Next Hint'}
                      </button>
                    </div>
                  )}
                  
                  <button
                    onClick={getNewQuestion}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 inline-flex items-center"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Skip Question
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center text-center h-64">
              <div className="bg-blue-50 rounded-full p-4 mb-4">
                <Lightbulb className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Questions</h3>
              <p className="text-gray-600 mb-4">
                Preparing your interactive learning session...
              </p>
              <button
                onClick={getNewQuestion}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Start Learning
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Interactive;