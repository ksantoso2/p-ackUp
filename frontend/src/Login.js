import React, {useState} from 'react' //to store and update data
import { useNavigate, Link } from 'react-router-dom' // move to next stage
import "./Login.css" // css file


// functional component (JavaScript function) for rendering login page UI
// take: username
// send: request to backend to verify. If found, redirect to next page, if not show error message
const Login = () => {
    const [username, setUsername] = useState(""); // stores given username 
    const [message, setMessage] = useState(""); // set message about status of login
    const navigate = useNavigate(); // react router hood for navigation

    // send user data back to backend server and check if user exists
    const checkUsernameExist = async (inputUsername) => {
        const response = await fetch(`http://127.0.0.1:5000/users/${inputUsername}`);
        console.log("API Response Status:", response.status); // Logs status code
        
        if (response.ok) {
            setMessage('Username exist!')
            localStorage.setItem("username", inputUsername);
            navigate('/chat');
        } else {
            setMessage('Username not found!')
            navigate('/signup');
        }

    }

    // return portion referenced from Connor and Ellie's signup.js for styling/consistency
    return (
        <div className="login-container">
        <div>
        <div style = {{ display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", height:"100vh"}}>
            <div style={{textAlign:"center"}}>
            <h1 style={{marginBottom: "10px"}}>
            Welcome back!
            </h1>
            <h2 style={{marginTop: "10px"}}>
            Let's continue exploring...
            </h2>
            <h3>
                Don't have an account?{" "} 
                { 
                <Link to="/signup" className="signup-link">
                    Sign up!
                </Link> 
                }
            </h3>
            </div>
            
            <input 
            type="text" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style = {{marginBottom: "15px", padding:"10px", width:"200px", borderRadius:"10px", border:"1px solid black"}}
            />
            
            <button 
            onClick={() => checkUsernameExist(username)}
            className = "login-button"
            >
            Login
            </button>
            <img src="/palmtree.png" className="palmtree-image" alt="Tree" />
            <img src="/sloth.png" className="sloth-image" alt="Sloth" />

        
        </div>
        </div>
        </div>
        );
    }

export default Login;
