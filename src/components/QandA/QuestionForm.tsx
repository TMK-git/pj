import React, { useState } from 'react';
import { X } from 'lucide-react';

interface QuestionFormProps {
  onSubmit: (question: string, answer: string) => void;
  onCancel: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ onSubmit, onCancel }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && answer.trim()) {
      onSubmit(question, answer);
      setQuestion('');
      setAnswer('');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Add New Question</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
              Question
            </label>
            <input
              type="text"
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your question"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
              Correct Answer
            </label>
            <textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter the correct answer"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={!question.trim() || !answer.trim()}
            >
              Add Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionForm;