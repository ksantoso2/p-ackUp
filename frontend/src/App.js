import Signup from './welcome/Signup';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import React from 'react';
import Chat from './Chat';
import Trip from './Trip';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Trip" element={<Trip />} />
      </Routes>
    </Router>
  );
}


export default App;
