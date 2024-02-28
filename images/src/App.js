import React from 'react';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import Login from './components/login.js';
import Welcome from './components/Welcome.js'; // Assuming you have a Welcome component

const App = () => {
  return (
    <Router>
      <Routes>
      <Route exact path="/" element={<Login/>} />
      <Route path="/welcome" element={<Welcome/>} />
      </Routes>
    </Router>
  );
};

export default App;
