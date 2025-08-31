import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [minRating, setMinRating] = useState(2.7);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://dummyjson.com/products')
            .then(res => res.json())
            .then(data => {
                setAllProducts(data.products);
                setFilteredProducts(data.products);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

    function handleSearchChange(e) {
        const searchValue = e.target.value;
        setSearchTitle(searchValue);
        
        const searchedProducts = allProducts.filter(product => 
            product.title.toLowerCase().includes(searchValue.toLowerCase()) && 
            product.rating > minRating
        );
        setFilteredProducts(searchedProducts);
    }

    function handleRatingChange(e) {
        const ratingValue = parseFloat(e.target.value);
        setMinRating(ratingValue);
        
        const filtered = allProducts.filter(product => 
            product.title.toLowerCase().includes(searchTitle.toLowerCase()) && 
            product.rating > ratingValue
        );
        setFilteredProducts(filtered);
    }

    if (loading) {
        return <div className="loading">Loading products...</div>;
    }

    return (
        <div className="app">
            <header className="header">
                <h1 className="title">🔍 Product Search</h1>
                <p className="subtitle">Find products by name and rating</p>
            </header>

            <div className="search-container">
                <input 
                    type="text" 
                    value={searchTitle} 
                    onChange={handleSearchChange}
                    className="search-input"
                    placeholder="Search product names..."
                />
                
                <div className="rating-filter">
                    <label>Min Rating: {minRating} ⭐</label>
                    <input 
                        type="range"
                        min="0"
                        max="5"
                        step="0.1"
                        value={minRating}
                        onChange={handleRatingChange}
                        className="rating-slider"
                    />
                </div>
            </div>

            <div className="results-count">
                Found {filteredProducts.length} products
            </div>

            <div className="products-grid">
                {filteredProducts.map((product, index) => (
                    <div 
                        key={product.id} 
                        className="product-card"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="product-image">
                            {product.thumbnail ? (
                                <img src={product.thumbnail} alt={product.title} />
                            ) : (
                                <div className="image-placeholder">📦</div>
                            )}
                        </div>
                        
                        <div className="product-info">
                            <h3 className="product-title">{product.title}</h3>
                            <div className="product-rating">
                                ⭐ {product.rating} / 5
                                <div className="rating-bar">
                                    <div 
                                        className="rating-fill"
                                        style={{ width: `${(product.rating / 5) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                            <p className="product-price">${product.price}</p>
                            <p className="product-category">{product.category}</p>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProducts.length === 0 && !loading && (
                <div className="no-results">
                    <h3>No products found</h3>
                    <p>Try adjusting your search criteria</p>
                </div>
            )}
        </div>
    );
}