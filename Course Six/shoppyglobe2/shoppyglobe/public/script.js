// Front‑end logic for ShoppyGlobe

// Base API URL (relative to the server)
const API_BASE = '/api';

// DOM elements
const authSection = document.getElementById('auth-section');
const productsSection = document.getElementById('products-section');
const cartSection = document.getElementById('cart-section');
const productsContainer = document.getElementById('products-container');
const cartContainer = document.getElementById('cart-container');
const cartButton = document.getElementById('cart-button');
const themeCheckbox = document.getElementById('theme-checkbox');
const themeLabel = document.getElementById('theme-label');

/**
 * Toggle between light and dark themes.
 */
function toggleTheme() {
  if (themeCheckbox.checked) {
    document.body.classList.add('dark');
    themeLabel.textContent = 'Dark';
  } else {
    document.body.classList.remove('dark');
    themeLabel.textContent = 'Light';
  }
}

/**
 * Register a new user using the API.
 */
async function registerUser() {
  const username = document.getElementById('reg-username').value.trim();
  const password = document.getElementById('reg-password').value.trim();
  if (!username || !password) {
    alert('Please provide a username and password');
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) {
      alert('Registration successful! You can now log in.');
    } else {
      alert(data.message || 'Registration failed');
    }
  } catch (err) {
    console.error(err);
    alert('An error occurred while registering');
  }
}

/**
 * Log in a user and store the JWT token in localStorage.
 */
async function loginUser() {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();
  if (!username || !password) {
    alert('Please enter your username and password');
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem('token', data.token);
      // hide auth forms and show products section
      authSection.classList.add('hidden');
      productsSection.classList.remove('hidden');
      cartButton.classList.remove('hidden');
      // Load products and cart
      loadProducts();
      loadCart();
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (err) {
    console.error(err);
    alert('An error occurred while logging in');
  }
}

/**
 * Fetch and display all products from the API.
 */
async function loadProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`);
    const products = await res.json();
    productsContainer.innerHTML = '';
    products.forEach((p) => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <p class="price">₹${p.price}</p>
        <button onclick="addToCart('${p._id}')">Add to Cart</button>
      `;
      productsContainer.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    alert('Failed to load products');
  }
}

/**
 * Add a product to the user's cart.
 * @param {string} productId The ID of the product to add.
 */
async function addToCart(productId) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please log in to add items to your cart');
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    const data = await res.json();
    if (res.ok) {
      alert('Item added to cart');
      loadCart();
    } else {
      alert(data.message || 'Failed to add item to cart');
    }
  } catch (err) {
    console.error(err);
    alert('An error occurred while adding to cart');
  }
}

/**
 * Fetch and display all items in the user's cart.
 */
async function loadCart() {
  const token = localStorage.getItem('token');
  if (!token) return;
  try {
    const res = await fetch(`${API_BASE}/cart`, {
      headers: { Authorization: 'Bearer ' + token },
    });
    const items = await res.json();
    cartContainer.innerHTML = '';
    if (!items || items.length === 0) {
      cartContainer.innerHTML = '<p>Your cart is empty.</p>';
      return;
    }
    items.forEach((item) => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <div>
          <strong>${item.product.name}</strong><br />
          ₹${item.product.price}
        </div>
        <div>
          <input type="number" min="1" value="${item.quantity}" onchange="updateCart('${item.product._id}', this.value)" />
          <button onclick="removeFromCart('${item.product._id}')" class="delete-btn">Remove</button>
        </div>
      `;
      cartContainer.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    alert('Failed to load cart');
  }
}

/**
 * Update the quantity of an item in the cart.
 * @param {string} productId The product ID to update.
 * @param {number|string} quantity The new quantity.
 */
async function updateCart(productId, quantity) {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${API_BASE}/cart/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({ quantity: parseInt(quantity, 10) }),
    });
    const data = await res.json();
    if (res.ok) {
      loadCart();
    } else {
      alert(data.message || 'Failed to update cart');
    }
  } catch (err) {
    console.error(err);
    alert('An error occurred while updating the cart');
  }
}

/**
 * Remove an item from the cart.
 * @param {string} productId The product ID to remove.
 */
async function removeFromCart(productId) {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${API_BASE}/cart/${productId}`, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + token },
    });
    const data = await res.json();
    if (res.ok) {
      loadCart();
    } else {
      alert(data.message || 'Failed to remove item');
    }
  } catch (err) {
    console.error(err);
    alert('An error occurred while removing the item');
  }
}

/**
 * Toggle the visibility of the cart section.
 */
function toggleCart() {
  if (cartSection.classList.contains('hidden')) {
    loadCart();
    cartSection.classList.remove('hidden');
  } else {
    cartSection.classList.add('hidden');
  }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (token) {
    authSection.classList.add('hidden');
    productsSection.classList.remove('hidden');
    cartButton.classList.remove('hidden');
    loadProducts();
  }
  themeCheckbox.addEventListener('change', toggleTheme);
});