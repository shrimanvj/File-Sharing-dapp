import { useState } from "react";
import { ethers } from "ethers";
import "./Display.css";

const Display = ({ contract, account }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const getFiles = async () => {
    setLoading(true);
    const address = document.querySelector(".address").value || account;
    
    try {
      const dataArray = await contract.display(address);
      const isEmpty = Object.keys(dataArray).length === 0;

      if (!isEmpty) {
        const fileArray = dataArray.toString().split(",");
        const filesWithMetadata = fileArray.map((url, index) => {
          // Extract file name from URL
          const fileName = url.split("/").pop() || `File ${index + 1}`;
          return {
            url,
            name: fileName,
            hash: url.split("/").pop().split(".")[0], // Extract IPFS hash
          };
        });
        setFiles(filesWithMetadata);
      } else {
        setFiles([]);
        alert("No files to display");
      }
    } catch (error) {
      console.error("Error fetching files:", error);
      alert("You don't have access to these files");
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const shareFile = async (fileUrl, recipientAddress) => {
    try {
      if (!recipientAddress || !ethers.isAddress(recipientAddress)) {
        throw new Error('Invalid Ethereum address');
      }

      // Show loading state
      const notification = document.createElement('div');
      notification.className = 'share-notification';
      notification.textContent = 'Granting access...';
      document.body.appendChild(notification);

      // Call the allow function to grant access
      const tx = await contract.allow(recipientAddress);
      notification.textContent = 'Waiting for transaction confirmation...';
      
      // Wait for the transaction to be mined
      await tx.wait();
      
      notification.textContent = 'Access granted successfully!';
      notification.style.backgroundColor = '#4BB543';
      setTimeout(() => notification.remove(), 3000);
    } catch (error) {
      console.error('Error sharing access:', error);
      const errorMessage = error.message.includes('user rejected') 
        ? 'Transaction was rejected' 
        : 'Failed to grant access. Please check the address and try again.';
      
      const notification = document.createElement('div');
      notification.className = 'share-notification error';
      notification.textContent = errorMessage;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    }
  };

  return (
    <div className="display-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Enter address to view shared files"
          className="address"
        />
        <button
          className="button"
          onClick={getFiles}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading"></span>
              Loading...
            </>
          ) : (
            "Get Files"
          )}
        </button>
      </div>

      <div className="file-grid">
        {files.map((file, index) => (
          <div key={index} className="file-card">
            <div className="file-info">
              <span className="file-name">{file.name}</span>
              <span className="file-hash">{file.hash}</span>
            </div>
            <div className="file-actions">
              {file.url.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) ? (
                <button
                  className="file-button"
                  onClick={() => setSelectedImage(file.url)}
                >
                  View Image
                </button>
              ) : (
                <button
                  className="file-button"
                  onClick={() => window.open(file.url, "_blank")}
                >
                  View File
                </button>
              )}
              <button
                className="file-button secondary"
                onClick={() => {
                  const recipient = prompt("Enter the Ethereum address to grant access:");
                  if (recipient) {
                    shareFile(file.url, recipient.trim());
                  }
                }}
              >
                Share Access
              </button>
            </div>
          </div>
        ))}
      </div>

      {files.length === 0 && !loading && (
        <div className="empty-state">
          No files to display. Enter an address to view shared files.
        </div>
      )}

      {selectedImage && (
        <div
          className="image-preview-overlay"
          onClick={() => setSelectedImage(null)}
        >
          <div className="image-preview-content" onClick={e => e.stopPropagation()}>
            <button
              className="close-preview"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
            <img
              src={selectedImage}
              alt="Preview"
              className="preview-image"
            />
            <a
              href={selectedImage}
              target="_blank"
              rel="noopener noreferrer"
              className="view-original"
            >
              View Original
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Display;