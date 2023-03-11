import { getAuth } from 'firebase/auth';
import React, { useState } from 'react'
import { useNavigate } from 'react-router';

function Profile() {
  const auth = getAuth()
  const navigate = useNavigate();
  const [fromData, setFromData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })
  const { name, email } = fromData;
  function onLogout() {
    // User is signed out.
    auth.signOut();
    navigate("/")
  }

  return (
    <>
      <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
        <h1 className='text-3xl text-center mt-6 font-bold'>My Profile</h1>
        <div className='w-full md:w-[50%] mt-6 px-3'>
          <form>
            <input
              type='text'
              id='name'
              value={name}
              className=' mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white
              border-gray-300 rounded transition ease-in-out'
            />
            <input
              type='email'
              id='email'
              value={email}
              className=' mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white
              border-gray-300 rounded transition ease-in-out'
            />
            <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6'>
              <p className='flex items-center'>
                Do you want to change your name?
                <span
                  className=' text-red-600 hover:text-red-700 transition ease-in-out duration-200
                  cursor-pointer ml-1'
                >
                  Edit
                </span>
              </p>
              <p
                className='text-blue-600 hover:text-blue-700 transition ease-in-out duration-200
                cursor-pointer'
                onClick={onLogout}
              >
                Sign out
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}

export default Profile