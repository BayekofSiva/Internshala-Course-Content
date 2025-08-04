import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
  // Sample data
  const categories = ['Fiction', 'Non-Fiction', 'Sci-Fi', 'Mystery', 'Biography'];
  const popularBooks = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction' },
    { id: 2, title: 'Dune', author: 'Frank Herbert', category: 'Sci-Fi' },
    { id: 3, title: 'Sapiens', author: 'Yuval Noah Harari', category: 'Non-Fiction' },
  ];

  return (
    <div className="home-page">
      <Navbar />
      <div className="container">
        <h1>Welcome to Our Online Library</h1>
        <p>Discover your next favorite book from our extensive collection.</p>
        
        <section className="categories">
          <h2>Book Categories</h2>
          <ul>
            {categories.map((category, index) => (
              <li key={index}>
                <Link to={`/books/${category.toLowerCase()}`}>{category}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="popular-books">
          <h2>Popular Books</h2>
          <div className="book-list">
            {popularBooks.map(book => (
              <div key={book.id} className="book-card">
                <h3>{book.title}</h3>
                <p>by {book.author}</p>
                <Link to={`/book/${book.id}`}>View Details</Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;