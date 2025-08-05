import { useState } from 'react';
import useProducts from '../hooks/useProducts';
import ProductItem from './ProductItem';
import './ProductList.css';

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { products, loading, error } = useProducts('https://fakestoreapi.com/products');

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="product-list">
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <div className="products-grid">
        {filteredProducts.map(product => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;