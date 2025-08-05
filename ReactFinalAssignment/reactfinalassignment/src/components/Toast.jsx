import { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      <span>{message}</span>
      <button onClick={onClose} aria-label="Close">×</button>
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning']),
  onClose: PropTypes.func.isRequired
};

export default Toast;