import { useSelector } from 'react-redux';
import { selectCartItemCount } from '../redux/selectors';
import './Header.css';

const Header = () => {
  const cartCount = useSelector(selectCartItemCount);
  
  return (
    <header className="header">
      <nav>
        <a href="/">ShoppyGlobe</a>
        <a href="/cart">Cart ({cartCount})</a>
      </nav>
    </header>
  );
};

export default Header;