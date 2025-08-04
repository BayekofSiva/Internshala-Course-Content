import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BrowseBooks from './pages/BrowseBooks';
import BookDetails from './pages/BookDetails';
import AddBook from './pages/AddBook';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<BrowseBooks />} />
          <Route path="/books/:category" element={<BrowseBooks />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/add-book" element={<AddBook />} />
          {/* 404 Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;