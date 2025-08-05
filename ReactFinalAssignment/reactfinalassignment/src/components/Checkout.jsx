import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../redux/cartSlice';
import { validateCheckoutForm } from '../utils/validation';

const Checkout = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cardNumber: ''
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateCheckoutForm(formData);
    
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }
    
    
    setTimeout(() => {
      dispatch(clearCart());
      alert('Order placed successfully!');
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        aria-invalid={!!errors.name}
      />
      {errors.name && <span className="error">{errors.name}</span>}
      
      {}
      
      <button type="submit" disabled={!cartItems.length}>
        Place Order
      </button>
    </form>
  );
};