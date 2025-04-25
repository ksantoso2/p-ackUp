import Signup from './welcome/Signup';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import React from 'react';
import Chat from './Chat';
import TripList from './TripList';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/trips">Trips</Link> |
        <Link to="/plan">Plan</Link>
      </nav>
      <Routes>
        <Route path="/chat" element={<Chat />} />
        <Route path="/trips" element={<TripList />} />
        <Route path="/plan" element={<Plan />} />
      </Routes>
    </Router>
  );
}

function Trips() {
  // return trips page ;
}

function Plan() {
  // return plan page ;
}

export default App;
