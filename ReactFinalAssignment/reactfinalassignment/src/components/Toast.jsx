import { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type = 'info',  }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      {message}
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning']),
  onClose: PropTypes.func.isRequired
};

export default Toast;