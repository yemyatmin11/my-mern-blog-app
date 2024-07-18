import React, { useEffect, useState } from 'react'
import BlogCard from '../components/BlogCard'
import axios from '../helpers/axios';
import { useParams } from 'react-router-dom';


export default function SearchResult() {

    let { term } = useParams();
    let [blogs, setBlogs] = useState([]);

    useEffect(() => {
        if(term) {
            let fetchBlogs = async () => {
                let res = await axios.get(`/api/blogs/search?t=${term}`);
                if(res.status === 200) {
                    setBlogs(res.data);
                }
            }
            fetchBlogs();   
        }
    },[term])


  return (
    <div className='px-8 lg:px-[200px]'>
        {!!blogs.length && blogs.map(blog => (
            <BlogCard key={blog._id} blog={blog} />       
        ))}

        {!blogs.length && <p className='text-red-600 text-center mt-20 text-2xl font-bold'>No blogs found.</p>}
    </div>
  )
}
