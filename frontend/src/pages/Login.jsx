import axios from '../helpers/axios';
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext';


export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    let { dispatch } = useContext(AuthContext);

    const navigate = useNavigate();

    const login = async (e) => {
        try {
            e.preventDefault();
            let data = {
                email,
                password
            };

            let res = await axios.post('/api/users/login', data, {
                withCredentials : true
            });

            if(res.status === 200) {
                dispatch({ type : 'LOGIN', payload : res.data.user})
                navigate('/');
            }

        } catch (e) {
            setError(e.response.data.error);
        }
    }


  return (
    <div className='w-full h-[70vh] flex items-center justify-center'>
        <div className='flex flex-col max-w-md p-5 space-y-4'>
            <h1 className='text-xl font-bold text-center'>Log in to your account</h1>
            <form onSubmit={login} className='space-y-3'>
                <input
                    value={email}
                    onChange={e => setEmail(e.target.value)} 
                    className='w-full px-3 py-2 outline-none border-2 border-black'
                    type="email" 
                    id='email' 
                    placeholder='Enter your email' />
                {!!error && <span className='text-sm text-red-600 italic'>{error}</span>}
                <input
                    value={password}
                    onChange={e => setPassword(e.target.value)} 
                    className='w-full px-3 py-2 outline-none border-2 border-black'
                    type="password" 
                    id='password' 
                    placeholder='Enter your password' />
                <button type='submit' className='w-full font-bold bg-black text-white text-center px-3 py-2 rounded-lg hover:bg-gray-500 hover:text-black'>Log in</button>
                <div className='flex items-center justify-center gap-3'>
                    <p>New Here?</p>
                    <Link className='text-gray-500 hover:text-black' to='/register'>Register</Link>
                </div>
            </form>
        </div>
    </div>
  )
}
