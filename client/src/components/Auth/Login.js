import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to continue');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('Please connect your MetaMask wallet');
      }

      const connectedAddress = accounts[0];

      // Verify if the entered address matches the connected wallet
      if (address.toLowerCase() !== connectedAddress.toLowerCase()) {
        throw new Error('Address does not match your connected wallet');
      }

      // Store the address and navigate to dashboard
      localStorage.setItem('userAddress', connectedAddress);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back!</h2>
          <p>Connect your wallet to access your files</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="address">Wallet Address</label>
            <input
              id="address"
              type="text"
              placeholder="Enter your wallet address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button 
            type="submit" 
            className={`auth-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Connecting...
              </>
            ) : (
              'Connect Wallet'
            )}
          </button>

          <div className="auth-links">
            <p>New to our platform? <Link to="/signup">Sign up</Link></p>
            <Link to="/" className="back-to-home">Back to Home</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
