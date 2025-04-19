import React, { useState } from 'react';
import axios from "axios";

const SignUp = () => {
    const [formData, setFormData] = useState({
        role: '',
        username: '',
        name: '',
        email: '',
        password: '',
        businessName: '',
        phone: '',
        address: '',
      });
      

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      let payload = {};
  
      if (formData.role === 'admin') {
        payload = {
          email: formData.email,
          password: formData.password,
          name: formData.username, // assuming 'name' is expected on the server
          role: 'admin',
        };
      } else if (formData.role === 'seller') {
        payload = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          businessName: formData.businessName,
          phone: formData.phone,
          address: formData.address,
          role: 'seller',
        };
      }
  
      const res = await axios.post("http://localhost:5000/api/auth/register", payload); // change port if needed
      alert(res.data.message);
      console.log("Success:", res.data);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Something went wrong");
    }
};
  

  return (
    <div style={containerStyleBlack}>
      <form onSubmit={handleSubmit} style={formStyle}>
  <h2 style={titleStyle}>Create an Account</h2>

  {/* Role Selection */}
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

  {/* Admin Fields */}
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
    </>
  )}

  {/* Seller Fields */}
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

// ✅ Black background
const containerStyleBlack = {
    backgroundColor: '#000',
    color: '#fff',
    minHeight: '100vh',
    width: '100vw', // ✅ fill the full width
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'sans-serif',
    overflow: 'hidden', // ✅ optional cleanup
  };
  

// ✅ Form box with white background and black border
const formStyle = {
  backgroundColor: '#ffe6cc',  // Soft peach background
  padding: '2rem',
  borderRadius: '16px',  // Large rounded corners
  boxShadow: '17px 13px 23px -4px rgba(209,202,65,1)',  // Standard box shadow
  WebkitBoxShadow: '17px 13px 23px -4px rgba(209,202,65,1)',  // For Safari (Webkit)
  MozBoxShadow: '17px 13px 23px -4px rgba(209,202,65,1)',  // For Firefox (Moz)
  width: '300px',
  color: '#333',  // Dark text for contrast
  border: 'none',  // No border for clean edges
};

// ✅ Heading
const titleStyle = {
  textAlign: 'center',
  marginBottom: '1.5rem',
  color: '#000',  // Black text
};

// ✅ Input fields
const inputStyle = {
  width: '100%',
  padding: '0.5rem',
  margin: '0.5rem 0',
  borderRadius: '4px',
  border: '1px solid #ccc',  // Light border for inputs
  backgroundColor: '#f9f9f9',  // Light grey input background
  color: '#000',  // Black text in inputs
};

// ✅ Button
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