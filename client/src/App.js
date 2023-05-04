import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';

function App() {
  return (
    <div id="App">
      <BrowserRouter>
        <nav>Nav</nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <footer>Footer</footer>
      </BrowserRouter>
    </div>
  );
}

export default App;
