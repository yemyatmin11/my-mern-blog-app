import React, { useContext, useEffect, useState } from 'react';
import BlogCard from '../components/BlogCard';
import axios from '../helpers/axios';
import { useParams } from 'react-router-dom';
import mailIcon from '../assets/mailBox.svg';
import UserForm from '../components/UserForm';
import { AuthContext } from '../contexts/AuthContext';

export default function Profile() {

  let { id } = useParams();
  let [blogs, setBlogs] = useState([]);
  let { user } = useContext(AuthContext)

  useEffect(() => {
    let fetchUserBlogs = async () => {
      let res = await axios.get(`/api/blogs/${id}/blogs`);
      if (res.status === 200) {
        setBlogs(res.data);
      }
    }
    fetchUserBlogs();
  }, [id]);


  return (
    <div className='container mx-auto mt-8'>
      <div className='grid grid-cols-1 lg:grid-cols-[2.5fr_1fr] gap-4 px-5'>
        {user && (
          <div className='space-y-5 order-2 lg:order-1'>
            <div className='flex space-x-3 my-5 lg:my-0 lg:px-10'>
              <img src={import.meta.env.VITE_BACKEND_URL + '/users' + user.photo} alt="" className='w-16 h-16 rounded-full' />
              <div>
                <h4 className='text-xl font-bold'>{user.name}</h4>
                <div className='flex space-x-1'>
                  <img src={mailIcon} alt="Mail Box" />
                  <p>{user.email}</p>
                </div>
              </div>
            </div>
            <div>
              {!!blogs.length && blogs.map(blog => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
              {!blogs.length && <p className='text-red-500 text-2xl text-center mt-10 font-bold'>No blogs!!</p>}
            </div>
          </div>
        )}
        <div className='max-w-xs bg-gray-200 shadow-md rounded-lg p-3 space-y-3 order-1 lg:order-2 h-96 overflow-y-auto'>
          <h1 className='font-bold text-center text-xl'>Profile</h1>
          <UserForm user={user}/>
        </div>
      </div>
    </div>
  )
}
