
// import React, { useState } from 'react';
// import './Chat.css';


// const Chat = () => {
//     const [user_input, set_user_input] = useState('');
//     const [response, set_response] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [history, setHistory] = useState([]);

//     const handleAPI = async () => {
//         if (!user_input.trim()) {
//             setError("Input cannot be empty.");
//             return;
//         }

//         setLoading(true);
//         setError(null);

//         try {
//             const res = await fetch('http://127.0.0.1:5000/gemini', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ user_input }),
//             });

//             if (!res.ok) {
//                 throw new Error(`HTTP error! Status: ${res.status}`);
//             }

//             const data = await res.json();
//             set_response(data.response);
//             setHistory([...history, { question: user_input, answer: data.response }]); 
//             set_user_input('');
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleKeyPress = (event) => {
//         if (event.key === 'Enter') {
//             handleAPI();
//         }
//     };

//     return (
//         <section className="main">
    
//         <div className = "column left">
//             <h1>p-ackUp</h1>
//             <button background-color="808080">Trips</button>
//             <button >Plan</button>
//         </div>
        
//         <div className = "column right">
//         <div className="chat-container">
//             <section className="sidebar">
//                 <div className="history">
//                     {history.map((entry, index) => (
//                         <p key={index}><strong>You:</strong> {entry.question} <br /> <strong>Bot:</strong> {entry.answer}</p>
//                     ))}
//                 </div>
//             </section>
//                 <div className="bottom-section">
//                     <div className="input-container">
//                         <input
//                             type="text"
//                             placeholder="Enter your trip question"
//                             value={user_input}
//                             onChange={(e) => set_user_input(e.target.value)}
//                             onKeyPress={handleKeyPress}
//                             autoFocus
//                         />
//                         </div>
//                          <div id="submit" onClick={handleAPI}>
//                             <svg viewBox="0 0 24 24" width="24" height="24">
//                                 <path fill="currentColor" d="M12 4l-8 8h6v8h4v-8h6z"></path>
//                             </svg>
//                         </div>

//                         <div className = "new-chat">
//                         <button onClick={() => setHistory([])}>New chat</button>
//                     </div>
//                 </div>

//                 {error && <p className="error">{error}</p>}
//         </div>
//         </div>
//         </section>

//     )
// };

// export default Chat;


import React, { useState } from 'react';
import './Chat.css';

const Chat = () => {
    const [user_input, set_user_input] = useState('');
    const [response, set_response] = useState('');
    const [test, set_test] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [history, setHistory] = useState([]);

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
            setHistory(prev => [...prev, { question: user_input, answer: data.response }]);
            set_user_input('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleMakeTrip = async () => {
        if (history.length === 0) {
            setError("No chat history to make a trip from.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch('http://127.0.0.1:5000/gemini/makeTrip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ history }),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();
            alert("Trip JSON created! Check the console or server response.");
            console.log("Trip JSON:", data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleAPI();
        }
    };

    return (
        <section className="main">
            <div className="column left">
                <h1>p-ackUp</h1>
                <button style={{ backgroundColor: '#808080' }}>Trips</button>
                <button>Plan</button>
            </div>

            <div className="column right">
                <div className="chat-container">
                    <section className="sidebar">
                        <div className="history">
                            {history.map((entry, index) => (
                                <p key={index}>
                                    <strong>You:</strong> {entry.question} <br />
                                    <strong>Bot:</strong> {entry.answer}
                                </p>
                            ))}
                        </div>
                    </section>

                    <div className="bottom-section">
                        <div className="input-container">
                            <input
                                type="text"
                                placeholder="Enter your trip question"
                                value={user_input}
                                onChange={(e) => set_user_input(e.target.value)}
                                onKeyPress={handleKeyPress}
                                autoFocus
                            />
                        </div>
                        <div id="submit" onClick={handleAPI}>
                            <svg viewBox="0 0 24 24" width="24" height="24">
                                <path fill="currentColor" d="M12 4l-8 8h6v8h4v-8h6z"></path>
                            </svg>
                        </div>

                        <div className="new-chat">
                            <button onClick={() => setHistory([])}>New chat</button>
                        </div>
                        <div className="new-make-trip">
                            <button onClick={handleMakeTrip}>Make Trip!</button>
                        </div>
                    </div>

                    {loading && <p className="loading">Loading...</p>}
                    {error && <p className="error">{error}</p>}
                </div>
                <div className="json-preview">
                <h3>Trip JSON Preview</h3>
                <pre>{JSON.stringify(history, null, 2)}</pre>
                </div>

            </div>
        </section>
    );

};

export default Chat;
