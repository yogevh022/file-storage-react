import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MainApp from './mainApp';
import Login from './login';
import Collections from './collections';

function App() {

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Navigate to="/collections"/>}/>
        <Route path='/collections/:collectionId/' Component={MainApp} />
        <Route exact path='/collections' Component={Collections} />
        <Route path='/login' Component={Login} />
      </Routes>
    </Router>
  )
}

export default App;