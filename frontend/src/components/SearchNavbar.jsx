import React, { useEffect, useState } from 'react';
import { BsSearch } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom';
import axios from '../helpers/axios';

export default function SearchNavbar() {

    let [searchTerm, setSearchTerm] = useState('');
    let [searchData, setSearchData] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        if(searchTerm !== "") {
          let fetchBlogs = async () => {
            let res = await axios.get(`/api/blogs/search?t=${searchTerm}`);
            if(res.status === 200) {
              setSearchData(res.data);
            }
          }
          fetchBlogs();
        }
        else {
          setSearchData([]);
        }
    }, [searchTerm]);

    const handleSearch = () => {
        if(searchTerm) {
          navigate(`/search/${searchTerm}`);
          setSearchTerm('');
          setSearchData([]);
        }
    }

    const handleSuggestion = (blogId) => {
        navigate(`/blogs/${blogId}`);
        setSearchTerm('');
        setSearchData([]);
    }

  return (
    <>
        <button onClick={handleSearch}><BsSearch/></button>
        <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            type="text" 
            placeholder='Search a post' 
            className='outline-none px-3 py-1' 
        />
        {searchData.length > 0 && (
            <div className=' absolute top-12 left-0 w-full'>
                {searchData.map(blog => (
                    <div onClick={() => handleSuggestion(blog._id)} key={blog._id} className=' bg-gray-200 hover:bg-gray-50 p-3 block shadow-md cursor-pointer'>
                        {blog.title}
                    </div>
                )) }
            </div>
        )}
    </>
  )
}
