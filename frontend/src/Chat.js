import React, { useState } from "react";
import "./Chat.css";
import slothImg from '../src/assets/sloth.svg';
import treeImg from '../src/assets/trees.svg';
import submitImg from '../src/assets/submitbutton.svg';
import ReactMarkdown from 'react-markdown'

const Chat = () => {
  const [user_input, set_user_input] = useState("");
  const [response, set_response] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [atBottom, setAtBottom] = useState(false);
  const [showTyping, setShowTyping] = useState(false);

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
        body: JSON.stringify({ 
          user_input,
          history: history.map(h => ({ role: "user", content: h.question })).flatMap((msg, i) => [
            msg,
            {role: "assistant", content:history[i].answer}
          ])
        }),
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

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleAPI();
    }
  };

  return (
    <div className="chat-page">
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
                      <div className="bot-message"><ReactMarkdown>{entry.answer}</ReactMarkdown></div> 
                    </div>
                  ))}

                  {showTyping && (
                    <div className="chat-message">
                      <div className="bot-message"> The Sloth is Thinking...</div>
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