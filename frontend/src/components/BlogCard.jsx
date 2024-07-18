import React from 'react';
import { Link } from 'react-router-dom'

export default function BlogCard({ blog }) {
  
  return (
    <div className='flex flex-wrap justify-center mt-8 lg:space-x-5'>
      <Link to={`/blogs/${blog._id}`} className='w-full lg:w-1/4 mb-3'>
        <img src={ import.meta.env.VITE_BACKEND_URL + '/blogs' + blog.photo } alt="" className='w-60 h-auto rounded-lg' />
      </Link>
      <Link to={`/blogs/${blog._id}`} className='w-full max-w-xl lg:h-3/4 space-y-3 mb-10'>
        <h1 className='font-bold text-xl lg:mb-2 mb-1 lg:text-2xl'>{blog.title}</h1>
        <div className='flex items-center justify-between text-sm text-neutral-500'>
          <p>{blog.userId ? blog.userId.name : 'Unknown User'}</p>
          <div className='flex space-x-2'>
            <p>{new Date(blog.createdAt).toLocaleString()}</p>
          </div>
        </div>
        <p className='text-sm lg:text-base'>{blog.description.substring(0,150)} . . . .  <span className='text-sm text-gray-400'>see more</span></p>
      </Link>
    </div>
  )
}
