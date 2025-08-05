import { useDispatch } from 'react-redux';
import { removeItem, updateQuantity } from '../redux/cartSlice';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleRemove = () => {
    dispatch(removeItem(item));
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
    }
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

export default CartItem;