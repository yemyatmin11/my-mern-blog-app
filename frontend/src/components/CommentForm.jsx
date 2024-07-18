import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import axios from '../helpers/axios';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function CommentForm({ fetchPostComments, editComment, setEditComment, type = 'Add'}) {

  let { id } = useParams();
  let [comment, setComment] = useState('');
  let { user } = useContext(AuthContext);

  useEffect(() => {
    if(type === 'Update' && editComment) {
      setComment(editComment.comment);
    }
  }, [type, editComment]);

  let postComment = async(e) => {
    e.preventDefault();
    try {
      let commentData = {
        comment,
        author : user.name,
        authorPhoto : user.photo,
        postId : id,
        userId : user._id
      }

      let res;
      if(type === 'Update' && editComment) {
        res = await axios.patch(`/api/comments/${editComment._id}`, commentData);
      }else {
        res = await axios.post(`/api/comments/`, commentData, {withCredentials : true});
      }

      if(res.status === 200) {
        setComment('');
        setEditComment(null);
        fetchPostComments();
      }
    } catch (e) {
      console.error(e);
      toast.error('Please log in to write a comment. :(')
    } 
  }

  


  return (
    <form onSubmit={postComment}>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)} 
          className='bg-gray-50 w-full p-3 shadow-md border-2 outline-none'
          cols={30}
          rows={5}
        >
        </textarea>
        <div className='flex space-x-3'>
          <button 
            type='submit'
            className='bg-black text-white px-2 py-1 my-3 rounded-lg font-semibold hover:bg-gray-400 hover:text-black'
          >
            {type === 'Update' ? 'Update' : 'Add'} Comment
          </button>
          {type === 'Update' && <button
          type='button'
            onClick={() => setEditComment(null)}
            className='border-2 border-black px-2 py-1 my-3 rounded-lg font-semibold hover:bg-gray-400 hover:text-black'
          >
            Cancel
          </button>}
        </div>
    </form>
  )
}
