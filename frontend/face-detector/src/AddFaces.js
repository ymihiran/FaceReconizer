import React, { useState } from 'react';
import { RingLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom'; 
import './AddFaces.css';

function AddFaces() {
  const [image, setImage] = useState(null);
  const [detectedFaces, setDetectedFaces] = useState([]);
  const [faceNames, setFaceNames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); 

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
    setDetectedFaces([]);
  };

  const handleNameChange = (event, index) => {
    const newFaceNames = [...faceNames];
    newFaceNames[index] = event.target.value;
    setFaceNames(newFaceNames);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:8075/detect_faces', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      //sleep 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsLoading(false);
      setDetectedFaces(data.detected_faces);
      setFaceNames(Array(data.detected_faces.length).fill(''));
    } catch (error) {
      setErrorMessage('Error detecting faces. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);

    }
  };

  const handleSaveFaces = async () => {
    setErrorMessage('');
    setIsLoading(true);
  
    const formData = new FormData();
    detectedFaces.forEach((face, index) => {
      formData.append('images', face);
      formData.append('names', faceNames[index] || ''); 
    });
  
    try {
      const response = await fetch('http://localhost:8075/save_face', {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        setFaceNames([]);
        setImage(null);
        setDetectedFaces([]);
        navigate('/');
      } else {
        setErrorMessage('Error saving faces. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Error saving faces. Please try again.');
      console.error('Error:', error);
    } finally {
      //sleep 2 seconds

      setTimeout(() => {
        setIsLoading(false);
      }, 2000);

    }
  };
  

  return (
    <div className="container">
      <h1 className="title">Add train Data</h1>
      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="image" className="label">Select an image:</label><br />
        <input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} className="input" /><br />
        <button type="submit" className="button" disabled={!image || isLoading}>{isLoading ? 'Detecting...' : 'Detect Faces'}</button>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </form>

      {detectedFaces.length > 0 && (
        <div className="faces-container">
          <h2 className="subtitle">Detected Faces</h2>
          <div className="faces">
            {detectedFaces.map((face, index) => (
              <div key={index} className="face-inputs">
                <img src={`data:image/png;base64,${face}`} alt={`Detected face ${index}`} className="face" />
                <input
                  type="text"
                  value={faceNames[index] || ''}
                  onChange={(event) => handleNameChange(event, index)}
                  placeholder="Enter name"
                  className="input"
                />
              </div>
            ))}
            <button onClick={handleSaveFaces} className="button" disabled={!faceNames.every(name => name) || isLoading}>{isLoading ? 'Saving...' : 'Save Faces'}</button>
          </div>
        </div>
      )}

      <button onClick={() => navigate('/')} className="button-2" style={{marginTop:'15px'}}>Go Home</button>


      <div className="loader-container">
        <RingLoader color={'#36D7B7'} loading={isLoading} size={50} />
      </div>
    </div>
  );
}

export default AddFaces;
