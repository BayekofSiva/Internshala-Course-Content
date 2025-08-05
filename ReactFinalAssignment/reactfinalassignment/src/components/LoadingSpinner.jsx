import PropTypes from 'prop-types';

const LoadingSpinner = ({ fullPage = false }) => (
  <div className={`loading-spinner ${fullPage ? 'full-page' : ''}`}>
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

LoadingSpinner.propTypes = {
  fullPage: PropTypes.bool
};

export default LoadingSpinner;