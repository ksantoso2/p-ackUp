import { useParams, NavLink } from "react-router-dom";
import "./Navbar.css";
import Chat from './Chat';
import TripList from './TripList';
import PlaneImg from '../src/assets/plane.svg';
import ChatboxImg from '../src/assets/chaticon.svg';


const Navbar = () => {
  const { username } = useParams();
  return (
    <nav className="navbar">
      <NavLink to={`/trips/${username}`}  className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
        <span className="icon"><img src={PlaneImg} alt="plane" className="plane-img" /></span> Trips
      </NavLink>
      <NavLink to={`/chat/${username}`} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
        <span className="icon"><img src={ChatboxImg} alt="chatbox" className="chat-box-img" /></span> Plan
      </NavLink>
    </nav>
  );
};

export default Navbar;
