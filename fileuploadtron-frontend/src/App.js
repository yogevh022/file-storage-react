import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MainApp from './mainApp';
import Login from './login';

function App() {

  return (
    <Router>
      <Routes>
        <Route exact path='/' Component={MainApp}/>
        <Route path='login/' Component={Login}/>
      </Routes>
    </Router>
  )
}

export default App;