import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sellingPrice: '',
    mrp: '',
    quantity: '',
    category: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Axios logic goes here
  };

  return (
    <div style={layoutStyle}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
  <h2 style={navTitleStyle}>Dashboard</h2>
  <div style={navButtonGroupStyle}>
    <Link to="/seller-dashboard" style={navButtonLinkStyle}>Home</Link>
    <Link to="/products" style={navButtonLinkStyle}>List Of Products</Link>
    <Link to="/add-product" style={navButtonLinkStyle}>Add New Product</Link>
    <Link to="/profile" style={navButtonLinkStyle}>Profile</Link>
  </div>
</div>

      {/* Form Content */}
      <div style={mainContentStyle}>
        <form style={formStyle} onSubmit={handleSubmit}>
          <h2 style={{ marginBottom: '1rem' }}>Add New Product</h2>
          <input name="name" type="text" placeholder="Product Name" onChange={handleChange} required style={inputStyle} />
          <textarea name="description" placeholder="Description" onChange={handleChange} required style={inputStyle} />
          <input name="sellingPrice" type="number" placeholder="Selling Price" onChange={handleChange} required style={inputStyle} />
          <input name="mrp" type="number" placeholder="MRP" onChange={handleChange} required style={inputStyle} />
          <input name="quantity" type="number" placeholder="Quantity" onChange={handleChange} required style={inputStyle} />
          <select name="category" onChange={handleChange} required style={inputStyle}>
            <option value="">Select Category</option>
            <option value="Laptops">Laptops 💻</option>
            <option value="Smartphones">Smartphones 📱</option>
            <option value="Headphones">Headphones 🎧</option>
            <option value="TVs">TVs 📺</option>
            <option value="Gaming">Gaming 🎮</option>
            <option value="Wearables">Wearables ⌚</option>
            <option value="Cameras">Cameras 📷</option>
            <option value="Smart Home">Smart Home 🏠</option>
          </select>
          <input name="image" type="file" onChange={handleChange} required style={inputStyle} />
          <button type="submit" style={buttonStyle}>Add Product</button>
        </form>
      </div>
    </div>
  );
};

// Shared styles from SellerDashboard
const layoutStyle = {
  display: 'flex',
  height: '100vh',
  width: '100vw',
};

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
  border: '1px solid rgba(255, 255, 255, 0.3)',
  padding: '0.75rem 1rem',
  fontSize: '1rem',
  borderRadius: '8px',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'all 0.3s',
};

const mainContentStyle = {
  flex: 1,
  backgroundColor: '#f4f4f4',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const formStyle = {
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '12px',
  boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  width: '90%',
  maxWidth: '500px',
};

const inputStyle = {
  marginBottom: '1rem',
  padding: '0.75rem',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontSize: '1rem',
};

const buttonStyle = {
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  padding: '0.75rem',
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer',
};
const navButtonLinkStyle = {
  ...navButtonStyle,
  textDecoration: 'none',
  display: 'block',
};

export default AddProductForm;