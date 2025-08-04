# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# Online Library System

A React-based online library management system with book browsing and adding functionality.

## Features
- Browse books by category
- View book details
- Add new books
- Search functionality
- 404 error page

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR-USERNAME/online-library-system.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the application:
   ```bash
   npm start
   ```

## Technologies Used
- React
- React Router
- Redux Toolkit
- TypeScript (optional if you used it)

## Project Structure
```
src/
├── components/    # Reusable components
├── pages/         # Page components
├── redux/         # Redux store and slices
├── data/          # Sample data
└── styles/        # CSS files
```