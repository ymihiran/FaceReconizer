import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Import CSS file for styling

function HomePage() {
  return (
    <div className="homepage-container">
      <div className="homepage-content">
      <h1 className="homepage-title1">Python</h1>
        <h1 className="homepage-title">Face Recognition System</h1>
        <img src="https://i.gifer.com/V3lD.gif" alt="Face Recognition" style={{ maxWidth: '50%', height: 'auto', marginBottom: '20px' }} />
        <div className="homepage-buttons">
          <Link to="/add-faces" className="homepage-button">
            Add Train Data
          </Link>
          <Link to="/analyze" className="homepage-button">
            Search Face
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
