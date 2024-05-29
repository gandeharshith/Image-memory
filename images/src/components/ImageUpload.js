// import React, { useState } from 'react';
// import { storage, firestore } from './firebase';
// import './ImageUpload.css'; // Import the CSS file for styling

// const ImageUpload = ({ userUID, onUpload }) => {
//   const [images, setImages] = useState([]);
//   const [progress, setProgress] = useState(0);

//   const handleChange = (e) => {
//     const selectedFiles = e.target.files;
//     if (selectedFiles.length > 0) {
//       const fileList = Array.from(selectedFiles);
//       setImages(fileList);
//     }
//   };

//   const handleUpload = () => {
//     if (images.length === 0) {
//       console.error("No images selected.");
//       return;
//     }

//     images.forEach((image, index) => {
//       const uploadTask = storage.ref(`users/${userUID}/images/${image.name}`).put(image);

//       uploadTask.on('state_changed',
//         (snapshot) => {
//           const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
//           setProgress(progress);
//         },
//         (error) => {
//           console.error('Error uploading image:', error);
//         },
//         () => {
//           storage.ref(`users/${userUID}/images`).child(image.name).getDownloadURL()
//             .then(url => {
//               firestore.collection('images').add({
//                 url,
//                 userId: userUID
//               });
//               onUpload(image.name); // Pass the image name to the onUpload callback
//               // Remove the uploaded image from the state
//               setImages(prevImages => prevImages.filter((_, i) => i !== index));
//               // Clear progress after 10 seconds
//               setTimeout(() => {
//                 setProgress(0);
//               }, 10000);
//             })
//             .catch(error => {
//               console.error('Error uploading image to Firestore:', error);
//             });
//         }
//       );
//     });
//   };

//   return (
//     <div className="image-upload-container">
//       {images.length > 0 && images.map((image, index) => (
//         <p key={index} className="selected-file-name">{image.name}</p>
//       ))}
//       <label htmlFor="file-upload" className={`choose-file-button${images.length > 0 ? ' uploaded' : ''}`}>
//         {images.length > 0 ? 'Change Files' : 'Choose Files'}
//         <input
//           type="file"
//           id="file-upload"
//           accept=".png"
//           onChange={handleChange}
//           className="file-input"
//           multiple 
//         />
//       </label>

//       {images.length > 0 && <button onClick={handleUpload} className="upload-button">Upload</button>}
//       {progress > 0 && (
//         <div className="progress-container">
//           <progress value={progress} max="100" className="progress-bar" />
//           <span className="progress-label">{progress}%</span>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ImageUpload;




import React, { useState } from 'react';
import { storage, firestore } from './firebase';
import './ImageUpload.css'; // Import the CSS file for styling

const ImageUpload = ({ userUID, onUpload }) => {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles.length > 0) {
      const fileList = Array.from(selectedFiles);
      setFiles(fileList);
    }
  };

  const handleUpload = () => {
    if (files.length === 0) {
      console.error("No files selected.");
      return;
    }

    files.forEach((file, index) => {
      const uploadTask = storage.ref(`users/${userUID}/uploads/${file.name}`).put(file);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(progress);
        },
        (error) => {
          console.error('Error uploading file:', error);
        },
        () => {
          storage.ref(`users/${userUID}/uploads`).child(file.name).getDownloadURL()
            .then(url => {
              firestore.collection('uploads').add({
                url,
                userId: userUID,
                type: file.type
              });
              onUpload(file.name); // Pass the file name to the onUpload callback
              // Remove the uploaded file from the state
              setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
              // Clear progress after 10 seconds
              setTimeout(() => {
                setProgress(0);
              }, 10000);
            })
            .catch(error => {
              console.error('Error uploading file to Firestore:', error);
            });
        }
      );
    });
  };

  return (
    <div className="image-upload-container">
      {files.length > 0 && files.map((file, index) => (
        <p key={index} className="selected-file-name">{file.name}</p>
      ))}
      <label htmlFor="file-upload" className={`choose-file-button${files.length > 0 ? ' uploaded' : ''}`}>
        {files.length > 0 ? 'Change Files' : 'Choose Files'}
        <input
          type="file"
          id="file-upload"
          accept=".png,.txt" // Allow .png and .txt files
          onChange={handleChange}
          className="file-input"
          multiple 
        />
      </label>

      {files.length > 0 && <button onClick={handleUpload} className="upload-button">Upload</button>}
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
