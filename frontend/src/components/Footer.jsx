import React from 'react'

export default function Footer() {
  return (
    <div className='bg-black text-white mt-8'>
      <div className='flex flex-wrap gap-9 items-center lg:justify-between w-1/2 mx-auto py-10 text-sm'>
        <div className='space-y-2'>
          <p>Featured Blogs</p>
          <p>Most viewed</p>
          <p>Readers Choice</p>
        </div>
        <div className='space-y-2'>
          <p>Forum</p>
          <p>Support</p>
          <p>Recent Posts</p>
        </div>
        <div className='space-y-2'>
          <p>Privacy Policy</p>
          <p>About Us</p>
          <p>Terms & Conditions</p>
          <p>Terms of Service</p>
        </div>
      </div>
      <p className='text-center py-2 pb-2'>All rights reserved @Blog Market 2023</p>
    </div>
  )
}
