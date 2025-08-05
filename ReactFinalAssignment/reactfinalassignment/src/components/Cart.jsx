import { useSelector } from 'react-redux';
import CartItem from './CartItem';
import { productType } from '../propTypes';

const Cart = () => {
  const cartItems = useSelector(state => state.cart.items);
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  if (cartItems.length === 0) {
    return <div className="empty-cart">Your cart is empty</div>;
  }

  return (
    <div className="cart">
      <h2>Your Shopping Cart</h2>
      <div className="cart-items">
        {cartItems.map(item => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
      <div className="cart-total">
        <h3>Total: ${total.toFixed(2)}</h3>
      </div>
    </div>
  );
};

ProductItem.propTypes = {
  product: productType.isRequired
};



export default Cart;