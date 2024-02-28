// UserImages.js

import React, { useState, useEffect } from 'react';
import { storage, firestore } from './firebase';

const UserImages = ({ currentUser }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore.collection('images')
      .where('userId', '==', currentUser.uid)
      .onSnapshot(snapshot => {
        const userImages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setImages(userImages);
      });

    return () => unsubscribe();
  }, [currentUser]);

  const handleDelete = (id, imageName) => {
    // Delete image from Firebase Storage
    storage.ref(`images/${imageName}`).delete()
      .then(() => {
        // Delete image document from Firestore
        firestore.collection('images').doc(id).delete();
      })
      .catch(error => {
        console.error('Error deleting image: ', error);
      });
  };

  return (
    <div>
      {images.map(image => (
        <div key={image.id}>
          <img src={image.url} alt="Uploaded" style={{ width: '300px' }} />
          <button onClick={() => handleDelete(image.id, image.url)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default UserImages;
