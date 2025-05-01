import React, { useState, useEffect } from 'react';
import './TripList.css';
import slothImg from './images/Group 43.png';
import plantImg from './images/Group 39.png';
import PlaneImg from '../src/assets/plane.svg';
import ChatboxImg from '../src/assets/chaticon.svg';


//import { MoveDiagonal } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';


const TripList = () => {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();
  const { username } = useParams();

  useEffect(() => {
    // getting the itineraries from backend
    const fetchTrips = async () => {
      try {
        const response = await fetch(`http://localhost:5000/${username}/get-itineraries`);
        const data = await response.json();
        setTrips(data);
      } catch (error) {
        console.error('Error fetching trips:', error);
      }
    };

    fetchTrips();
  }, [username]);

  const handleClick = (tripId) => {
    navigate(`/trip/${username}/${tripId}`);
  };


    return (
        <div className="trip-list-container">
          <div className="top"><img src={slothImg} alt="sloth" className="sloth-image" /> 
            <div className="navbar">
              <button
                            onClick={() => navigate(`/triplist/${username}`)}
                            className={`nav-link ${window.location.pathname.includes("triplist") ? "active" : ""}`}
                          >
                            <span className="icon">
                              <img src={PlaneImg} alt="plane" className="plane-img" />
                            </span>
                            Trips
                          </button>
                          <button
                            onClick={() => navigate(`/chat/${username}`)}
                            className={`nav-link ${window.location.pathname.includes("chat") ? "active" : ""}`}
                          >
                            <span className="icon">
                              <img src={ChatboxImg} alt="chatbox" className="chat-box-img" />
                            </span>
                            Plan
                          </button>
            </div>
          </div>
          
          <div className="tree"><img src={plantImg} alt="palms" className="palm-image" /> </div>
          
    
          {/* Cards */}
          <div className = "scroll">
          <div className="destination-card-list">
            {Array.isArray(trips) ? (
              trips.map((trip) => (
                <div
                  key={trip.id}
                  className="destination-card"
                  onClick={() => handleClick(trip.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="destination-name">{trip.name}</span>
                  <span className="destination-icon">↗</span>
                </div>
              ))
            ) : (
              <p>No trips found.</p>
            )}
          </div>
          </div>
        </div>
      );
    }


export default TripList;
