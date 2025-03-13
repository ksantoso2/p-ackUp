import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'

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

    setMessage (`User Created!`); // success message
    navigate('/chat'); // redirect
  }

  return (
    <div style = {{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh"}}>
      <input 
        type="text" 
        placeholder="Username" 
        onChange={(e) => setUsername(e.target.value)}
        style = {{marginBottom: "15px", padding: "8px", width: "210px"}}
      />
      <input 
        type="number" 
        placeholder="Age" 
        onChange={(e) => setAge(e.target.value)}
        style = {{marginBottom: "15px", padding: "8px", width: "210px"}}
      />
      <button 
        onClick={handleUser}
        style= {{padding: "8px 15px"}}
      >
        Create User
      </button>
      <p>{message}</p>
    </div>
  );
}

export default Signup