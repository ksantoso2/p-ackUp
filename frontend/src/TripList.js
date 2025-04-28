import React, { useState, useEffect } from 'react';
import './TripList.css';
import slothImg from './images/Group 39.png';
import plantImg from './images/Group 43.png';



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
          {/* Decorative images */}
          <img src={slothImg} alt="sloth" className="sloth-image" />
          <img src={plantImg} alt="palms" className="palm-image" />
    
          {/* Top toggle (aesthetic only)
          <div className="toggle-container">
            <div className="toggle-switch">
              <div className="toggle-left">✈️ Trips</div>
              <div className="toggle-right">💬 Plan</div>
            </div>
          </div> */}
    
          {/* Cards */}
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
      );
    }


export default TripList;
