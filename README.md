# Decentralized File Sharing dApp

A decentralized application (dApp) built on the Ethereum blockchain that allows users to securely upload, store, and share files or images, granting access to specific MetaMask addresses. The dApp leverages blockchain technology and decentralized storage to ensure privacy, security, and user control.

---

## Features
- **File Upload**: Upload files or images to IPFS using Pinata for decentralized storage.
- **Access Control**: Grant access to specific Ethereum addresses through a smart contract.
- **Decentralized Storage**: Store files on IPFS to eliminate reliance on centralized servers.
- **Secure Sharing**: Ensure data privacy and ownership protection.
- **Blockchain Transparency**: Immutable and tamper-proof file metadata stored on the Ethereum blockchain.

---

## Tech Stack
- **Ethereum Blockchain**: Handles smart contract execution and access control.
- **Solidity**: Programming language for writing the smart contract.
- **IPFS & Pinata**: Decentralized file storage and IPFS gateway.
- **ReactJS**: Frontend framework for building the user interface.
- **Ethers.js**: Connects the frontend with the Ethereum blockchain and MetaMask.
- **Hardhat**: Development environment for deploying and testing the smart contract.
- **Axios**: Used for interacting with APIs (e.g., IPFS, Pinata).

---

## System Design
1. **Frontend**: ReactJS handles user interactions, file uploads, and MetaMask integration.
2. **Backend**: Smart contracts (Solidity) enforce file access permissions.
3. **Storage**: IPFS stores files, with hashes recorded on the Ethereum blockchain.
4. **Deployment**: Hardhat manages the deployment and testing of the smart contract.

---

## How It Works
1. **Upload File**: Users upload files or images through the ReactJS interface.
2. **File Storage**: Files are uploaded to IPFS, and a hash is returned.
3. **Access Control**: The file hash and authorized MetaMask addresses are stored in a smart contract.
4. **Secure Sharing**: Only specified addresses can retrieve and view the file.

---