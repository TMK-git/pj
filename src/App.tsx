import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import QandA from './pages/QandA';
import Quiz from './pages/Quiz';
import Interactive from './pages/Interactive';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/qanda" element={<QandA />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/interactive" element={<Interactive />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
