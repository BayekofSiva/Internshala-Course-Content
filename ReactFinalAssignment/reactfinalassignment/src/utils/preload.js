export const preloadComponent = (componentImport) => {
  const componentPromise = componentImport();
  return {
    promise: componentPromise,
    preload: () => componentPromise,
  };
};

// Usage in NavLink.jsx:
const ProductList = preloadComponent(() => import('./pages/ProductList'));

// In nvigation component:
<NavLink 
  to="/products"
  onMouseEnter={ProductList.preload}
  onFocus={ProductList.preload}
>
  Products
</NavLink>