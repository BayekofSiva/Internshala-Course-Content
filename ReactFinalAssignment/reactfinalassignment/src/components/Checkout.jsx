import { useSelector } from 'react-redux';
import { productType } from '../propTypes';

const Checkout = () => {
  const cartItems = useSelector(state => state.cart.items);
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="order-summary">
        <h3>Order Summary</h3>
        <ul>
          {cartItems.map(item => (
            <li key={item.id}>
              {item.title} - {item.quantity} x ${item.price}
            </li>
          ))}
        </ul>
        <div className="total">Total: ${total.toFixed(2)}</div>
      </div>
      <form className="checkout-form">
        {/* Add form fields for shipping/payment */}
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
};

ProductItem.propTypes = {
  product: productType.isRequired
};

export default Checkout;