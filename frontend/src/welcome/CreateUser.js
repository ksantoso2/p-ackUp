import React, {useState} from 'react'

const CreateUser = () => {
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [message, setMessage] = useState('');

  const handleUser = async () => {
    await fetch ('http://127.0.0.1:5000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username, age: Number(age) }), // convert age to integer
    });

    setMessage (`User Created!`); // success message
  }
  return (
    <div>
      <input type = "text" id = "username" name = "username" placeholder = "Username" 
        onChange={(e) => setUsername(e.target.value)}/> 
      <br />
      <input type = "number" id = "age" name = "age" placeholder = "Age"
        onChange={(e) => setAge(e.target.value)}/>
      <br />
      <button onClick={handleUser}>Create User</button>
      <p>{message}</p>
    </div>
  );
}

export default CreateUser