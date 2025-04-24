import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: '',
    username: '',
    name: '',
    email: '',
    password: '',
    businessName: '',
    phone: '',
    address: '',
    adminCode: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      let payload = {};
      let endpoint = "";
  
      if (formData.role === 'admin') {
        payload = {
          email: formData.email,
          password: formData.password,
          name: formData.username,
          phone: formData.phone,
          adminCode: formData.adminCode,
        };
        endpoint = "http://localhost:8000/api/auth/register-admin";
      } else if (formData.role === 'seller') {
        payload = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          businessName: formData.businessName,
          phone: formData.phone,
          address: formData.address,
        };
        endpoint = "http://localhost:8000/api/auth/register";
      }
  
      const res = await axios.post(endpoint, payload);
      alert(res.data.message || "Registration successful!");
      console.log("✅ Success:", res.data);
  
      if (formData.role === 'seller') {
        navigate('/seller-dashboard');
      } else if (formData.role === 'admin') {
        navigate('/admin-dashboard');
      }
  
    } catch (error) {
      console.error("❌ Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };
    
  

  return (
    <div style={containerStyleBlack}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={titleStyle}>Create an Account</h2>

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="seller">Seller</option>
        </select>

        {formData.role === 'admin' && (
          <>
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              type="text"
              name="adminCode"
              placeholder="Admin Code"
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </>
        )}

        {formData.role === 'seller' && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              type="text"
              name="businessName"
              placeholder="Business Name"
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </>
        )}

        <button type="submit" style={buttonStyle}>Register</button>

        <p style={linkTextStyle}>
          Already have an account?{" "}
          <a href="/SignIn" style={linkStyle}>
            Click here
          </a>
        </p>
      </form>
    </div>
  );
};

// Same styling...
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

const formStyle = {
  backgroundColor: '#ffe6cc',
  padding: '2rem',
  borderRadius: '16px',
  boxShadow: '17px 13px 23px -4px rgba(209,202,65,1)',
  width: '300px',
  color: '#333',
};

const titleStyle = {
  textAlign: 'center',
  marginBottom: '1.5rem',
  color: '#000',
};

const inputStyle = {
  width: '100%',
  padding: '0.5rem',
  margin: '0.5rem 0',
  borderRadius: '4px',
  border: '1px solid #ccc',
  backgroundColor: '#f9f9f9',
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
  margin: '1rem 0',
};

const linkTextStyle = {
  textAlign: 'center',
  color: '#000',
  fontSize: '0.9rem',
};

const linkStyle = {
  color: '#007bff',
  textDecoration: 'underline',
  cursor: 'pointer',
};

export default SignUp;