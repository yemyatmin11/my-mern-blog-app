import React, { useContext } from 'react';
import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import BlogDetails from '../pages/BlogDetails.jsx';
import BlogForm from '../pages/BlogForm.jsx';
import App from '../App.jsx';

import {
    createBrowserRouter,
    Navigate,
    RouterProvider
  } from "react-router-dom";
import { AuthContext } from '../contexts/AuthContext.jsx';
import SearchResult from '../pages/SearchResult.jsx';
import Profile from '../pages/Profile.jsx';
import MyBlogs from '../pages/MyBlogs.jsx';

export default function index() {

  let { user } = useContext(AuthContext);

  const router = createBrowserRouter([
      {
        path : "/",
        element : <App/>,
        children : [
          {
            path : "/", //http://localhost:5173/
            element : <Home/>
          },
          {
            path : "/blogs/:id", //http://localhost:5173/blogs/:id
            element : user ? <BlogDetails/> : <Navigate to={'/login'}/>
          },
          {
            path : "/search/:term", //http://localhost:5173/blogs/search/:id
            element : <SearchResult/>
          },
          {
            path : "/create", //http://localhost:5173/create
            element : user ? <BlogForm/> : <Navigate to={'/login'}/>
          },
          {
            path : "/edit/:id", //http://localhost:5173/edit/:id
            element : user ? <BlogForm/> : <Navigate to={'/login'}/>
          },
          {
            path : "/profile/:id", //http://localhost:5173/profile/:id
            element : user ? <Profile/> : <Navigate to={'/login'}/>
          },
          {
            path : "/myblogs/:id", //http://localhost:5173/profile/:id
            element : user ? <MyBlogs/> : <Navigate to={'/login'}/>
          },
          {
            path : "/login", //http://localhost:5173/login
            element : !user ? <Login/> : <Navigate to={'/'} />
          },
          {
            path : "/register", //http://localhost:5173/register
            element : !user ? <Register/> : <Navigate to={'/'} />
          }, 
        ]
      }
    ])
  return (
    <RouterProvider router={router} />
  )
}
