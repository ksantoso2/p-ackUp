import Login from './Login';
import Signup from './welcome/Signup';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import React from 'react';
import Chat from './Chat';
import Trip from './Trip';
import TripList from './TripList';


function App() {
  return (
    <Router>
      <nav>
        <Link to="/trips">Trips</Link> |
        <Link to="/plan">Plan</Link>
      </nav>
      <Routes>
        <Route path="/Trip" element={<Trip />} />
        <Route path="/TripList" element={<TripList />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/signup" element={<Signup /> } />
        <Route path="/login" element={<Login />} /> {/* Login Page */}
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


