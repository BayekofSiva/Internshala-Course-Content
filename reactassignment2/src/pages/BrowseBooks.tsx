import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { books, Book } from '../data/books';
import SearchBar from '../components/SearchBar';
import Navbar from '../components/Navbar';

const BrowseBooks = () => {
  const { category } = useParams<{ category?: string }>();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter books by category if specified
  let filteredBooks = books;
  if (category) {
    filteredBooks = books.filter(book => 
      book.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Apply search filter
  if (searchTerm) {
    filteredBooks = filteredBooks.filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  return (
    <div className="browse-books">
      <Navbar />
      <div className="container">
        <h1>{category ? `${category} Books` : 'All Books'}</h1>
        
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />

        <div className="book-list">
          {filteredBooks.length > 0 ? (
            filteredBooks.map(book => (
              <div key={book.id} className="book-card">
                <h2>{book.title}</h2>
                <p>by {book.author}</p>
                <p>Category: {book.category}</p>
                <p>Rating: {book.rating}/5</p>
                <Link to={`/book/${book.id}`}>View Details</Link>
              </div>
            ))
          ) : (
            <p>No books found matching your criteria.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseBooks;