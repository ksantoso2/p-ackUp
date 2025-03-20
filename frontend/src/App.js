import Login from './Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import React from 'react';

function App() {
  return (
    <Router> {/* Router should wrap everything */}
      <Routes> {/* Contains all routes */}
        <Route path="/login" element={<Login />} /> {/* Login Page */}
      </Routes>
    </Router>
  );
}

export default App;


