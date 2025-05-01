import { useParams, NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";
import Chat from './Chat';
import TripList from './TripList';
import PlaneImg from '../src/assets/plane.svg';
import ChatboxImg from '../src/assets/chaticon.svg';


const Navbar = () => {
  const location = useLocation();
  // Getting the username from the current url
  const match = location.pathname.match(/\/(?:triplist|chat|trip)\/([^/]+)/);
  const username = match ? match[1] : null;

  return (
    <nav className="navbar">
      <NavLink to={`/triplist/${username}`} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
        <span className="icon"><img src={PlaneImg} alt="plane" className="plane-img" /></span> Trips
      </NavLink>
      <NavLink to={`/chat/${username}`} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
        <span className="icon"><img src={ChatboxImg} alt="chatbox" className="chat-box-img" /></span> Plan
      </NavLink>
    </nav>
  );
};

export default Navbar;
