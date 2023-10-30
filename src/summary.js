import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from "firebase/database";
import './Summary.css'; // Import your CSS file

const firebaseConfig = {
  apiKey: "AIzaSyAoLbzCMkfVx3ZVK-oAEyiPPM8LZFdJiSM",
  authDomain: "legaldoco.firebaseapp.com",
  databaseURL: "https://legaldoco-default-rtdb.firebaseio.com",
  projectId: "legaldoco",
  storageBucket: "legaldoco.appspot.com",
  messagingSenderId: "872048860776",
  appId: "1:872048860776:web:8651efc9af3faf55bce5dd",
  measurementId: "G-9P98NSNEE1"
};

const app = initializeApp(firebaseConfig);

const Summary = () => {
  const location = useLocation();
  const { fileData } = location.state;
  const [fileContent, setFileContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (fileData) {
      
      
      // Create a reference to the Firebase Realtime Database
      const db = getDatabase();
      const flagRef = ref(db, 'flago/flag'); // Replace with your actual flag database path

      const dbRef = ref(db, 'summary/text'); // Replace with your actual database path

      // Listen for changes in the database
      onValue(flagRef, (flagSnapshot) => {
        const flag = flagSnapshot.val();
        console.log('Flag value:', flag); // Add this line for debugging

        if (flag === 1) {
          // Flag is 1, show loading
          setLoading(true);
          console.log(flag)
        } else {
      onValue(dbRef, (snapshot) => {
        if (snapshot.exists()) {
          let tempContent=snapshot.val();
          tempContent=tempContent.split(" ");
          console.log(tempContent);
          setFileContent(tempContent);
          setLoading(false);
        } else {
          console.log('No data available');
        }
      });
    }
  });
}
}, [fileData]);

  // Function to format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
    else return (bytes / 1048576).toFixed(2) + " MB";
  };

  return (
    <div className='containerStyle'>
      <div className='summary-container'>
        <h2>Summary Page</h2>
        {loading ? ( // Display loading indicator for 10 seconds
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
          <div className='summary-container'>
            <h3>***Topic Discussed in Pdf***</h3>
            <div >
              {fileContent.map((content,index)=>{
                if(index==fileContent.length)
                  return(content);
                else
                  return(content+" ");
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Summary;
