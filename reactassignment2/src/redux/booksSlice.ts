import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Book } from '../data/books';

interface BooksState {
  books: Book[];
}

const initialState: BooksState = {
  books: [] // Will be initialized in the component
};

export const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    addBook: (state, action: PayloadAction<Book>) => {
      state.books.push(action.payload);
    },
    initializeBooks: (state, action: PayloadAction<Book[]>) => {
      state.books = action.payload;
    }
  }
});

export const { addBook, initializeBooks } = booksSlice.actions;
export default booksSlice.reducer;