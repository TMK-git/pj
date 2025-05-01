import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface FeedbackDisplayProps {
  isCorrect: boolean;
  feedback: string;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ isCorrect, feedback }) => {
  return (
    <div 
      className={`p-4 rounded-lg border ${
        isCorrect 
          ? 'bg-green-50 border-green-200' 
          : 'bg-amber-50 border-amber-200'
      } transition-all duration-300 ease-in-out`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5 mr-3">
          {isCorrect ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-amber-500" />
          )}
        </div>
        <div>
          <h3 className={`font-medium ${
            isCorrect ? 'text-green-800' : 'text-amber-800'
          } mb-1`}>
            {isCorrect ? 'Correct Answer!' : 'Not Quite Right'}
          </h3>
          <p className={isCorrect ? 'text-green-700' : 'text-amber-700'}>
            {feedback}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDisplay;