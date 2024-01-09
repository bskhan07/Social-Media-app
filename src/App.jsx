import React from 'react'
import SignUp from './Components/SignUp/SignUp'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './Components/Login/Login'
import Home from './Components/Home/Home'
import AddPost from './Components/AddPost.jsx/AddPost'
import Mypost from './Components/Mypost/Mypost'
import Update from './Components/UpdatePost/Update'
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
          <Route path='/Home' element={<Home />} />
          <Route path='/addpost' element={<AddPost />} />
          <Route path='/mypost' element={<Mypost />} />
          <Route path='/updatepost' element={<Update />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App