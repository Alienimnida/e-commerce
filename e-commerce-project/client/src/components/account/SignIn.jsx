import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [formData, setFormData] = useState({
    role: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        role: formData.role,
        email: formData.email,
        password: formData.password,
      };

      const res = await axios.post('http://localhost:8000/api/auth/login', payload);

      // ✅ Save tokens and user info
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      alert(res.data.message || 'Login successful!');
      console.log('Success:', res.data);

      // ✅ Navigate based on role
      if (res.data.user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/seller-dashboard');
      }

    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={containerStyleBlack}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={titleStyle}>Sign In</h2>

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

        <button type="submit" style={buttonStyle}>Login</button>

        <p style={linkTextStyle}>
          Don't have an account?{' '}
          <a href="/SignUp" style={linkStyle}>
            Register here
          </a>
        </p>
      </form>
    </div>
  );
};

// Styles
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
  border: 'none',
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

export default SignIn;