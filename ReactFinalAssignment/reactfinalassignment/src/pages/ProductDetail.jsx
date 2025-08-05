import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addItem } from '../redux/cartSlice';
import { productType } from '../propTypes';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../utils/routeAnimations';


const ProductImages = lazy(() => import('../components/ProductImages'));
const ProductReviews = lazy(() => import('../components/ProductReviews'));

const ProductDetail = () => (
  <div>
    <Suspense fallback={<LoadingSpinner />}>
      <ProductImages />
    </Suspense>
    
    <Suspense fallback={<LoadingSpinner />}>
      <ProductReviews />
    </Suspense>
  </div>
);

ProductDetail.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

ProductItem.propTypes = {
  product: productType.isRequired
};

export default ProductDetail;