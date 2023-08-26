import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Body from './Body';
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <Header />
      <Body />
      <Footer />
    </div>
  );
};

export default App;
