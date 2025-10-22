import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './Components/Navbar'
import HomePage from './Pages/HomePage.jsx'
function App() {

  return (
    <BrowserRouter>
         <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />}  />

        
            </Routes>
    </BrowserRouter>
  )
}

export default App
