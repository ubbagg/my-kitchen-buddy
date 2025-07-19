import { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/')
      .then(response => setMessage(response.data.message))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="text-2xl text-center text-blue-500">
      <h2>Home Page</h2>
      <p>{message || 'Loading...'}</p>
    </div>
  );
}

function About() {
  return <h2 className="text-2xl text-center text-blue-500">About Page</h2>;
}

function App() {
  return (
    <Router>
      <div className="p-4">
        <nav className="mb-4">
          <a href="/" className="mr-4 text-blue-500">Home</a>
          <a href="/about" className="text-blue-500">About</a>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;