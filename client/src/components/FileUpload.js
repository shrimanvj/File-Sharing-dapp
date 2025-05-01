import { useState } from "react";
import axios from "axios";
import "./FileUpload.css";

const FileUpload = ({ contract, account, provider }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        setIsUploading(true);
        setUploadProgress(25);

        const formData = new FormData();
        formData.append("file", file);

        const notification = document.createElement('div');
        notification.className = 'upload-notification';
        notification.textContent = 'Starting file upload...';
        document.body.appendChild(notification);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `f5d72d301528c18516e2`,
            pinata_secret_api_key: `d1066e001954846f5bacb5ab430e54c50f6e99e1c522b59305f47e53388bbb55`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(25 + (progress * 0.5)); 
          }
        });

        notification.textContent = 'File uploaded to IPFS, processing transaction...';
        setUploadProgress(75);

        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        await contract.add(account, ImgHash);
        
        setUploadProgress(100);
        notification.className = 'upload-notification success';
        notification.textContent = 'File successfully uploaded!';
        
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 3000);

        setFileName("No image selected");
        setFile(null);
      } catch (e) {
        const notification = document.createElement('div');
        notification.className = 'upload-notification error';
        notification.textContent = 'Error uploading file. Please try again.';
        document.body.appendChild(notification);
        
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 3000);
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    }
  };

  const retrieveFile = (e) => {
    const data = e.target.files[0]; 
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(e.target.files[0]);
    };
    setFileName(e.target.files[0].name);
    e.preventDefault();
  };

  return (
    <div className="top">
      <form className="form" onSubmit={handleSubmit}>
        <div className="upload-container">
          <label htmlFor="file-upload" className="choose">
            {file ? ' File Selected' : 'Choose Image'}
          </label>
          <input
            disabled={!account || isUploading}
            type="file"
            id="file-upload"
            name="data"
            onChange={retrieveFile}
            accept="image/*"
          />
          <span className="textArea">{fileName}</span>
          <button type="submit" className="upload" disabled={!file || isUploading}>
            {isUploading ? (
              <span className="upload-status">
                <span className="spinner"></span>
                Uploading... {uploadProgress}%
              </span>
            ) : (
              'Upload File'
            )}
          </button>
        </div>
        {isUploading && (
          <div className="progress-bar">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </form>
    </div>
  );
};

export default FileUpload;