import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Upload from './artifacts/contracts/Upload.sol/Upload.json';
import FileUpload from './components/FileUpload';
import Display from './components/Display';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Home from './components/Home';
import "./App.css";

// Modified Dashboard component in App.js
function Dashboard({ account, contract, provider }) {
  if (!account) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="app-container">
      <h1>Decentralized File Sharing</h1>
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>

      <p className="account-info">
        Account: {account ? account : "Not connected"}
      </p>
      
      <div className="dashboard-layout">
        <div className="upload-section">
          <FileUpload
            account={account}
            provider={provider}
            contract={contract}
          />
        </div>
        <div className="display-section">
          <Display 
            contract={contract} 
            account={account}
          />
        </div>
      </div>
    </div>
  );
}


function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const initProvider = async () => {
      if (!window.ethereum) {
        console.error("Metamask is not installed");
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });

        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        
        const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        
        setContract(contract);
        setProvider(provider);
      } catch (error) {
        console.error("Failed to connect to Metamask:", error);
      }
    };
    
    initProvider();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <Dashboard
              account={account}
              contract={contract}
              provider={provider}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
