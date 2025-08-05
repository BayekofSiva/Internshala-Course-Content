import { useDispatch } from 'react-redux';
import { removeItem, updateQuantity } from '../redux/cartSlice';
import { productType } from '../propTypes';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleRemove = () => {
    dispatch(removeItem(item.id));
  };

  const handleQuantityChange = (e) => {
    dispatch(updateQuantity({ 
      id: item.id, 
      quantity: parseInt(e.target.value) 
    }));
  };

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.title} />
      <div className="item-details">
        <h3>{item.title}</h3>
        <p>${item.price}</p>
      </div>
      <div className="quantity-control">
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={handleQuantityChange}
        />
        <button onClick={handleRemove}>Remove</button>
      </div>
    </div>
  );
};

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired
  }).isRequired
};

ProductItem.propTypes = {
  product: productType.isRequired
};

export default CartItem;