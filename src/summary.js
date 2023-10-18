import React from 'react';
import { useLocation } from 'react-router-dom';

const Summary = () => {
  const location = useLocation();
  const { fileData } = location.state;

  // Function to format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
    else return (bytes / 1048576).toFixed(2) + " MB";
  };

  return (
    <div className='summary-container'>
      <h2>Summary Page</h2>
      {fileData ? (
        <div>
          <h3>Uploaded File Details:</h3>
          <p><strong>Name:</strong> {fileData.name}</p>
          <p><strong>Type:</strong> {fileData.type}</p>
          <p><strong>Size:</strong> {formatFileSize(fileData.size)}</p>
          {fileData.type.includes('image') || fileData.name.match(/\.(jpg|jpeg|png)$/i) ? (
            <img
              src={URL.createObjectURL(fileData)}
              alt="Uploaded File"
              style={{ maxWidth: '100%' }}
            />
          ) : (
            <p>File type not supported for preview.</p>
          )}
        </div>
      ) : (
        <p>No file data received.</p>
      )}
    </div>
  );
};

export default Summary;
