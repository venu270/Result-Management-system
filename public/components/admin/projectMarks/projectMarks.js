import React, { useState } from 'react';
import axios from 'axios';
import Body from './Body';

const UploadProjectMarks = () => {
  const [file, setFile] = useState(null);

  // Update state when a file is selected
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle the file upload submission
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Updated API URL for uploading project marks
      const res = await axios.post('http://localhost:5000/api/admin/upload-marks', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(res.data.message);
      setFile(null); // Clear file input after successful upload
    } catch (err) {
      console.error('Error uploading project marks:', err);
      alert('Error uploading project marks');
    }
  };

  return (
    <div>
      {/* Update heading to reflect Project Marks */}
      <h2>Upload Project Marks</h2>
      <form onSubmit={handleUpload}>
        {/* File input for selecting the file */}
        <input type="file" onChange={handleFileChange} accept=".csv" />
        {/* Button to submit the form and upload file */}
        <button type="submit">Upload</button>
        {/* Body component inclusion */}
        <Body />
      </form>
    </div>
  );
};

export default UploadProjectMarks;
