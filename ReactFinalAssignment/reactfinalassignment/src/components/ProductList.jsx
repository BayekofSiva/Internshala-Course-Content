import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, setSearchTerm } from '../redux/productSlice';
import ProductItem from './ProductItem';
import { productType } from '../propTypes';

const ProductList = () => {
  const dispatch = useDispatch();
  const { items: products, status, error, searchTerm } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === 'loading') return <div>Loading products...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;

  return (
    <div className="product-list">
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearchChange}
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

ProductList.propTypes = {
  // Redux-injected props (if needed)
  products: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string,
  fetchProducts: PropTypes.func,
  searchTerm: PropTypes.string,
  setSearchTerm: PropTypes.func
};

ProductItem.propTypes = {
  product: productType.isRequired
};