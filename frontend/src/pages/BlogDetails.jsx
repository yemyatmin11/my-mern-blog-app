import React, { useContext, useEffect, useState } from 'react';
import CommentForm from '../components/CommentForm';
import CommentList from '../components/CommentList';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from '../helpers/axios';
import editIcon from '../assets/edit.svg';
import deleteIcon from '../assets/delete.svg';
import toast from 'react-hot-toast';
import { AuthContext } from '../contexts/AuthContext';

const BlogDetails = () => {
    let { id } = useParams();
    let [blog, setBlog] = useState(null);
    let [comments, setComments] = useState([]);
    let [editComment, setEditComment] = useState(null);
    let { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSingleBlog = async () => {
            try {
                let res = await axios.get(`/api/blogs/${id}`);
                if (res.status === 200) {
                    setBlog(res.data);
                }
            } catch (e) {
                console.error('Error fetching blog:', e);
            }
        };
        fetchSingleBlog();
    }, [id]);

   
    const fetchPostComments = async () => {
        try {
            let res = await axios.get(`/api/comments/post/${id}`);
            if (res.status === 200) {
                setComments(res.data);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    useEffect(() => {
        fetchPostComments()
    }, [id])
    

    if (!blog && !user) {
        return <div>Loading...</div>;
    };

    const deleteBlog = async () => {
        try {
            let res = await axios.delete(`/api/blogs/${id}`);
            if (res.status === 200) {
                toast.success('Blog deleted successfully!');
                navigate('/');
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
        }
    };

    const isOwner = blog.userId?._id === user?._id;

    return (
        <div className='container mx-auto mt-8 px-8'>
            <h1 className='text-xl font-semibold'>{blog.title}</h1>
            <div className='flex items-center justify-end space-x-3'>
                {isOwner && (
                    <>
                        <Link to={`/edit/${blog._id}`}>
                            <img 
                                className='cursor-pointer' 
                                src={editIcon} 
                                alt="Edit Icon" 
                            />
                        </Link>
                        <img 
                            onClick={() => deleteBlog(blog._id)}
                            className='cursor-pointer' 
                            src={deleteIcon} 
                            alt="Delete Icon" 
                        />
                    </>
                )}
            </div>
            <div className='flex items-center justify-between mt-3'>
                <p>{blog.userId.name}</p>
                <div className='flex gap-3'>
                    <p>{new Date(blog.createdAt).toLocaleString()}</p>
                </div>
            </div>
            <div className='flex items-center justify-center mt-3'>
                <img 
                    className='h-60 rounded-md'
                    src={`${import.meta.env.VITE_BACKEND_URL}/blogs${blog.photo}`} 
                    alt="Blog" 
                />
            </div>
            <p className='mt-8' style={{ whiteSpace: 'pre-line' }}>{blog.description}</p>
            <div className='flex flex-wrap gap-3 mt-7 space-x-4'>
                <p>Categories: </p>
                {blog.categories.length && blog.categories.map((category, index) => (
                    <span key={index} className='bg-neutral-300 px-2 rounded font-semibold'>{category}</span>
                ))}
            </div>
            
            {/* Comments */}
            <div>
                <h1 className='text-center text-2xl font-bold my-3'>Comments</h1>
                <CommentForm 
                    fetchPostComments={fetchPostComments}
                    editComment={editComment}
                    setEditComment={setEditComment}
                />

                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <CommentList 
                            key={comment._id} 
                            comment={comment} 
                            setComments={setComments} 
                            fetchPostComments={fetchPostComments}
                            editComment={editComment}
                            setEditComment={setEditComment}
                        />
                    ))
                ) : (
                    <p>No comments yet.</p>
                )}
            </div>
        </div>
    );
};

export default BlogDetails;
