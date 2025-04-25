import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/seller/products');
      setProducts(response.data.products || []);
    } catch (err) {
      setError('Failed to fetch products');
    }
  };

  const handleEditClick = (product) => {
    setEditingProductId(product._id);
    setEditedProductData({
      name: product.name,
      description: product.description,
      sellingPrice: product.sellingPrice,
      marketPrice: product.marketPrice,
      quantity: product.quantity,
      category: product.category,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProductData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async (productId) => {
    try {
      await axios.put(`/api/seller/products/${productId}`, editedProductData);
      setEditingProductId(null);
      fetchProducts(); // Refresh list
    } catch (err) {
      setError('Failed to update product');
    }
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`/api/seller/products/${productId}`);
      setProducts(products.filter(product => product._id !== productId));
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  return (
    <div>
      <h2>Your Products</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Selling Price</th>
            <th>Market Price</th>
            <th>Quantity</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id}>
              {editingProductId === product._id ? (
                <>
                  <td><input name="name" value={editedProductData.name} onChange={handleChange} /></td>
                  <td><input name="sellingPrice" value={editedProductData.sellingPrice} onChange={handleChange} /></td>
                  <td><input name="marketPrice" value={editedProductData.marketPrice} onChange={handleChange} /></td>
                  <td><input name="quantity" value={editedProductData.quantity} onChange={handleChange} /></td>
                  <td><input name="category" value={editedProductData.category} onChange={handleChange} /></td>
                  <td>
                    <button onClick={() => handleSaveEdit(product._id)}>Save</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{product.name}</td>
                  <td>{product.sellingPrice}</td>
                  <td>{product.marketPrice}</td>
                  <td>{product.quantity}</td>
                  <td>{product.category}</td>
                  <td>
                    <button onClick={() => handleEditClick(product)}>Edit</button>
                    <button onClick={() => handleDelete(product._id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;