import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Book } from '../data/books';
import { addBook, initializeBooks } from '../redux/booksSlice';
import { RootState } from '../redux/store';
import Navbar from '../components/Navbar';

const AddBook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const books = useSelector((state: RootState) => state.books.books);
  
  // Initialize with sample data if empty
  useEffect(() => {
    if (books.length === 0) {
      const sampleBooks: Book[] = [
        {
          id: 1,
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          category: 'Fiction',
          description: 'A story of wealth, love, and the American Dream in the 1920s.',
          rating: 4.5
        },
        // Add other sample books as needed
      ];
      dispatch(initializeBooks(sampleBooks));
    }
  }, [dispatch, books.length]);

  const [formData, setFormData] = useState<Omit<Book, 'id'>>({
    title: '',
    author: '',
    category: 'Fiction',
    description: '',
    rating: 0
  });

  const [errors, setErrors] = useState<Partial<Omit<Book, 'id'>>>({});

  const categories = ['Fiction', 'Non-Fiction', 'Sci-Fi', 'Mystery', 'Biography'];

  const validateForm = () => {
    const newErrors: Partial<Omit<Book, 'id'>> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
//     if (formData.rating < 0 || formData.rating > 5) newErrors.rating = 'Rating must be between 0 and 5';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const newBook: Book = {
        ...formData,
        id: Math.max(0, ...books.map(book => book.id)) + 1 // Generate new ID
      };
      
      dispatch(addBook(newBook));
      navigate('/books');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rating' ? parseFloat(value) : value
    });
  };

  return (
    <div className="add-book">
      <Navbar />
      <div className="container">
        <h1>Add New Book</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title*</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="author">Author*</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className={errors.author ? 'error' : ''}
            />
            {errors.author && <span className="error-message">{errors.author}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="rating">Rating (0-5)</label>
            <input
              type="number"
              id="rating"
              name="rating"
              min="0"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={handleChange}
              className={errors.rating ? 'error' : ''}
            />
            {errors.rating && <span className="error-message">{errors.rating}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description*</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>
          
          <button type="submit" className="submit-button">Add Book</button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;