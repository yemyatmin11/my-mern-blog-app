import React from 'react';
import addIcon from '../assets/addCircle.svg';
import { ImCross } from 'react-icons/im';

export default function Categories({ newCategory, setNewCategory, categories, setCategories}) {


    const addCategory = () => {
        setCategories(prevState => [newCategory,...prevState]);
        setNewCategory('')
    }
    
    const deleteCategory = (index) => {
        setCategories(prevState => prevState.filter((category, i) => i !== index));
    };


  return (
   
    <>
        <div className='flex items-center justify-center space-x-3'>
            <input 
                value={newCategory} 
                onChange={e => setNewCategory(e.target.value)}
                className='w-full px-2 py-1 outline-none rounded-sm' 
                type="text" 
                placeholder='Enter post category' 
            />
            {newCategory && <img onClick={addCategory} className='cursor-pointer w-6' src={addIcon} alt="Add Icon" />}
            </div>

            <div className='flex flex-wrap gap-3 '>
            {!!categories.length && categories.map((category, index) => (
                <div key={index} className='flex bg-neutral-300 p-1 rounded space-x-3' >     
                    <span className='font-semibold'>{category}</span>
                    <p onClick={() =>deleteCategory(index)} className='text-white bg-black rounded-full cursor-pointer p-1 text-sm'><ImCross/></p>
                </div>
            ))}
        </div>
    </>
  )
}
