import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import "./Signup.css"

const Signup = () => {
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleUser = async () => {
    await fetch ('http://127.0.0.1:5000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username, age: Number(age) }), // convert age to integer
    });
    if (!username || !age){
      alert('Both fields are required!');
      return;
    }

    setMessage (`User Created!`); // success message
    navigate('/chat'); // redirect
  }


  return (
  <div>
    <div style = {{ display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", height:"100vh"}}>
      <div style={{textAlign:"center"}}>
      <h1 style={{marginBottom: "10px"}}>
        Welcome!
      </h1>
      <h2 style={{marginTop: "10px"}}>
        Let's start exploring...
      </h2>
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
        style = {{padding:"10px 20px", borderRadius:"50px", border:"none"}}
      >
        Create User
      </button>
      <p>{message}</p>
    </div>
    </div>
  );
}

export default Signup