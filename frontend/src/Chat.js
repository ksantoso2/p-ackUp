import React, { useState } from "react";
import "./Chat.css";
import slothImg from '../src/assets/sloth.svg';
import treeImg from '../src/assets/trees.svg';
import submitImg from '../src/assets/submitbutton.svg';

const Chat = () => {
 const [user_input, set_user_input] = useState("");
 const [response, set_response] = useState("");
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);
 const [history, setHistory] = useState([]);
 const [atBottom, setAtBottom] = useState(false);
//  const [activeTab, setActiveTab] = useState("Plan");


 const handleAPI = async () => {
   if (!user_input.trim()) {
     setError("Input cannot be empty.");
     return;
   }


   setLoading(true);
   setError(null);


   try {
     const res = await fetch("http://127.0.0.1:5000/gemini", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ user_input }),
     });


     if (!res.ok) {
       throw new Error(`HTTP error! Status: ${res.status}`);
     }


     const data = await res.json();
     set_response(data.response);
     setHistory([...history, { question: user_input, answer: data.response }]);
     set_user_input("");
   } catch (err) {
     setError(err.message);
   } finally {
     setLoading(false);
   }


   setAtBottom(true);
 };


 const handleKeyDown = (event) => {
   if (event.key === "Enter") {
     handleAPI();
   }
 };


 return (
   <div className="chat-page">
       {/* <header className="navbar">

          <Link to="/TripList">
            <button className={`nav-button ${activeTab === "Trips" ? "active" : ""}`}
            onClick={() => setActiveTab("Trips")}>
              Trips
            </button>
          </Link>
          <Link to="/Chat">
            <button className={`nav-button ${activeTab === "Plan" ? "active" : ""}`}
            onClick={() => setActiveTab("Plan")}>
              Plan
            </button>
          </Link>
       </header> */}


       {history.length === 0 && (
         <>
           <div className="main-content">
             <h1>Where are we p-ackingUp to?</h1>
           </div>
           <img src={treeImg} alt="tree" className="tree-img" />
         </>
       )}
         <div className="chat-history">
               {history.map((entry, index) => (
                   <div key={index} className="chat-message">
                     <div className="user-message">{entry.question}</div>
                     <div className="bot-message">{entry.answer}</div>
                   </div>
                 ))}
         </div>


       <div className={`input-wrapper ${atBottom ? "at-bottom" : ""}`}>
           <img src={slothImg} alt="sloth" className="sloth-img" />


           <input
               type="text"
               placeholder="Want to explore?"
               value={user_input}
               onChange={(e) => set_user_input(e.target.value)}
               onKeyDown={handleKeyDown}
           />


           <button onClick={handleAPI} className="submit-button">
             <img src={submitImg} alt="Submit" className="submit-icon" />
           </button>
           <button onClick={() => {
             setHistory([]);
             setAtBottom(false);}}>
               New chat
             </button>
         {error && <p className="error">{error}</p>}
       </div>
     </div>
 );
};


export default Chat;
