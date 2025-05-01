import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Decentralized File Sharing</h1>
        <p className="description">
          Securely share your files using blockchain technology. Our decentralized
          application ensures your files are stored safely and can be shared with
          specific wallet addresses.
        </p>
        <div className="features">
          <div className="feature">
            <h3>🔒 Secure Storage</h3>
            <p>Your files are encrypted and stored on IPFS</p>
          </div>
          <div className="feature">
            <h3>⚡ Fast Sharing</h3>
            <p>Share files instantly with any Ethereum address</p>
          </div>
          <div className="feature">
            <h3>🔐 Full Control</h3>
            <p>Maintain complete control over your shared files</p>
          </div>
        </div>
        <div className="auth-buttons">
          <Link to="/login" className="auth-button login">
            Login
          </Link>
          <Link to="/signup" className="auth-button signup">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
