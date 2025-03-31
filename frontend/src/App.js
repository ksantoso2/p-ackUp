import CreateUser from './welcome/CreateUser';
import React from 'react';
import Chat from './Chat';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";  //if error run: npm install react-router-dom


// function App() {
//   return (
//     <CreateUser />
//   );
// }


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}


export default App;
