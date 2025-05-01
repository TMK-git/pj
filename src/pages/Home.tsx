import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, MessageSquare, BrainCircuit } from 'lucide-react';

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  to: string;
  buttonText: string;
}> = ({ icon, title, description, to, buttonText }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
    <div className="p-6">
      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link
        to={to}
        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
      >
        {buttonText}
      </Link>
    </div>
  </div>
);

const Home: React.FC = () => {
  return (
    <div className="space-y-12">
      <section className="text-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Learn Smarter with AI
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-8">
          Personalized learning assistant that helps you master concepts, test your knowledge, 
          and improve retention through interactive exercises.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/qanda"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            Get Started
          </Link>
          <Link
            to="/quiz"
            className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            Try a Quiz
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Features to Enhance Your Learning
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<MessageSquare className="h-6 w-6" />}
            title="Questions & Answers"
            description="Test your knowledge by answering questions and get instant AI-powered feedback on your responses."
            to="/qanda"
            buttonText="Try Q&A"
          />
          <FeatureCard
            icon={<CheckCircle className="h-6 w-6" />}
            title="Quiz Mode"
            description="Take quizzes with multiple-choice, short-answer, and jumbled sentence exercises."
            to="/quiz"
            buttonText="Take a Quiz"
          />
          <FeatureCard
            icon={<BrainCircuit className="h-6 w-6" />}
            title="Interactive Learning"
            description="Engage in interactive learning sessions where the AI adapts questions based on your performance."
            to="/interactive"
            buttonText="Start Learning"
          />
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-md p-6 md:p-8">
        <div className="md:flex items-center">
          <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How LearnMate AI Works
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 mt-0.5">
                  1
                </div>
                <p className="text-gray-600">
                  <span className="font-medium text-gray-900">Input questions and answers</span> - Create your own study material or use our pre-made content.
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 mt-0.5">
                  2
                </div>
                <p className="text-gray-600">
                  <span className="font-medium text-gray-900">Practice and test yourself</span> - Answer questions through typing or speaking.
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 mt-0.5">
                  3
                </div>
                <p className="text-gray-600">
                  <span className="font-medium text-gray-900">Get AI-powered feedback</span> - Our AI evaluates your answers and provides helpful guidance.
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 mt-0.5">
                  4
                </div>
                <p className="text-gray-600">
                  <span className="font-medium text-gray-900">Track your progress</span> - See your improvement over time across different topics.
                </p>
              </li>
            </ul>
          </div>
          <div className="md:w-1/2">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ready to get started?</h3>
              <p className="text-gray-600 mb-6">
                Create your first set of study materials or try one of our sample quizzes to see how LearnMate AI can help improve your learning.
              </p>
              <Link
                to="/qanda"
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                Start Learning Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;