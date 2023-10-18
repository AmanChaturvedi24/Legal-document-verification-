import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadBytes,getDownloadURL  } from "firebase/storage";
import './Body.css';
import {useNavigate} from 'react-router-dom';

const firebaseConfig = {
  apiKey: "AIzaSyAoLbzCMkfVx3ZVK-oAEyiPPM8LZFdJiSM",
  authDomain: "legaldoco.firebaseapp.com",
  projectId: "legaldoco",
  storageBucket: "legaldoco.appspot.com",
  messagingSenderId: "872048860776",
  appId: "1:872048860776:web:8651efc9af3faf55bce5dd",
  measurementId: "G-9P98NSNEE1"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);



const Body = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [showNotification, setShowNotification] = useState(false); 
  const [previewUrl, setPreviewUrl] = useState(null); // To store the preview URL
  const [notificationMessage, setNotificationMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uniqueKey, setUniqueKey] = useState(Date.now()); // Unique key for fetching images
  const [tempSelectedFile, setTempSelectedFile] = useState(null); // Temporary storage for the selected file

  useEffect(() => {
    // When selectedFile or uniqueKey changes, update the preview URL
    if (selectedFile) {
      setPreviewUrl(null); // Clear the previous preview

      // Generate a unique key to force re-fetching the image
      setUniqueKey(Date.now());
    }
  }, [selectedFile, uniqueKey]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const handleClick = (event) => {
    if (previewUrl) {
      console.log(tempSelectedFile)
      navigate('/summary', { state: { fileData: tempSelectedFile } });
    } else {
      setNotificationMessage('Please choose a file to upload.');
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }

  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      const storage = getStorage();
      const storageRef = ref(storage, selectedFile.name);
      const metadata = {
        contentType: 'image/pdf',
      };
     
      try {
        setUploading(true);

        await uploadBytes(storageRef, selectedFile);
        const downloadURL = await getDownloadURL(storageRef);
        setPreviewUrl(downloadURL);
        setTempSelectedFile(selectedFile);

          // console.log('Uploaded a blob or file!');
          // alert("file uploaded");
          setNotificationMessage('File uploaded successfully!');
          setShowNotification(true);
          setTimeout(() => {
            setShowNotification(false);
          }, 3000);
          setUploading(false);


 

        setSelectedFile(null);
      } catch (error) {
        console.error('Error uploading file:', error);
        setNotificationMessage(`Error: ${error.message}`);
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 3000);
        setUploading(false);

      }      
    }
    else {
      console.log("else mai hun ")
      alert("choose something first")
    }

    

  };

  return (
    <div className="body-container">
      <h2>Upload Legal Document</h2>
      <div className="content-container">
      <div className="left-section">
          <label htmlFor="fileInput" className="input-label">
            Choose File
            <input
              type="file"
              id="fileInput"
              className="input-file"
              accept=".jpg, .jpeg, .png, .pdf"
              onChange={handleFileChange}
            />
          </label>
          <p className="selected-file">{selectedFile ? `Selected file: ${selectedFile.name}` : 'No file chosen'}</p>
          <button className={`upload-button ${uploading ? 'uploading' : ''}`} onClick={handleFileUpload}>
            {uploading ? 'Uploading..' : 'Upload'}
          </button>
          {showNotification && (
        <div className="notification">
              <p>{notificationMessage}</p>
        </div>
      )}
        </div>
        <div className="right-section">
        {previewUrl === null && (
            <p>Preview Of Uploaded File</p>
          )}
          {uploading ? (
            <div className="document-preview">
              <div className="loader">
                <div className="loader-inner">
                  <div className="loader-line-wrap">
                    <div className="loader-line"></div>
                  </div>
                  <div className="loader-line-wrap">
                    <div className="loader-line"></div>
                  </div>
                  <div className="loader-line-wrap">
                    <div className="loader-line"></div>
                  </div>
                  <div className="loader-line-wrap">
                    <div className="loader-line"></div>
                  </div>
                  <div className="loader-line-wrap">
                    <div className="loader-line"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Display the uploaded file preview
            previewUrl && (
              <div className="document-preview">
                {selectedFile && (selectedFile.type.includes('image') || selectedFile.name.match(/\.(jpg|jpeg|png)$/i)) ? (
                  <img
                  src={`${previewUrl}?${uniqueKey}`} 
                    alt="Preview"
                    style={{ width: "100%", height: "300px" }}
                  />
                ) : (
                  <iframe
                    title="Document Preview"
                    src={previewUrl}
                    width="100%"
                    height="500px"
                  ></iframe>
                )}
              </div>
            )
          )}
          <button
          onClick={handleClick}
  className="verify-button" 
>Verify Document</button>
        </div>
      </div>
    </div>
  );
};

export default Body;
