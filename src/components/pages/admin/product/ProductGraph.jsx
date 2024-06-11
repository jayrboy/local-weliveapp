import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { baseURL } from '../../../../App';
import { toast } from 'react-toastify';

const ProductGraph = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`${baseURL}/api/product/${id}`, {
      headers: { Authorization: 'Bearer ' + token },
    })
      .then((response) => response.json())
      .then((result) => setProduct(result))
      .catch((err) => toast.error(err));
  }, [id, token]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h3>Product Details</h3>
      <p><strong>Product Code:</strong> {product.code}</p>
      <p><strong>Product Name:</strong> {product.name}</p>
      <p><strong>Stock Quantity:</strong> {product.stock_quantity}</p>
      <p><strong>Price:</strong> {product.price}</p>
      <p><strong>Cost:</strong> {product.cost}</p>
      <p><strong>Date Added:</strong> {new Date(product.date_added).toLocaleDateString()}</p>
      <p><strong>CF:</strong> {product.cf}</p>
      <p><strong>Paid:</strong> {product.paid}</p>
      <p><strong>Remaining:</strong> {product.remaining}</p>
      {/* Add more product details and graphs as needed */}
    </div>
  );
};

export default ProductGraph;
