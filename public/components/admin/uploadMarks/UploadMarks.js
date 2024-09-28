import React, { useState } from 'react';
import axios from 'axios';
import Body from './Body';

const UploadMarks = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/api/admin/upload-Marks', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(res.data.message);
      setFile(null); // Clear file after upload
    } catch (err) {
      console.error(err);
      setError('Error uploading marks');
    }
  };

  return (
    <div>
      <h2>Upload Marks</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
        <Body /> 
      </form>
    </div>
  );
};

export default UploadMarks;
