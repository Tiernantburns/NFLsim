import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Players from './pages/Players';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/players" element={<Players />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;