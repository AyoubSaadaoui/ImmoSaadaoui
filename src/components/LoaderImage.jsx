import React from 'react'
import logo from '../assets/loaderImage.gif'

export default function LoaderImage() {
  return (
    <div className='bg-black bg-opacity-50 flex items-center justify-center fixed left-0 right-0 top-0 bottom-0 z-50'>
        <div>
            <img  src={logo} alt='Loading...' className='h-24'/>
        </div>
    </div>

  )
}
