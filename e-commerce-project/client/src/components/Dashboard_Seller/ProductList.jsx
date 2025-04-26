import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProductData, setEditedProductData] = useState({
    name: '',
    description: '',
    sellingPrice: '',
    marketPrice: '',
    quantity: '',
    category: '',
  });
  const [error, setError] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8000/api/seller/?page=1&limit=10&sort=createdAt&order=desc',
        getAuthHeaders()
      );
      console.log(response.data.products)
      setProducts(response.data.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
    }
  };

  const handleEditClick = (product) => {
    setEditingProductId(product._id);
    setEditedProductData({
      name: product.name,
      description: product.description,
      category: product.category,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async (productId) => {
    try {
      await axios.put(
        `/api/seller/products/${productId}`,
        editedProductData,
        getAuthHeaders()
      );
      setEditingProductId(null);
      fetchProducts();
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product');
    }
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
  };

  const handleDelete = async (product) => {
    try {
      await axios.delete(`http://localhost:8000/api/seller/${product.productId}`, getAuthHeaders());
      setProducts(products.filter((p) => p.productId !== product.productId));
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product');
    }
  };

  return (
    <div style={layoutStyle}>
      <div style={sidebarStyle}>
        <h2 style={navTitleStyle}>Dashboard</h2>
        <div style={navButtonGroupStyle}>
          <Link to="/seller-dashboard" style={navButtonLinkStyle}>Home</Link>
          <Link to="/product-list" style={navButtonLinkStyle}>List Of Products</Link>
          <Link to="/add-product" style={navButtonLinkStyle}>Add New Product</Link>
          <Link to="/profile" style={navButtonLinkStyle}>Profile</Link>
        </div>
      </div>

      <div style={mainContentStyle}>
        <div style={formStyle}>
          <h2 style={{ marginBottom: '1rem' }}>Your Products</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Category</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product._id}>
                      {editingProductId === product._id ? (
                        <>
                          <td style={tdStyle}>
                            <input name="name" value={editedProductData.name} onChange={handleChange} style={inputStyle} />
                          </td>
                          <td style={tdStyle}>
                            <input name="category" value={editedProductData.category} onChange={handleChange} style={inputStyle} />
                          </td>
                          <td style={tdStyle}>
                            <button onClick={() => handleSaveEdit(product._id)} style={buttonStyle}>Save</button>
                            <button onClick={handleCancelEdit} style={cancelButtonStyle}>Cancel</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={tdStyle}>{product.name}</td>
                          <td style={tdStyle}>{product.category}</td>
                          <td style={tdStyle}>
                            <button onClick={() => handleEditClick(product)} style={buttonStyle}>Edit</button>
                            <button onClick={() => handleDelete(product)} style={deleteButtonStyle}>Delete</button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ ...tdStyle, textAlign: 'center' }}>No products found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Shared styles
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

const navButtonLinkStyle = {
  ...navButtonStyle,
  textDecoration: 'none',
  display: 'block',
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
  width: '95%',
  maxWidth: '1000px',
  overflowX: 'auto',
};

const inputStyle = {
  padding: '0.5rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '0.9rem',
  width: '100%',
};

const buttonStyle = {
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  padding: '0.5rem 0.75rem',
  marginRight: '0.5rem',
  borderRadius: '6px',
  cursor: 'pointer',
};

const cancelButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#6c757d',
};

const deleteButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#dc3545',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  tableLayout: 'fixed',
};

const thStyle = {
  borderBottom: '2px solid #ccc',
  padding: '0.75rem',
  textAlign: 'left',
  backgroundColor: '#f9f9f9',
};

const tdStyle = {
  padding: '0.75rem',
  borderBottom: '1px solid #ddd',
  textAlign: 'left',
  verticalAlign: 'middle',
};


export default ProductList;
