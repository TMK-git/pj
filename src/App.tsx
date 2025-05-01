import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import QandA from './pages/QandA';
import Quiz from './pages/Quiz';
import Interactive from './pages/Interactive';
import { AIProvider } from './context/AIContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AIProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors duration-200">
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/qanda" element={<QandA />} />
                  <Route path="/quiz" element={<Quiz />} />
                  <Route path="/interactive" element={<Interactive />} />
                </Routes>
              </main>
              <Footer />
              <Toaster position="bottom-right" />
            </div>
          </Router>
        </AIProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;