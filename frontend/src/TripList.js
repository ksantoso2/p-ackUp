import React, { useState, useEffect } from 'react';
import './TripList.css';
import slothImg from './images/Group 43.png';
import plantImg from './images/Group 39.png';
import { useNavigate } from 'react-router-dom'



//import { MoveDiagonal } from 'lucide-react';
import { Link } from 'react-router-dom';


const TripList = () => {
  const navigate = useNavigate();
      // 🌱 TODO: Replace with MongoDB data once backend is ready
    const destinations = [
        "Barcelona, Spain",
        "Paris, France",
        "Tokyo, Japan",
        "New York, USA",
        "Newa York, USA",
    ];

    return (
        <div className="trip-list-container">
          <div className="top"><img src={slothImg} alt="sloth" className="sloth-image" /> 
            <div className="navbar">
              <button className="active">Trips</button>
              <button onClick= {() => {navigate('/chat');}}>Plan</button>
            </div>
          </div>
          
          <div className="tree"><img src={plantImg} alt="palms" className="palm-image" /> </div>
          
    
          {/* Cards */}
          <div className = "scroll">
          <div className="destination-card-list">
            {destinations.map((city, index) => (
              <Link
                key={index}
                to={`/trip?location=${encodeURIComponent(city)}`}
                className="destination-card"
              >
                <span className="destination-name">{city}</span>
                <span className="destination-icon">↗</span>
              </Link>
            ))}
          </div>
          </div>
        </div>
      );
    }


export default TripList;
