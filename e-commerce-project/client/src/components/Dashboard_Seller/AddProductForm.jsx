import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddProductForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sellingPrice: '',
    mrp: '',
    quantity: '',
    category: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image' && files && files[0]) {
      setFormData({
        ...formData,
        [name]: files[0],
      });

      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const productData = new FormData();
      productData.append('name', formData.name);
      productData.append('description', formData.description);
      productData.append('sellingPrice', formData.sellingPrice);
      productData.append('mrp', formData.mrp);
      productData.append('quantity', formData.quantity);
      productData.append('category', formData.category);

      if (formData.image) {
        productData.append('image', formData.image);
      }

      const response = await axios.post(
        'http://localhost:8000/api/seller/',
        productData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log('Product created:', response.data);

      alert('Product added successfully!');
      navigate('/product-list');

    } catch (err) {
      console.error('Error adding product:', err);
      setError(err.response?.data?.message || 'Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={layoutStyle}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <h2 style={navTitleStyle}>Dashboard</h2>
        <div style={navButtonGroupStyle}>
          <Link to="/seller-dashboard" style={navButtonLinkStyle}>Home</Link>
          <Link to="/product-list" style={navButtonLinkStyle}>List Of Products</Link>
          <Link to="/add-product" style={navButtonLinkStyle}>Add New Product</Link>
          <Link to="/profile" style={navButtonLinkStyle}>Profile</Link>
        </div>
      </div>

      {/* Form Content */}
      <div style={mainContentStyle}>
        <form style={formStyle} onSubmit={handleSubmit}>
          <h2 style={{ marginBottom: '1rem' }}>Add New Product</h2>

          {error && <div style={errorStyle}>{error}</div>}

          <input
            name="name"
            type="text"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            name="sellingPrice"
            type="number"
            placeholder="Selling Price"
            value={formData.sellingPrice}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            name="mrp"
            type="number"
            placeholder="MRP"
            value={formData.mrp}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            name="quantity"
            type="number"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            style={inputStyle}
          >
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

          <div style={fileInputContainerStyle}>
            <input
              name="image"
              type="file"
              accept="image/*"
              onChange={handleChange}
              required
              style={inputStyle}
            />
            {imagePreview && (
              <div style={previewContainerStyle}>
                <img
                  src={imagePreview}
                  alt="Product preview"
                  style={imagePreviewStyle}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            style={buttonStyle}
            disabled={loading}
          >
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Existing styles
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
  overflow: 'auto', // Add scrolling for smaller screens
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
  margin: '2rem 0',
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
  transition: 'background-color 0.3s',
};

const navButtonLinkStyle = {
  ...navButtonStyle,
  textDecoration: 'none',
  display: 'block',
};

// New styles for image preview and error handling
const fileInputContainerStyle = {
  marginBottom: '1rem',
};

const previewContainerStyle = {
  marginTop: '1rem',
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '0.5rem',
  backgroundColor: '#f9f9f9',
};

const imagePreviewStyle = {
  width: '100%',
  maxHeight: '200px',
  objectFit: 'contain',
  borderRadius: '4px',
};

const errorStyle = {
  backgroundColor: '#ffebee',
  color: '#c62828',
  padding: '0.75rem',
  borderRadius: '8px',
  marginBottom: '1rem',
  fontSize: '0.9rem',
};

export default AddProductForm;