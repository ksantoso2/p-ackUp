import Login from './Login';
import Signup from './welcome/Signup';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import React from 'react';
import Chat from './Chat';
import Trip from './Trip';
import TripList from './TripList';
import Navbar from './Navbar';


function App() {
  return (
    <Router>
      <Navbar/>
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


export default App;


