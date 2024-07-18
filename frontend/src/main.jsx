import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Routes from './routes/index.jsx';
import { AuthContextProvider } from './contexts/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';


ReactDOM.createRoot(document.getElementById('root')).render(
  
  <AuthContextProvider>
    <Routes/>
    <Toaster position="top-right" />
  </AuthContextProvider>
  
)
