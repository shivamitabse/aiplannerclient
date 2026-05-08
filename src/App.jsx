import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Results from './pages/Results';
import SharedReport from './pages/SharedReport';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        {/* Simple Navbar */}
        <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">
                A
              </div>
              <span className="font-semibold text-lg tracking-tight">AI Spend Audit</span>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<Results />} />
            <Route path="/audit/:id" element={<SharedReport />} />
          </Routes>
        </main>
        
        <footer className="border-t border-border py-8 mt-auto">
          <div className="max-w-5xl mx-auto px-4 text-center text-textMuted text-sm">
            &copy; {new Date().getFullYear()} AI Spend Audit. All rights reserved.
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
