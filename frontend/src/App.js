import Signup from './welcome/Signup';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import React from 'react';
import Chat from './Chat';
import Trip from './Trip';
import TripList from './TripList';


function App() {
  return (
    <Router>
      <Routes>
      <Route path="/Chat" element={<Chat />} />
        <Route path="/Trip" element={<Trip />} />
        <Route path="/TripList" element={<TripList />} />
      </Routes>
    </Router>
  );
}

export default App;
