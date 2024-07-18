import React, { useEffect, useState } from 'react'
import BlogCard from '../components/BlogCard'
import axios from '../helpers/axios';
import Pagination from '../components/Pagination';
import { useLocation } from 'react-router-dom';


export default function Home() {

  const [blogs, setBlogs] = useState([]);
  const [links, setLinks] = useState(null);
  let location = useLocation();
  let searchedQuery = new URLSearchParams(location.search);
  let page = parseInt(searchedQuery.get('page') || 1);


  useEffect(() => {
    let fetchBlogs = async () => {
      try {
        let res = await axios.get(`/api/blogs?page=${page}`)
        if(res.status === 200) {
          setLinks(res.data.links)
          setBlogs(res.data.data);

          window.scroll({ top : 0, left : 0, behavior : 'smooth'});
        }
      } catch (e) {
        console.error('Error fetching blog:', e);
      }
    }
    fetchBlogs();
  }, [page]);


  return (
    <div className='px-8 lg:px-[200px]'>
      {!!blogs.length && blogs.map(blog => (
        <BlogCard key={blog._id} blog={blog} />
      ))}

      {!!links && <Pagination links={links} page={page}/>}
    </div>
  )
}
