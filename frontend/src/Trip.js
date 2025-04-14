import React, { useState } from 'react';
import './Trip.css';

const Trip = () => {
    const [tripName, setTripName] = useState('My Awesome Trip');
  
    return (
    <div>
      <header className="trip-header">
        <h1>Barcelona, Spain</h1> {/* Need to call from database **/}
        <div className="nav-buttons">
          <button>Trips</button>
          <button>Plan</button>
        </div>
      </header>

      <main className="trip-main">
        <section className="itinerary">
          <h2>Itinerary: Saturday, July 17</h2> {/* Need to call from database */}
          <div className="itinerary-list">
            {/* {itinerary.map((item, index) => (
              <div key={index} className="itinerary-item">
                <div className="time">{item.start_time} – {item.end_time}</div>
                <div className="activity">{item.activity}</div>
              </div>
            ))} */}
          </div>
          <button className="edit-btn">Edit</button>
          {/* <button onClick={downloadCSV} className="csv-btn">.csv file</button> */}
        </section>

        <section className="map">
          <div id="map" className="map-box"></div>
        </section>
      </main>
    </div>
    );
  };
  
  export default Trip;