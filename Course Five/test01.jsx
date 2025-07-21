const Header = () => {
        return (
        <header style={{ backgroundColor: 'green', color: 'white', padding: '1rem' }}>
        <h1>This is the Header</h1>
        </header>
        );
};

const Body = () => {
        return (
        <main style={{ backgroundColor: 'red', color: 'white', padding: '1rem' }}>
        <p>This is the Body section</p>
        </main>
        );
};

const Footer = () => {
        return (
        <footer style={{ backgroundColor: 'yellow', color: 'black', padding: '1rem' }}>
        <p>This is the Footer</p>
        </footer>
        );
};

const App = () => {
        return (
        <div>
                <Header />
                <Body />
                <Footer />
        </div>
        );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);