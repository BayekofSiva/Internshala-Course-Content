import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { books } from '../data/books';
import Navbar from '../components/Navbar';

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Find the book with matching ID
  const book = books.find(book => book.id === Number(id));

  if (!book) {
    return (
      <div className="book-details">
        <Navbar />
        <div className="container">
          <h1>Book not found</h1>
          <Link to="/books">Back to Browse</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="book-details">
      <Navbar />
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back to Browse
        </button>
        
        <div className="book-info">
          <h1>{book.title}</h1>
          <h2>by {book.author}</h2>
          
          <div className="meta">
            <span className="category">{book.category}</span>
            <span className="rating">Rating: {book.rating}/5</span>
          </div>
          
          <div className="description">
            <h3>Description</h3>
            <p>{book.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;