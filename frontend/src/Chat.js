
import React, { useState } from "react";
import "./Chat.css";
import slothImg from '../src/assets/sloth.svg';
import treeImg from '../src/assets/trees.svg';
import submitImg from '../src/assets/submitbutton.svg';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom'


const Chat = () => {
  const [user_input, set_user_input] = useState("");
  const [response, set_response] = useState("");
  const [test, set_test] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [atBottom, setAtBottom] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const navigate = useNavigate();

  
  // localStorage.setItem("username", "sal");
    const username = localStorage.getItem("username");

  const handleAPI = async () => {
    setShowTyping(true);
    if (!user_input.trim()) {
      setError("Input cannot be empty.");
      return;
    }

    setLoading(true);
    setError(null);

    const newHistory = [...history, { question: user_input, answer: "" }];
    setHistory(newHistory);
    set_response("");
    setAtBottom(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let fullText = "";
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n\n");
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const json = JSON.parse(line.replace("data: ", ""));
              fullText += json.text;
              setShowTyping(false);
              setHistory((prev) => {
                const updated = [...prev];
                const lastIndex = updated.length - 1;
                updated[lastIndex] = {
                  ...updated[lastIndex],
                  answer: fullText
                };
                return updated;
              });
            } catch (err) {
              console.error("Error parsing", err);
            }
          }
        }
      }

      set_response(fullText);
      set_user_input("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setShowTyping(false);
      setAtBottom(true);
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
          } catch (err) {
              setError(err.message);
          } finally {
              setLoading(false);
          }
      };

//   const handleMakeTrip = async () => {
//     if (history.length === 0) {
//       setError("No chat history to make a trip from.");
//       return;
//     }
//     setLoading(true);
//     setError(null);
//     console.log("Etestinput:");

//     try {
//       // Call the makeTrip API to get the generated trip data
//       const res = await fetch('http://127.0.0.1:5000/gemini/makeTrip', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ history }),
//       });

//       if (!res.ok) {
//         throw new Error(`HTTP error! Status: ${res.status}`);
//       }

//       // Parse the response from the makeTrip API
//       const tripData = await res.json();
//       console.log("Trip data received from /gemini/makeTrip:", tripData);

//       // Check if the response is empty or has no required fields
//       if (!tripData.response || !tripData.response.tripDestination || !tripData.response.visits) {
//         throw new Error("Invalid response format from /gemini/makeTrip.");
//       }
//       console.log("Entering exampleFunction with input:");
//       // Send the trip data to /itineraries to save it in MongoDB
//       const itineraryRes = await fetch('http://127.0.0.1:5000/itineraries', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           userName: localStorage.getItem("username"), // Assuming username is saved in localStorage
//           tripDestination: tripData.response.tripDestination, // Assuming the response includes a tripDestination
//           visits: tripData.response.visits, // Assuming the response includes a "visits" field
//         }),
//       });
//       console.log("aaaaaaaaaaaaaaaaa");

//       if (!itineraryRes.ok) {
//         throw new Error(`HTTP error while saving itinerary! Status: ${itineraryRes.status}`);
//       }

//       const savedItinerary = await itineraryRes.json();
//       console.log("Itinerary saved:", savedItinerary);

//       // Optional: Handle the saved itinerary response (e.g., display confirmation, clear chat, etc.)
//       navigate('/TripList');  // Navigate to the Trip List page

//     } catch (err) {
//       setError(err.message);
//       console.error("Error during makeTrip process:", err); // Log the error to the console for debugging
//     } finally {
//       setLoading(false);
//     }
// };

// const handleMakeTrip = async () => {
//   if (history.length === 0) {
//       setError("No chat history to make a trip from.");
//       return;
//   }
//   setLoading(true);
//   setError(null);

//   try {
//       // Prepare your trip data (this should be handled in your app)
//       const tripData = {
//         "userName": "Traveler",
//         "tripDestination": "Wisconsin",
//         "visits": [
//           {
//             "placeName": "Lakefront Brewery",
//             "latitude": 43.0509,
//             "longitude": -87.8974,
//             "address": "1872 N Commerce St, Milwaukee, WI 53212",
//             "media": [],
//             "openingHours": "Varies, check website",
//             "city": "Milwaukee",
//             "country": "USA",
//             "date": "2024-07-20T09:00:00Z",
//             "timeOfVisit": "9:00 AM",
//             "duration": "3 hours",
//             "notes": "Book tour in advance for a fun, interactive experience."
//           },
//           ]
//       };

//       // Send the prepared trip data to the /itineraries route
//       const saveRes = await fetch('http://127.0.0.1:5000/itineraries', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(tripData),
//       });

//       if (!saveRes.ok) {
//           throw new Error(`HTTP error! Status: ${saveRes.status}`);
//       }

//       const saveResponse = await saveRes.json();
//       console.log("Itinerary saved:", saveResponse);

//       // Optional: Navigate to the Trip List page or show success
//       navigate('/TripList');

//   } catch (err) {
//       setError(err.message);
//       console.error("Error during saveItinerary process:", err);
//   } finally {
//       setLoading(false);
//   }
// };

// const handleMakeTrip = async () => {
//   if (history.length === 0) {
//       setError("No chat history to make a trip from.");
//       return;
//   }
//   setLoading(true);
//   setError(null);

//   try {
//       // Step 1: Call the Gemini makeTrip route
//       const geminiRes = await fetch('http://127.0.0.1:5000/gemini/makeTrip', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ history }),
//       });

//       if (!geminiRes.ok) {
//           throw new Error(`Gemini error! Status: ${geminiRes.status}`);
//       }

//       const tripData = await geminiRes.json();

//       // Step 2: Send the returned trip data to the /itineraries route
//       const saveRes = await fetch('http://127.0.0.1:5000/itineraries', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(tripData),
//       });

//       if (!saveRes.ok) {
//           throw new Error(`Save error! Status: ${saveRes.status}`);
//       }

//       const saveResponse = await saveRes.json();
//       console.log("Itinerary saved:", saveResponse);

//       // Optional: Redirect to trip list page
//       navigate('/TripList');

//   } catch (err) {
//       setError(err.message);
//       console.error("Error making and saving trip:", err);
//   } finally {
//       setLoading(false);
//   }
// };


  
  
      

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleAPI();
    }
  };

  return (
    
    <div className="chat-page">
        <header className="navbar">
            <button onClick= {() => {navigate('/TripList');}}>Trips</button>
            <button className="active">Plan</button>
            <button onClick={() => {
                handleMakeTrip();
                // setHistory([]); 
                // setAtBottom(false);
                // navigate('/TripList');}}>
            }}>
                  Make Trip!</button>
        </header>

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
                      <div className="bot-message">
                        <ReactMarkdown>{entry.answer}</ReactMarkdown>
                      </div>

                    </div>
                  ))}

                  {showTyping && (
                    <div className="chat-message">
                      <div className="bot-message"> The Sloth is typing...</div>
                    </div>
                  )}
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
          {error && <p className="error">{error}</p>}
        </div>
      </div>
  );
};

export default Chat;
