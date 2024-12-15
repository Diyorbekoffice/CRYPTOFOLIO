import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './components/pages/Home';
import Details from './components/pages/Details';
import Watchlist from './components/pages/Watchlist';

function App() {
  
  return (
    <Routes>
      <Route path='/' element={<Layout><Home /></Layout>} />
      <Route path="/details/:id" element={<Layout><Details /></Layout>} />
      <Route path='/watchlist' element={<Watchlist />} />
    </Routes>
  );
}

export default App;
