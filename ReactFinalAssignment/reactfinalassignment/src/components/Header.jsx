import { useSelector } from 'react-redux';
import { selectCartItemCount } from './redux/selectCartItemCount';

const Header = () => {
  const cartCount = useSelector(selectCartItemCount);
  
  return (
    <header className="header">
      {/* Header content */}
      <span>Cart ({cartCount})</span>
    </header>
  );
};

export default Header;