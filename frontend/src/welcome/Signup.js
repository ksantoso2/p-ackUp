import React, {useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import "./Signup.css"

const Signup = () => {
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleUser = async () => {
    if (!username || !age) {
      alert('Both fields are required!');
      return;
    }
    try {
      const response = await fetch('http://127.0.0.1:5000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, age: Number(age) })
      });
      if (!response.ok) {
        const data = await response.json();
        alert(`Signup failed: ${data.error || "Unknown error"}`);
        return;
      }
      const data = await response.json();

      localStorage.setItem("username", data.username);
      localStorage.setItem("age", data.age);
      setMessage("User Created!");
  
      navigate(`/chat/${data.username}`);
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred during signup.");
    }
  };


  return (
    <div className="signup-container">
    <div style = {{ display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", height:"100vh"}}>
      <div style={{textAlign:"center"}}>
      <h1 style={{marginBottom: "10px"}}>
        Welcome!
      </h1>
      <h2 style={{marginTop: "10px"}}>
        Let's start exploring...
      </h2>
      <h3>
                Have an account?{" "} 
                { 
                <Link to="/login" className="login-link">
                    Login!
                </Link> 
                }
            </h3>
      </div>
      <input 
        type="text" 
        placeholder="Enter your username" 
        onChange={(e) => setUsername(e.target.value)}
        required
        style = {{marginBottom: "15px", padding:"10px", width:"200px", borderRadius:"10px", border:"1px solid black"}}
      />
      <input 
        type="number" 
        placeholder="Enter your age" 
        onChange={(e) => setAge(e.target.value)}
        required
        style = {{marginBottom: "15px", padding:"10px", width:"200px", borderRadius:"10px", border:"1px solid black"}}
      />
      <button 
        onClick={handleUser}
        className = "signup-button"
      >
        Sign up
      </button>
      <img src="/palmtree.png" className="palmtree-image" alt="Tree" />
      <img src="/sloth.png" className="sloth-image" alt="Sloth" />
    </div>
    </div>
  );
}

export default Signup