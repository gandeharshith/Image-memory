// ImageGrid.js

import React, { useState, useEffect } from 'react';
import { storage } from './firebase';
import { getDownloadURL } from 'firebase/storage';
import { FaTrash, FaEye, FaTimes, FaDownload } from 'react-icons/fa'; // Import FaDownload icon
import './imagegrid.css'; // Import the CSS file for styling

const ImageGrid = ({ userUID }) => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Access the Firebase Storage bucket
        const storageRef = storage.ref(`users/${userUID}/images`);

        // List all items (images) in the specified storage reference
        const imagesRef = await storageRef.listAll();

        // Retrieve download URLs for all images
        const imagesData = await Promise.all(imagesRef.items.map(async item => {
          const url = await item.getDownloadURL();
          return { id: item.name, url };
        }));

        // Update state with the fetched images
        setImages(imagesData);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    // Fetch images when the userUID changes
    fetchImages();
  }, [userUID]);

  const handleDelete = async (id) => {
    try {
      // Access the Firebase Storage bucket
      const storageRef = storage.ref(`users/${userUID}/images/${id}`);
  
      // Delete the image from storage
      await storageRef.delete();
      setSelectedImage(null)
      // Update state by removing the deleted image
      setImages(images.filter(image => image.id !== id));
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleView = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  const handleDownload = async (imageUrl, imageName) => {
    console.log('Downloading:', imageUrl, imageName); // Check if this log appears in the console
  
    try {
      const downloadURL = await getDownloadURL(storage.ref(`users/${userUID}/images/${imageName}`));
      console.log('Download URL:', downloadURL); // Check if this log shows the correct download URL
  
      const response = await fetch(downloadURL, { mode: 'no-cors' });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
  
      const a = document.createElement('a');
      a.href = url;
      a.download = imageName; // Set the download attribute to the image name
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };
  
  

  

  return (
    <div className="image-grid-container">
      {images.map(image => (
        <div key={image.id} className="image-item" onClick={() => handleView(image.url)}>
          <img src={image.url} alt={`Uploaded by user`} />
          <div className="image-overlay">
            <button onClick={() => handleDelete(image.id)} className="delete-button"><FaTrash /></button>
            <button onClick={() => handleDownload(image.url, image.id)} className="download-button"><FaDownload /></button> {/* Add download button */}
          </div>
        </div>
      ))}
      {selectedImage && (
        <div className="enlarged-image-container" onClick={handleClose}>
          <div className="enlarged-image">
            <img src={selectedImage} alt="Enlarged" />
            <button className="close-button" onClick={handleClose}><FaTimes /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGrid;
