import React, { useState, useEffect } from 'react';
import './TripList.css';
import slothImg from './images/Group 39.png';
import plantImg from './images/Group 43.png';



//import { MoveDiagonal } from 'lucide-react';
import { Link } from 'react-router-dom';


const TripList = () => {
      // 🌱 TODO: Replace with MongoDB data once backend is ready
    const destinations = [
        "Barcelona, Spain",
        "Paris, France",
        "Tokyo, Japan",
        "New York, USA"
    ];

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
      );
    }


export default TripList;
