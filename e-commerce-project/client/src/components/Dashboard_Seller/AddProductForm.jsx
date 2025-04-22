import React, { useState } from 'react';

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
    // You can uncomment and use axios here for form submission
  };

  return (
    <div style={pageStyle}>
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
  );
};

const pageStyle = {
  height: '100vh',
  width: '100vw',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f4f4f4',
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

export default AddProductForm;
