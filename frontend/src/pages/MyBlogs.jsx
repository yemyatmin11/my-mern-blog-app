import axios from '../helpers/axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import BlogCard from '../components/BlogCard';


export default function MyBlogs() {

    let { id } = useParams();
    let [blogs, setBlogs] = useState([]);

    useEffect(() => {
        let fetchUserBlogs = async () => {
        let res = await axios.get(`/api/blogs/${id}/blogs`);
        if (res.status === 200) {
            setBlogs(res.data);
        }
        }
        fetchUserBlogs();
    }, [id]);

    console.log(blogs)

  return (
    <div className='px-8 lg:px-[200px]'>
        {!!blogs.length && blogs.map(blog => (
            <BlogCard key={blog._id} blog={blog} />
        ))}

        {!blogs.length && <p className='text-red-500 text-2xl text-center mt-10 font-bold'>No blogs!!</p>}
    </div>
  )
}
