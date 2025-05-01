import React, { useState, useEffect } from 'react';
import './Trip.css';
import { useParams, useNavigate } from 'react-router-dom';


const Trip = () => {
  const { username, tripId } = useParams();
  const [trip, setTrip] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await fetch(`http://localhost:5000/get-itineraries/${username}/${tripId}`);
        const data = await response.json();
        console.log("Trip data:", data);
        setTrip(data);
      } catch (error) {
        console.error("Error fetching trip:", error);
      }
    };

    fetchTrip();
  }, [username, tripId]);

   useEffect(() => {
    if (!trip || !trip.stops) return;
  
    const loadScript = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/maps-key"); // Get key from backend
        const data = await res.json();
        const apiKey = data.key;
  
        if (!apiKey) {
          console.error("Google Maps API key is missing.");
          return;
        }
  
        if (window.google) {
          initMap();
          return;
        }
  
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        document.head.appendChild(script);
      } catch (err) {
        console.error("Failed to load Google Maps API key:", err);
      }
    };
  
    const initMap = () => {
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: {
          lat: trip.stops[0]?.latitude || 0,
          lng: trip.stops[0]?.longitude || 0
        },
        zoom: 12
      });
  
      trip.stops.forEach((stop) => {
        new window.google.maps.Marker({
          position: { lat: stop.latitude, lng: stop.longitude },
          map,
          title: stop.placeName
        });
      });
    };
  
    loadScript();
  }, [trip]);
  

  if (!trip) return <p>Loading...</p>;

  return (
    <div>
      <header className="trip-header">
        
        <header className="navbar">
            <button onClick= {() => {navigate('/TripList');}}>Trips</button>
            <button onClick= {() => {navigate('/chat');}}>Plan</button>
            </header>
            <h1>Barcelona, Spain</h1>
      </header>

      <main className="trip-main">
        <section className="itinerary">
          <div className="itinerary-list">
            {trip.stops.map((stop) => (
              <div key={stop.id}>
                <h3>{stop.placeName}</h3>
                <p><strong>Address:</strong> {stop.address}</p>
                <p><strong>Location:</strong> {stop.city}, {stop.country}</p>
                <p><strong>Latitude:</strong> {stop.latitude} , <strong>Longitude:</strong> {stop.longitude}</p>
                <p><strong>Date:</strong> {stop.date?.split('T')[0]}</p>
                <p><strong>Time:</strong>{stop.timeOfVisit}</p>
                <p><strong>Duration:</strong> {stop.duration}</p>
                <p><strong>Opening Hours:</strong> {stop.openingHours || "N/A"}</p>
                <p><strong>Notes:</strong> {stop.notes}</p>
              </div>
            ))}
          </div>
          {/* <button className="edit-btn">Edit</button> */}
        </section>

        <section className="map">
          <div id="map" className="map-box"></div>
        </section>
      </main>
    </div>
  );
};

export default Trip;
