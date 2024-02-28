import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import ImageGrid from './ImageGrid';
import { useNavigate } from 'react-router-dom';
import './Welcome.css'; // Import the CSS file for styling

const Welcome = () => {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0); // Key to trigger refresh

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate("/");
  };

  const handleUpload = () => {
    // Update the key to trigger refresh
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div className="welcome-container">
        
      <div className="welcome-content">
      <h1>Welcome!</h1>
        <ImageUpload userUID={localStorage.getItem('userUID')} onUpload={handleUpload} />
        <button onClick={handleLogout}>Logout</button>
        <ImageGrid userUID={localStorage.getItem('userUID')} key={refreshKey} />
      </div>
    </div>
  );
};

export default Welcome;
