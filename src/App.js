import React from 'react';
import Header from './Header';
import Footer from './Footer';

import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
import Body from './Body';
import Summary from './summary';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<><div className="app-container"><Header/><Body/><Footer/></div></>} />
        <Route path="/summary" element={<Summary/>} />
      </Routes>
    </Router>
  );
};

export default App;
