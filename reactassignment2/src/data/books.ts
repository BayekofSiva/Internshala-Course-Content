export interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  description: string;
  rating: number;
}

export const books: Book[] = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Fiction',
    description: 'A story of wealth, love, and the American Dream in the 1920s.',
    rating: 4.5
  },
  {
    id: 2,
    title: 'Dune',
    author: 'Frank Herbert',
    category: 'Sci-Fi',
    description: 'A science fiction epic about politics, religion, and ecology on a desert planet.',
    rating: 4.8
  },
  {
    id: 3,
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    category: 'Non-Fiction',
    description: 'A brief history of humankind, exploring the evolution of our species.',
    rating: 4.7
  },
  
];