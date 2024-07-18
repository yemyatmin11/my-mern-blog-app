import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../helpers/axios'


export default function Register() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState(null);

    const navigate = useNavigate();

    const register = async (e) => {
        try {
            e.preventDefault();
            setErrors(null);
            let data = {
                name,
                email,
                password
            }
    
            let res = await axios.post('/api/users/register', data);

            if(res.status === 200) {
                navigate('/login');
            }
        } catch (e) {
            setErrors(e.response.data.errors);
        }
    }

  return (
    <div className='w-full h-[70vh] flex items-center justify-center'>
        <div className='flex flex-col p-5 max-w-md space-y-4'>
            <h1 className='text-xl font-bold text-center'>Create an account</h1>
            <form onSubmit={register} className='space-y-3'>
                <input 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className='w-full px-3 py-2 outline-none border-2 border-black'
                    type="text" 
                    id='username' 
                    placeholder='Enter your username' />
                {!!(errors && errors.name) && <span className='text-red-600 text-sm italic'>Name is {errors.name.msg}</span>}  
                <input 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className='w-full px-3 py-2 outline-none border-2 border-black'
                    type="email" 
                    id='email' 
                    placeholder='Enter your email' />
                {!!(errors && errors.email) && <span className='text-red-600 text-sm italic'>E-mail is {errors.email.msg}</span>}  
                <input 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className='w-full px-3 py-2 outline-none border-2 border-black'
                    type="password" 
                    id='password' 
                    placeholder='Enter your password' />
                {!!(errors && errors.password) && <span className='text-red-600 text-sm italic'>Password is {errors.password.msg}</span>}  
                <button 
                    type='submit'
                    className='w-full font-bold bg-black text-white text-center px-3 py-2 rounded-lg hover:bg-gray-500 hover:text-black'
                >   
                    Register
                </button>
                <div className='flex items-center justify-center gap-3'>
                    <p>Already have an account?</p>
                    <Link className='text-gray-500 hover:text-black' to='/login'>Login</Link>
                </div>
            </form>
        </div>
    </div>
  )
}
