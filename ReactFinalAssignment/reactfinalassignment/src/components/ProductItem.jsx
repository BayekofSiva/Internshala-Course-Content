import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItem } from '../redux/cartSlice';
import PropTypes from 'prop-types';
import { productType } from '../propTypes';
import { useState } from 'react';
import Toast from './Toast';

const ProductItem = ({ product }) => {
  const dispatch = useDispatch();
  const [notification, setNotification] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (isAdding) return; // Prevent multiple clicks
    setIsAdding(true);

    setIsAdding(true);
    try {
      await dispatch(
        addItem(product, { 
          availableStock,
          requestId: `${product.id}-${Date.now()}` 
        })
      ).unwrap();
      
      setNotification({
        type: 'success',
        message: `${product.title} added to cart!`
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.message
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="product-item">
      <Link to={`/product/${product.id}`}>
        <img src={product.image} alt={product.title} />
        <h3>{product.title}</h3>
        <p>${product.price}</p>
      </Link>
      <button 
        onClick={handleAddToCart}
        disabled={isAdding || availableStock <= 0}
        aria-busy={isAdding}
      >
         {availableStock <= 0 ? 'Out of Stock' : 
         isAdding ? 'Adding...' : 'Add to Cart'}
      </button>

      {notification && (
        <Toast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

ProductItem.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string,
    category: PropTypes.string
  }).isRequired
};

ProductItem.propTypes = {
  product: productType.isRequired
};

export default ProductItem;