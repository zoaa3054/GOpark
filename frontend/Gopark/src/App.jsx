import { useState, useEffect } from 'react';
import {Route, createRoutesFromElements, RouterProvider, createBrowserRouter} from 'react-router-dom';
import MainPage from './Pages/MainPage';
import SystemAdminLoginPage from './Pages/SystemAdminLoginPage';
import ParkAdminLoginPage from './Pages/ParkAdminLoginPage';
import EmptyPage from './Pages/EmptyPage';
import SystemAdminMainPage from './Pages/SystemAdminMainPage';
import ParkAdminMainPage from './Pages/ParkAdminMainPage';
import SignupPage from './Pages/SignupPage';
import ForgotPasswordPage from './Pages/ForgotPasswordPage';
import DriverProfilePage from './Pages/DriverProfilePage';
import WelcomePage from './Pages/WelcomePage';
import LoginPage from './Pages/LoginPage';

function App() {
  
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* <Route index element={<HomePage/>}/>
        <Route path='/blogs' element={<BlogsCards submit={postBlog} delBlog={delBlog} databaseSrc={databaseSrc}/>}/> */}
        <Route Route path='/' element={<WelcomePage/>} errorElement= {<EmptyPage/>}/>
        <Route Route path='/main' element={<MainPage/>} errorElement= {<EmptyPage/>}/>
        <Route path='/system/admin/main' element={<SystemAdminMainPage/>} errorElement= {<EmptyPage/>}/>
        <Route path='/park/admin/main' element={<ParkAdminMainPage/>} errorElement= {<EmptyPage/>}/>
        <Route path='/profile' element={<DriverProfilePage/>} errorElement= {<EmptyPage/>}/>
        <Route path='/signup' element={<SignupPage/>} errorElement= {<EmptyPage/>}/>
        <Route path='/login' element={<LoginPage/>} errorElement= {<EmptyPage/>}/>
        <Route path='/system/admin/login' element={<SystemAdminLoginPage/>} errorElement= {<EmptyPage/>}/>
        <Route path='/park/admin/login' element={<ParkAdminLoginPage/>} errorElement= {<EmptyPage/>}/>
        <Route path='/forgotpassword' element={<ForgotPasswordPage/>} errorElement= {<EmptyPage/>}/>
        <Route path='*' element={<EmptyPage/>}/>
      </>
  ));
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
