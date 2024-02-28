import React, { useState } from 'react';
import { storage, firestore } from './firebase';
import './ImageUpload.css'; // Import the CSS file for styling

const ImageUpload = ({ userUID, onUpload }) => {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImage(selectedFile);
    }
  };

  const handleUpload = () => {
    if (!image) {
      console.error("No image selected.");
      return;
    }

    const uploadTask = storage.ref(`users/${userUID}/images/${image.name}`).put(image);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(progress);
      },
      (error) => {
        console.error('Error uploading image:', error);
      },
      () => {
        storage.ref(`users/${userUID}/images`).child(image.name).getDownloadURL()
          .then(url => {
            firestore.collection('images').add({
              url,
              userId: userUID
            });
            onUpload(); // Emit event after uploading image
          })
          .catch(error => {
            console.error('Error uploading image to Firestore:', error);
          });
      }
    );
  };

  return (
    <div className="image-upload-container">
    {image && <p className="selected-file-name">{image.name}</p>}
    <label htmlFor="file-upload" className={`choose-file-button${image ? ' uploaded' : ''}`}>
  {image ? 'Change File' : 'Choose File'}
  <input
    type="file"
    id="file-upload"
    accept=".png,.jpg,.jpeg"
    onChange={handleChange}
    className="file-input"
  />
</label>

    {image && <button onClick={handleUpload} className="upload-button">Upload</button>}
    {progress > 0 && (
      <div className="progress-container">
        <progress value={progress} max="100" className="progress-bar" />
        <span className="progress-label">{progress}%</span>
      </div>
    )}
  </div>
  );
};

export default ImageUpload;
