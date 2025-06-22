import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './assets/pages/Home'
import Error from './assets/pages/Error'
import About from './assets/pages/About'
import Account from './assets/pages/Account'
import Login from './assets/pages/Login'
import SignUp from './assets/pages/SignUp'
import Cart from './assets/pages/Cart'
import UploadItems from './assets/pages/UploadItems'
import ProductDetails from './assets/pages/ProductDetails'
import Buy from './assets/pages/buy'


function App() {
  const [admin, SetAdmin] = useState(false)
 useEffect(() => {
     if(sessionStorage.getItem('user')){
     const user = JSON.parse(sessionStorage.getItem('user'));
     if (user[0].role == 'admin') {
 
       SetAdmin(true)
 
     }}
 
   }, []);
  return (
    <BrowserRouter >
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='*' element={<Error />} />
        <Route path='/aboutus' element={<About />} />
        <Route path='/account' element={<Account />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/login' element={<Login />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/uploaditems' element={admin ? <UploadItems /> : <Error />} />
        <Route path='/product/:id' element={<ProductDetails />} />
        <Route path='/buy/:id' element={<Buy />} />
      
      </Routes>
    </BrowserRouter>
  )
}

export default App