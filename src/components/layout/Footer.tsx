import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} LearnMate AI. All rights reserved.
            </p>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <span>Made with</span>
            <Heart className="h-4 w-4 mx-1 text-red-500 fill-current" />
            <span>for students everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;