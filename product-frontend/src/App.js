import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:2411/products';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '' });

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      setProducts(response.data);
    } catch (error) {
      console.error('Gagal mengambil data:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData);
      fetchProducts();
      setFormData({ name: '', price: '' });
    } catch (error) {
      console.error('Gagal menambah produk:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${editingProduct.id}`, formData);
      fetchProducts();
      setEditingProduct(null);
      setFormData({ name: '', price: '' });
    } catch (error) {
      console.error('Gagal mengupdate produk:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Gagal menghapus produk:', error);
    }
  };

  return (
    <div>
      <h1>Daftar Produk</h1>
      <form onSubmit={editingProduct ? handleUpdate : handleCreate}>
        <input
          type="text"
          placeholder="Nama Produk"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Harga"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />
        <button type="submit">
          {editingProduct ? 'Update Produk' : 'Tambah Produk'}
        </button>
      </form>

      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <h3>{product.name}</h3>
            <p>Harga: Rp{product.price}</p>
            <button onClick={() => handleEdit(product)}>Edit</button>
            <button onClick={() => handleDelete(product.id)}>Hapus</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;