import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Menu, X, Moon, Sun, LogIn, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../lib/supabase';
import AuthModal from '../auth/AuthModal';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/qanda', label: 'Q&A' },
    { path: '/quiz', label: 'Quiz' },
    { path: '/interactive', label: 'Interactive' },
  ];

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error signing out');
    } else {
      toast.success('Signed out successfully');
    }
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">LearnMate AI</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <nav className="flex space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`text-base font-medium transition-colors duration-200 ${
                      location.pathname === item.path
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                        : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleTheme}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>

                {user ? (
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </div>
            
            <div className="md:hidden flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-300"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 dark:text-gray-300"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
          
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`text-base font-medium px-2 py-1 rounded-md transition-colors duration-200 ${
                      location.pathname === item.path
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50'
                        : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {user ? (
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-2 py-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 px-2 py-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Sign In</span>
                  </button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}
    </>
  );
};

export default Header;