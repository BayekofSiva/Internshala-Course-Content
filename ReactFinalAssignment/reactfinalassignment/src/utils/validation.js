export const validateCheckoutForm = (values) => {
  const errors = {};
  
  if (!values.name) errors.name = 'Required';
  if (!values.email.includes('@')) errors.email = 'Invalid email';
  if (values.cardNumber.replace(/\s/g, '').length !== 16) {
    errors.cardNumber = 'Must be 16 digits';
  }
  
  return Object.keys(errors).length ? errors : null;
};