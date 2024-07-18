import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../helpers/axios'
import { AuthContext } from '../contexts/AuthContext';
import SearchNavbar from './SearchNavbar';


export default function Navbar() {

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  let { user, dispatch } = useContext(AuthContext);
  

  let handleToogle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  }

  let logout = async () => {
    let res = await axios.post('/api/users/logout');
    if(res.status === 200) {
      dispatch({ type : 'LOGOUT'});
      navigate('/login');
    }
  }

  return (
    <div className='flex flex-wrap items-center justify-between px-6 lg:px-[200px] py-4 border-b-2 shadow-md'>
        <Link to='/' className='font-extrabold text-2xl lg:text-xl mb-3 lg:mb-0'>
          <h3>Blog Market</h3>
        </Link>
        <div className='flex items-center justify-center relative'>
          <SearchNavbar/>
        </div>
        <div className='flex items-center justify-center mt-3 lg:mt-0 space-x-2 lg:space-x-4'>
          {!user && <p><Link to='/login'>Login</Link></p>}
          {!user && <p><Link to='/register'>Register</Link></p>}
          
          
          <div className='relative'>
            {!!user && (
              <div className='flex items-center space-x-5 lg:space-x-3'>
                <Link to='/create'>Create</Link>
                <img 
                  onClick={handleToogle}
                  src={import.meta.env.VITE_BACKEND_URL + '/users' + user.photo} 
                  alt="Profile Icon" 
                  className='cursor-pointer w-10 h-10 rounded-full border' 
                />
                {isDropdownOpen && (
                  <div  className='absolute right-30 lg:right-0 mt-40 w-48 bg-white rounded-md shadow-lg z-10'>
                    <div>
                      <Link 
                        onClick={handleToogle}
                        to={`/profile/${user._id}`} 
                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'>Profile</Link>
                    </div>
                    <div onClick={handleToogle}>
                      <Link
                        to='/create'
                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'>Create</Link>
                    </div>
                    <div onClick={handleToogle}>
                      <Link
                        to={`/myblogs/${user._id}`}
                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'>My Blogs</Link>
                    </div>
                    <div onClick={handleToogle}>
                      <Link onClick={logout} className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'>Logout</Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div> 
    </div>
  )
}
