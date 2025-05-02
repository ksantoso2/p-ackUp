import React, { useState, useEffect } from 'react';
import './Trip.css';
import { useParams, useNavigate, useLocation as useRouterLocation } from 'react-router-dom';

const mapLinks = {
  "Barcelona, Spain": "https://www.google.com/maps/d/embed?mid=1SnMqyARUbhKRJjsqTfVPcWXujHyqIuo",
  "Paris, France": "https://www.google.com/maps/d/embed?mid=1iJWnpxOwypoYH4N3ECA9S_s3aMQ&ehbc=2E312F",
  "Tokyo, Japan": "https://www.google.com/maps/d/embed?mid=1Uy_CrLuVukXj3I9NOD7iBlw6OG4&ehbc=2E312F",
  "New York, USA": "https://www.google.com/maps/d/embed?mid=1edmEymbq9TCTFe-wiORi-s3wnopbGmov&hl=en_US&ehbc=2E312F",
  "Newa York, USA": "https://www.google.com/maps/d/embed?mid=1edmEymbq9TCTFe-wiORi-s3wnopbGmov&hl=en_US&ehbc=2E312F"
};

const Trip = () => {
  const { username, tripId } = useParams();
  const [trip, setTrip] = useState('');
  const navigate = useNavigate();

  // ✅ Avoid using the name `location`
  const routerLocation = useRouterLocation();
  const searchParams = new URLSearchParams(routerLocation.search);
  const city = searchParams.get("location");
  const mapUrl = mapLinks[city];


  return (
    <div>
      <header className="trip-header">
        <div className="navbar">
          <button onClick={() => navigate('/TripList')}>Trips</button>
          <button onClick={() => navigate('/chat')}>Plan</button>
        </div>
        <h1>{city}</h1>
      </header>

      <main className="trip-main">
        <section className="itinerary">
          <h2>Itinerary Placeholder</h2>
        </section>

        <section className="map">
          {mapUrl ? (
            <iframe
              title={`${city} Map`}
              src={mapUrl}
              width="100%"
              height="600"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          ) : (
            <p>No map available for {city}.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Trip;