import React from 'react';
import ReactDOM from 'react-dom';
import './styles/App.css';
import App from './App';
import { JSX } from 'react/jsx-runtime';

function render(element: JSX.Element, container: HTMLElement | null): void {
        if (container) {
                ReactDOM.render(element, container);
        }
}

render(
        <React.StrictMode>
                <App />
        </React.StrictMode>,
        document.getElementById('root')
);