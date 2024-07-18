import React, { useContext, useEffect, useState } from 'react'
import axios from '../helpers/axios';
import { useNavigate, useParams } from 'react-router-dom';
import Categories from '../components/Categories';
import { AuthContext } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function BlogForm() {

  let { id } = useParams();
  let [title, setTitle] = useState('');
  let [description, setDescription] = useState('');
  let [categories, setCategories] = useState([]);
  let [newCategory, setNewCategory] = useState('');
  let [errors, setErrors] = useState([]);
  let [file, setFile] = useState(null);
  let [preview, setPreview] = useState(null);
  let { user } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    if(id) {
      let fetchBlogs = async () => {
        let res = await axios.get(`/api/blogs/${id}`);
        if(res.status === 200) {
          setTitle(res.data.title);
          setDescription(res.data.description);
          setCategories(res.data.categories);
          setPreview( import.meta.env.VITE_BACKEND_URL + '/blogs' +res.data.photo);
        }
      }
      fetchBlogs();
    }
  }, [id]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let blog = {
        title,
        description,
        categories,
        userId : user._id
      }
      
      let res;
      if(id) {
        res = await axios.patch(`/api/blogs/${id}`, blog);
      }
      else {
        res = await axios.post('/api/blogs', blog);
      }

      let formData = new FormData();
      formData.set('photo', file);

      let uploadRes = await axios.post(`/api/blogs/${res.data._id}/upload`, 
      formData, {
        headers : {
          Accept : "multipart/form-data"
        }
      })
      
      if(res.status === 200) {
        if(id) {
          toast.success('Updated Blog Successfully');
          navigate('/');
        }
        else {
          toast.success('Create Blog Successfully');
          navigate('/');
        }
        
      }
    } catch (e) {
      setErrors(Object.keys(e.response.data.errors));
    }
  };

  let upload = (e) => {
    let file = e.target.files[0];
    if(file) {
      setFile(file);

      let fileReader = new FileReader();

      fileReader.onload = (e) => {
        setPreview(e.target.result);
      }

      fileReader.readAsDataURL(file);
    }
  }
  

  return (
    <div className='container mx-auto mt-4 px-5'>
        <div className='bg-gray-200 p-3 rounded-lg shadow-md max-w-md mx-auto'>
            <h1 className='text-center font-bold text-2xl mb-3'>{ id ? 'Edit' : 'Create'} Post</h1>
            <form onSubmit={handleSubmit} className='flex flex-col space-y-5'>
              <ul className='list-disc px-4'>
                {!!errors.length && errors.map((error,index) => (
                  <li className='text-red-600 text-sm' key={index}>{error} is invalid value</li>
                ))}
              </ul>

              <input 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                className='w-full px-2 py-1 outline-none rounded-sm' 
                type="text" 
                placeholder='Enter post title' 
              />

              <input
                onChange={upload} 
                className='w-full px-2 py-1 outline-none rounded-sm' 
                type="file" 
              />
              <div className='flex items-center justify-center'>
                {preview && <img className='w-60' src={preview} alt="Preview Blog Photo" />}
              </div>
              
              <Categories 
                newCategory={newCategory}
                setNewCategory={setNewCategory}
                categories={categories}
                setCategories={setCategories}
              />

              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)}
                className='w-full px-2 py-1 outline-none rounded-sm' 
                rows={5} 
                placeholder='Enter a description'>
              </textarea>

              <button 
                type='submit' 
                className='w-full font-bold bg-black text-white text-center px-3 py-2 rounded-lg hover:bg-gray-500 hover:text-black'
              >
                { id ? 'Edit' : 'Create'}
              </button>
          </form>
        </div>
    </div>
  )
}
