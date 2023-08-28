import React, { useState } from 'react';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadBytes } from "firebase/storage";


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
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      const storage = getStorage();
      const storageRef = ref(storage, selectedFile.name);
      const metadata = {
        contentType: 'image/pdf',
      };


      try {
        await uploadBytes(storageRef, selectedFile).then((snapshot) => {
          console.log('Uploaded a blob or file!');
          alert("file uploaded");
        });

 

        setSelectedFile(null);
      } catch (error) {
        console.error('Error uploading file:', error);
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
          <button className="upload-button" onClick={handleFileUpload}>
            Upload
          </button>
        </div>
        <div className="right-section">
          {/* Add preview content here */}
          {selectedFile && (
          <div className="document-preview">
             {selectedFile && (
      <>
        {selectedFile.type.includes("image") ? (
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Preview"
            style={{ width: "100%", height: "300px" }}
          />
        ) : (
          <iframe
            title="Document Preview"
            src={URL.createObjectURL(selectedFile)}
            width="100%"
            height="500px"
          ></iframe>
        )}
      </>
    )}
          </div>
        )}
          <button className="verify-button">Verify Document</button>
        </div>
      </div>
    </div>
  );
};

export default Body;
