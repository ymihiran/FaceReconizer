import React, { useState } from 'react';
import { RingLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom'; 
import './SearchFace.css';

function SearchFace() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageName, setSelectedImageName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
    setSelectedImageName(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      const response = await fetch('http://localhost:8075/select_image', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setSelectedImageName(data.name);
      setSelectedImage(data.selected_image);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const goHome = () => {
    navigate('/'); 
  }

  return (
    <div className="container">
      <h1 className="title">Face Recognition</h1>
      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="image" className="label">Select an image:</label><br />
        <input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} className="input" /><br />
        <button type="submit" className="button">Search Database</button>
      </form>
      
      {/* Go Home button */}
      <button onClick={goHome} className="button-2">Go Home</button>

      {isLoading && (
        <div className="loader-container">
          <RingLoader color={'#36D7B7'} loading={isLoading} size={50} />
        </div>
      )}

      {selectedImageName && !isLoading && (
        <div className="selected-image-container">
          <h2 className="subtitle">Best Match</h2>
          <p className="selected-image-details">Name: {selectedImageName || 'Unknown'}</p>
          <img src={`data:image/jpeg;base64,${selectedImage}`} alt="Selected Face" className="selected-image" />
        </div>
        
      )}

    </div>
  );
}

export default SearchFace;
