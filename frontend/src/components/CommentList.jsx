import React, { useContext } from 'react';
import editIcon from '../assets/edit.svg';
import deleteIcon from '../assets/delete.svg';
import axios from '../helpers/axios';
import moment from 'moment';
import CommentForm from './CommentForm';
import { AuthContext } from '../contexts/AuthContext';

const CommentList = ({ comment, setComments, fetchPostComments, editComment, setEditComment }) => {

    let { user } = useContext(AuthContext);

    let deleteComment = async(commentId) => {
        try {
            let res = await axios.delete(`/api/comments/${commentId}`);
            if(res.status === 200) {
                setComments(prevComments => prevComments.filter((c) => c.id !== commentId));
                fetchPostComments();
            }
        } catch (e) {
            console.error('Error deleting comment:', e);
        }
    };
    

    const isOwner = comment.userId === user._id;

  return (
    <div className='my-5 bg-gray-50 border-2 shadow-md p-3 rounded-lg'>
        <div className='flex items-center justify-between space-x-3'>
            <div className='flex space-x-3'>
                <img src={import.meta.env.VITE_BACKEND_URL + '/users' + comment.authorPhoto} alt="Profile" className='w-12 h-12 rounded-full' />
                <div>
                    <h3>{comment.author}</h3>
                    <p className='text-gray-400 text-sm'>{moment(comment.createdAt).fromNow()}</p>
                </div>
            </div>
            {isOwner && (
                <div className='flex space-x-3'>
                    <img src={editIcon} onClick={() => setEditComment(comment)} className='cursor-pointer' alt="Edit" />
                    <img onClick={() => deleteComment(comment._id)} src={deleteIcon} className='cursor-pointer' alt="Delete" />
                </div>
            )}
        </div>
        <div className='mt-3'>
            {editComment?._id !== comment._id && comment.comment}
            {editComment?._id === comment._id && 
                <CommentForm 
                    type='Update' 
                    editComment={editComment} 
                    setEditComment={setEditComment} 
                    fetchPostComments={fetchPostComments}
                />
            }
        </div>
    </div>
  );
};

export default CommentList;
