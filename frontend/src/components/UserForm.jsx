import React, { useContext, useEffect, useState } from 'react';
import axios from '../helpers/axios';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../contexts/AuthContext';

export default function UserForm({user}) {

    let { id } = useParams();
    let [name, setName] = useState('');
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [errors, setErrors] = useState(null);
    let [file, setFile] = useState(null);
    let [preview, setPreview] = useState(null);
    console.log(user)
    let { dispatch } = useContext(AuthContext);
    const navigate = useNavigate(); 

    const fetchUser = async () => {
        try {
            let res = await axios.get(`/api/users/${id}`);
            if (res.status === 200) {
                setName(res.data.name);
                setEmail(res.data.email);
                setPreview(`${import.meta.env.VITE_BACKEND_URL}/users/${res.data.photo}`);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            // Handle error state or log appropriately
        }
    };

    useEffect(() => {
        if (id) {
            fetchUser();
        }
    }, [id]);
    

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setErrors(null);

            // if (!file) {
            //     setErrors({ photo: { msg: 'Photo is required' } });
            //     return;
            // }

            let data = {
                name,
                email,
                password
            };
    
            let res = await axios.patch(`/api/users/${id}`, data);

            if(res.status === 200) {
                let formData = new FormData();
                formData.set('photo', file);

                let uploadRes = await axios.post(`/api/users/${id}/upload`, 
                    formData , {
                        headers : {
                            Accept : 'multipart/form-data'
                        }
                    }
                );
                
                if(uploadRes.status === 200) {
                    const updatedUserRes = await axios.get('/api/users/me')
                    if(updatedUserRes.status === 200) {
                        dispatch({ type : 'LOGIN', payload : updatedUserRes.data})
                        toast.success('Updated Profile Successfully');
                        navigate('/');
                    }
                }
            }
        }   catch (e) {
            setErrors(e.response.data.errors);
        }
    };

    let upload = (e) => {
        let file = e.target.files[0];
        setFile(file);

        let fileReader = new FileReader();

        fileReader.onload = (e) => {
            setPreview(e.target.result);
        };

        fileReader.readAsDataURL(file);
    }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col space-y-5'>
        <input 
            onChange={upload} 
            type="file" 
        />
        {preview && <img src={preview} alt="" className='w-16 h-16'/>}
        {/* {!!(errors && errors.photo) && <span className='text-red-600 text-sm italic'>{errors.photo.msg}</span>}  */}
        
        <input
            value={name}
            onChange={e => setName(e.target.value)}
            className='w-full px-2 py-1 outline-none rounded-sm'    
            type="text"
            placeholder='Your username' 
        />
        {!!(errors && errors.name) && <span className='text-red-600 text-sm italic'>Name is {errors.name.msg}</span>} 

        <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='w-full px-2 py-1 outline-none rounded-sm' 
            type="text" 
            placeholder='Your email' 
        />
        {!!(errors && errors.email) && <span className='text-red-600 text-sm italic'>E-mail is {errors.email.msg}</span>}

        <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='w-full px-2 py-1 outline-none rounded-sm' 
            type="password" 
            placeholder='Your password' 
        />
        {!!(errors && errors.password) && <span className='text-red-600 text-sm italic'>{errors.password.msg}</span>}

        <button type='submit' className='w-full font-bold bg-black text-white text-center px-2 py-1 rounded-lg hover:bg-gray-500 hover:text-black'>Update</button>
    </form>
  )
}
