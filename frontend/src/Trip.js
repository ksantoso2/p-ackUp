import React, { useState, useEffect } from 'react';
import './Trip.css';
import TripList from './TripList';
import Chat from './Chat';
import {Link} from "react-router-dom"

const Trip = () => {
  const [tripName, setTripName] = useState('My Awesome Trip');

  useEffect(() => {
    // Load Google Maps script
    const loadScript = () => {
      if (window.google) {
        initMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    };

    const initMap = () => {
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: 41.3851, lng: 2.1734 }, // Barcelona coords
        zoom: 12,
      });

      new window.google.maps.Marker({
        position: { lat: 41.3851, lng: 2.1734 },
        map,
        title: 'Barcelona',
      });
    };

    loadScript();
  }, []);

  return (
    <div>
      <header className="trip-header">
        <h1>Barcelona, Spain</h1>
        <div className="nav-buttons">
        <Link to="/TripList">
          <button>Trips</button>
        </Link>
        <Link to="/Chat">
            <button>Plan</button>
        </Link>
          
        </div>
      </header>

      <main className="trip-main">
        <section className="itinerary">
          <h2>Itinerary: Saturday, July 17</h2>
          <div className="itinerary-list">
            {/* Itinerary items */}
          </div>
          <button className="edit-btn">Edit</button>
        </section>

        <section className="map">
          <div id="map" className="map-box"></div>
        </section>
      </main>
    </div>
  );
};

export default Trip;
