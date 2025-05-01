import React, { useState } from 'react';
import { Mic, Send, PlusCircle, Trash2 } from 'lucide-react';
import { useAI } from '../context/AIContext';
import QuestionForm from '../components/QandA/QuestionForm';
import AnswerInput from '../components/QandA/AnswerInput';
import FeedbackDisplay from '../components/QandA/FeedbackDisplay';

const QandA: React.FC = () => {
  const { evaluateAnswer } = useAI();
  const [questions, setQuestions] = useState<Array<{ question: string; correctAnswer: string }>>([
    { question: "What is the capital of France?", correctAnswer: "Paris" },
    { question: "What is the chemical symbol for water?", correctAnswer: "H2O" }
  ]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; feedback: string } | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleQuestionSelect = (index: number) => {
    setSelectedQuestionIndex(index);
    setUserAnswer("");
    setFeedback(null);
  };

  const handleAddQuestion = (question: string, answer: string) => {
    setQuestions([...questions, { question, correctAnswer: answer }]);
    setIsFormOpen(false);
  };

  const handleDeleteQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
    if (selectedQuestionIndex === index) {
      setSelectedQuestionIndex(null);
      setUserAnswer("");
      setFeedback(null);
    } else if (selectedQuestionIndex !== null && selectedQuestionIndex > index) {
      setSelectedQuestionIndex(selectedQuestionIndex - 1);
    }
  };

  const handleVoiceInput = () => {
    // In a real implementation, this would use the Web Speech API
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setUserAnswer(userAnswer + " [Voice input simulation]");
    }, 2000);
  };

  const handleSubmitAnswer = () => {
    if (selectedQuestionIndex === null || !userAnswer.trim()) return;
    
    const selectedQuestion = questions[selectedQuestionIndex];
    const result = evaluateAnswer(userAnswer, selectedQuestion.correctAnswer);
    setFeedback(result);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Questions & Answers</h1>
        <p className="text-gray-600">
          Test your knowledge by answering questions and get AI-powered feedback.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white rounded-xl shadow-md p-4 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Questions</h2>
            <button
              onClick={() => setIsFormOpen(true)}
              className="text-blue-600 hover:text-blue-700"
              title="Add new question"
            >
              <PlusCircle className="h-5 w-5" />
            </button>
          </div>
          
          {questions.length > 0 ? (
            <ul className="space-y-2">
              {questions.map((q, index) => (
                <li key={index} className="relative">
                  <button
                    onClick={() => handleQuestionSelect(index)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedQuestionIndex === index 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="block truncate">{q.question}</span>
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(index)}
                    className="absolute right-2 top-2 text-gray-400 hover:text-red-500"
                    title="Delete question"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">No questions added yet.</p>
          )}
        </div>
        
        <div className="md:col-span-2">
          {selectedQuestionIndex !== null ? (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {questions[selectedQuestionIndex].question}
              </h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Answer
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Type your answer here..."
                  />
                  <button
                    onClick={handleVoiceInput}
                    className={`px-3 py-2 ${
                      isListening ? 'bg-red-500' : 'bg-gray-200'
                    } text-gray-700 border border-gray-300 border-l-0`}
                    title="Voice input"
                  >
                    <Mic className={`h-5 w-5 ${isListening ? 'text-white animate-pulse' : ''}`} />
                  </button>
                  <button
                    onClick={handleSubmitAnswer}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 disabled:bg-blue-300"
                    disabled={!userAnswer.trim()}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {feedback && (
                <div className={`p-4 rounded-lg ${
                  feedback.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
                }`}>
                  <h3 className={`font-medium ${
                    feedback.isCorrect ? 'text-green-800' : 'text-amber-800'
                  } mb-2`}>
                    {feedback.isCorrect ? 'Correct Answer!' : 'Not Quite Right'}
                  </h3>
                  <p className={feedback.isCorrect ? 'text-green-700' : 'text-amber-700'}>
                    {feedback.feedback}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center text-center h-full">
              <div className="bg-blue-50 rounded-full p-4 mb-4">
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Question Selected</h3>
              <p className="text-gray-600 mb-4">
                Select a question from the list or add a new one to get started.
              </p>
              <button
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add a New Question
              </button>
            </div>
          )}
        </div>
      </div>
      
      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Question</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const question = formData.get('question') as string;
              const answer = formData.get('answer') as string;
              if (question && answer) {
                handleAddQuestion(question, answer);
              }
            }}>
              <div className="mb-4">
                <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
                  Question
                </label>
                <input
                  type="text"
                  id="question"
                  name="question"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your question"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
                  Correct Answer
                </label>
                <input
                  type="text"
                  id="answer"
                  name="answer"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter the correct answer"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QandA;

function MessageSquare(props: { className: string }) {
  return <Send {...props} />;
}