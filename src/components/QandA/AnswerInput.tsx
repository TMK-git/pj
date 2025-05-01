import React, { useState } from 'react';
import { Mic, Send } from 'lucide-react';

interface AnswerInputProps {
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

const AnswerInput: React.FC<AnswerInputProps> = ({ onSubmit, disabled = false }) => {
  const [answer, setAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim() && !disabled) {
      onSubmit(answer);
      setAnswer('');
    }
  };

  const handleVoiceInput = () => {
    // Simulating voice input for demo purposes
    // In a real implementation, this would use the Web Speech API
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setAnswer(prev => prev + " [Voice input simulation]");
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Type your answer here..."
          disabled={disabled}
        />
        <button
          type="button"
          onClick={handleVoiceInput}
          className={`px-3 py-2 ${
            isListening ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
          } border border-gray-300 border-l-0`}
          disabled={disabled}
          title="Voice input"
        >
          <Mic className={`h-5 w-5 ${isListening ? 'animate-pulse' : ''}`} />
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          disabled={!answer.trim() || disabled}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};

export default AnswerInput;