import React from 'react';
import { Link } from 'react-router-dom';

const SellerDashboard = () => {
  return (
    <div style={layoutStyle}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <h2 style={navTitleStyle}>Dashboard</h2>
        <div style={navButtonGroupStyle}>
          <button style={navButtonStyle}>Home</button>
          <button style={navButtonStyle}>List Of Products</button>
          <Link to="/add-product" style={{ ...navButtonStyle, textDecoration: 'none' }}>
          Add New Product
          </Link>
          <button style={navButtonStyle}>Profile</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={mainContentStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Welcome to Seller Dashboard</h1>
          <p style={subtitleStyle}>Manage your products, orders, and more here.</p>
        </div>
      </div>
    </div>
  );
};

// Layout styles
const layoutStyle = {
  display: 'flex',
  height: '100vh',
  width: '100vw',
};

// Sidebar styles
const sidebarStyle = {
  width: '220px',
  backgroundColor: '#222',
  color: '#fff',
  padding: '2rem 1rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
};

const navTitleStyle = {
  fontSize: '1.5rem',
  marginBottom: '2rem',
};

const navButtonGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: '100%',
};

const navButtonStyle = {
  backgroundColor: '#444',
  color: '#fff',
  border: '1px solid rgba(255, 255, 255, 0.3)', // Light white outline
  padding: '0.75rem 1rem',
  fontSize: '1rem',
  borderRadius: '8px',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'all 0.3s',
};


navButtonStyle[':hover'] = {
  backgroundColor: '#555',
};

// Main content styles
const mainContentStyle = {
  flex: 1,
  backgroundColor: '#f4f4f4',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

// Card styles
const cardStyle = {
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '16px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
  textAlign: 'center',
  width: '90%',
  maxWidth: '500px',
};

const titleStyle = {
  marginBottom: '1rem',
  fontSize: '2rem',
  color: '#333',
};

const subtitleStyle = {
  color: '#555',
};

export default SellerDashboard;