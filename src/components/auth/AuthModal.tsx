import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../context/ThemeContext';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sign In</h2>
          <p className="text-gray-600 dark:text-gray-300">Sign in to save your progress and questions</p>
        </div>
        
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#2563eb',
                  brandAccent: '#1d4ed8',
                }
              }
            },
            className: {
              container: 'w-full',
              button: 'w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700',
              input: 'w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600',
            }
          }}
          theme={theme}
          providers={[]}
        />
        
        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AuthModal;