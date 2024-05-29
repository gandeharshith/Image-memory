// // ImageGrid.js

// import React, { useState, useEffect } from 'react';
// import { storage } from './firebase';
// import { getDownloadURL } from 'firebase/storage';
// import { FaTrash, FaEye, FaTimes, FaDownload } from 'react-icons/fa'; // Import FaDownload icon
// import './imagegrid.css'; // Import the CSS file for styling

// const ImageGrid = ({ userUID }) => {
//   const [images, setImages] = useState([]);
//   const [selectedImage, setSelectedImage] = useState(null);

//   useEffect(() => {
//     const fetchImages = async () => {
//       try {
//         // Access the Firebase Storage bucket
//         const storageRef = storage.ref(`users/${userUID}/images`);

//         // List all items (images) in the specified storage reference
//         const imagesRef = await storageRef.listAll();

//         // Retrieve download URLs for all images
//         const imagesData = await Promise.all(imagesRef.items.map(async item => {
//           const url = await item.getDownloadURL();
//           return { id: item.name, url };
//         }));

//         // Update state with the fetched images
//         setImages(imagesData);
//       } catch (error) {
//         console.error('Error fetching images:', error);
//       }
//     };

//     // Fetch images when the userUID changes
//     fetchImages();
//   }, [userUID]);

//   const handleDelete = async (id) => {
//     try {
//       // Access the Firebase Storage bucket
//       const storageRef = storage.ref(`users/${userUID}/images/${id}`);
  
//       // Delete the image from storage
//       await storageRef.delete();
//       setSelectedImage(null)
//       // Update state by removing the deleted image
//       setImages(images.filter(image => image.id !== id));
//     } catch (error) {
//       console.error('Error deleting image:', error);
//     }
//   };

//   const handleView = (imageUrl) => {
//     setSelectedImage(imageUrl);
//   };

//   const handleClose = () => {
//     setSelectedImage(null);
//   };

//   const handleDownload = async (imageUrl, imageName) => {
//     console.log('Downloading:', imageUrl, imageName); // Check if this log appears in the console
  
//     try {
//       const downloadURL = await getDownloadURL(storage.ref(`users/${userUID}/images/${imageName}`));
//       console.log('Download URL:', downloadURL); // Check if this log shows the correct download URL
  
//       const response = await fetch(downloadURL, { mode: 'no-cors' });
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
  
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = imageName; // Set the download attribute to the image name
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
  
//       // Clean up the object URL
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Error downloading image:', error);
//     }
//   };
  
  

  

//   return (
//     <div className="image-grid-container">
//       {images.map(image => (
//         <div key={image.id} className="image-item" onClick={() => handleView(image.url)}>
//           <img src={image.url} alt={`Uploaded by user`} />
//           <div className="image-overlay">
//             <button onClick={() => handleDelete(image.id)} className="delete-button"><FaTrash /></button>
//             <button onClick={() => handleDownload(image.url, image.id)} className="download-button"><FaDownload /></button> {/* Add download button */}
//           </div>
//         </div>
//       ))}
//       {selectedImage && (
//         <div className="enlarged-image-container" onClick={handleClose}>
//           <div className="enlarged-image">
//             <img src={selectedImage} alt="Enlarged" />
//             <button className="close-button" onClick={handleClose}><FaTimes /></button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ImageGrid;









// ImageGrid.js

import React, { useState, useEffect } from 'react';
import { storage } from './firebase';
import { FaTrash, FaTimes, FaFileAlt } from 'react-icons/fa'; // Removed FaDownload
import './imagegrid.css'; // Import the CSS file for styling

const ImageGrid = ({ userUID }) => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const storageRef = storage.ref(`users/${userUID}/files`);
        const filesRef = await storageRef.listAll();

        const filesData = await Promise.all(filesRef.items.map(async item => {
          const url = await item.getDownloadURL();
          const metadata = await item.getMetadata();
          return { id: item.name, url, type: metadata.contentType };
        }));

        setFiles(filesData);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, [userUID]);

  const handleDelete = async (id) => {
    try {
      const storageRef = storage.ref(`users/${userUID}/files/${id}`);
      await storageRef.delete();
      setSelectedFile(null);
      setFiles(files.filter(file => file.id !== id));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleView = (fileUrl, fileType) => {
    setSelectedFile(fileUrl);
    setSelectedFileType(fileType);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setSelectedFileType(null);
  };

  return (
    <div className="file-grid-container">
      {files.map(file => (
        <div key={file.id} className="file-item" onClick={() => handleView(file.url, file.type)}>
          {file.type.startsWith('image/') ? (
            <img src={file.url} alt={`Uploaded by user`} />
          ) : (
            <div className="file-preview">
              <FaFileAlt className="file-icon" />
              <p>{file.id}</p>
            </div>
          )}
          <div className="file-overlay">
            <button onClick={(e) => { e.stopPropagation(); handleDelete(file.id); }} className="delete-button"><FaTrash /></button>
          </div>
        </div>
      ))}
      {selectedFile && selectedFileType.startsWith('image/') && (
        <div className="enlarged-file-container" onClick={handleClose}>
          <div className="enlarged-file">
            <img src={selectedFile} alt="Enlarged" />
            <button className="close-button" onClick={handleClose}><FaTimes /></button>
          </div>
        </div>
      )}
      {selectedFile && selectedFileType === 'text/plain' && (
        <div className="enlarged-file-container" onClick={handleClose}>
          <div className="enlarged-file">
            <iframe src={selectedFile} title="Enlarged Text File" className="text-file-viewer" />
            <button className="close-button" onClick={handleClose}><FaTimes /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGrid;

