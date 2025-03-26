import Signup from './welcome/Signup';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import React from 'react';
import Chat from './Chat';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";  //if error run: npm install react-router-dom

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/chat" element={<Chat />} />
        <Route path="/signup" element={<Signup /> } />
      </Routes>
    </Router>
  );
}

export default App;
