import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCartItemCount } from '../redux/selectors';
import { use } from 'react';

const Header = () => {
  const cartCount = useSelector(selectCartItemCount);
  const cartItems = useSelector(state => state.cart.items);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="header">
      <nav>
        <Link to="/">Home</Link>
        <Link to="/cart" className="cart-link">
          Cart ({cartItemCount})
        </Link>
      </nav>
    </header>
  );
};

export default Header;