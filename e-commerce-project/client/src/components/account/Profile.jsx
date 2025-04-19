import React from 'react';

const Profile = ({ user }) => {
  const currentUser = user || {
    role: 'seller',
    name: 'John Doe',
    email: 'john@example.com',
    businessName: 'Doe Traders',
    phone: '123-456-7890',
    address: '123 Market Street',
  };

  return (
    <div style={containerStyleBlack}>
      <div style={formStyle}>
        <h2 style={titleStyle}>Profile</h2>

        <p><strong>Role:</strong> {currentUser.role}</p>
        <p><strong>Name:</strong> {currentUser.name}</p>
        <p><strong>Email:</strong> {currentUser.email}</p>

        {currentUser.role === 'seller' && (
          <>
            <p><strong>Business Name:</strong> {currentUser.businessName}</p>
            <p><strong>Phone:</strong> {currentUser.phone}</p>
            <p><strong>Address:</strong> {currentUser.address}</p>
          </>
        )}

        <button style={buttonStyle}>Edit Profile</button>
      </div>
    </div>
  );
};

// ✅ Same black full-width background used in SignUp
const containerStyleBlack = {
  backgroundColor: '#000',
  color: '#fff',
  minHeight: '100vh',
  width: '100vw',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: 'sans-serif',
  overflow: 'hidden',
};

// ✅ Same soft peach card styling
const formStyle = {
  backgroundColor: '#ffe6cc',
  padding: '2rem',
  borderRadius: '16px',
  boxShadow: '17px 13px 23px -4px rgba(209,202,65,1)',
  WebkitBoxShadow: '17px 13px 23px -4px rgba(209,202,65,1)',
  MozBoxShadow: '17px 13px 23px -4px rgba(209,202,65,1)',
  width: '320px',
  color: '#000',
  border: 'none',
};

const titleStyle = {
  textAlign: 'center',
  marginBottom: '1.5rem',
  color: '#000',
};

const buttonStyle = {
  width: '100%',
  padding: '0.75rem',
  backgroundColor: '#007bff',
  border: 'none',
  color: '#fff',
  fontWeight: 'bold',
  borderRadius: '4px',
  cursor: 'pointer',
  marginTop: '1rem',
};

export default Profile;
