import React, { useState } from 'react';
import axios from 'axios';
import Body from './Body';

const UploadAttendance = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Use the full URL for the backend server
      const res = await axios.post('http://localhost:5000/api/admin/upload-attendance', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert('Error uploading attendance');
    }
  };

  return (
    <div>
      <h2></h2>
      <form onSubmit={handleUpload}>
      
      <button type="submit"></button>
      <Body />
      </form>
    </div>
  );
};

export default UploadAttendance;
