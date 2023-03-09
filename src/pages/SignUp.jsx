import React, { useState } from 'react'
import {RiEyeCloseFill, RiEyeFill} from 'react-icons/ri'
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/img-sign_in.png'
import ButtonSignInGoogle from '../components/ButtonSignInGoogle';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { db } from '../firebase';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const { name, email, password } = formData;
  const navigate = useNavigate();

  function onChange(e){
    setFormData( (prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }
  async function onSumbit(e){
    e.preventDefault();
    try {
      if(!name || !email || !password){
        return toast.error("Please fill in the fields.")
      }else if(password.length<6){
        return toast.error("Password must contain at least 6 characters !!")
      }else{
        const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Add name
      updateProfile(auth.currentUser, {
        displayName: name,
      })
      const user = userCredential.user;

      const formDataCopy = { ...formData };
      // delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      // Add to collection in Cloud Firestore
      await setDoc( doc(db, "users", user.uid), formDataCopy);
      toast.success("Sign up was successful")
      navigate("/");

      }

    } catch (error) {
      toast.error(`An account with Email ${email} already exists.`)
    }
  }
  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold'>Sign Up</h1>
      <div className='flex justify-center flex-wrap items-center px-6 max-w-6xl mx-auto'>
        <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
          <img src={logo} alt='img-sign_in'
                className='w-full rounded-2xl'

          />
        </div>
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
          <form onSubmit={onSumbit} >
            <input
              className=' mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-solid border border-gray-300 rounded trasition ease-in-out'
              type='name'
              id='name'
              value={name}
              onChange={onChange}
              placeholder='Full name'
            />
            <input
              className=' mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-solid border border-gray-300 rounded trasition ease-in-out'
              type='email'
              id='email'
              value={email}
              onChange={onChange}
              placeholder='Email address'
            />
            <div className='relative mb-6'>
              <input
                className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded trasition ease-in-out'
                type={showPassword ? 'text' : 'password'}
                id='password'
                value={password}
                onChange={onChange}
                placeholder='Password'
              />
              {showPassword ?
                <RiEyeFill
                  className='absolute right-3 top-3 text-xl cursor-pointer'
                  onClick={() => setShowPassword( (prevState) => !prevState )}
                /> :
                <RiEyeCloseFill
                  className='absolute right-3 top-3 text-xl cursor-pointer'
                  onClick={() => setShowPassword( (prevState) => !prevState )}
                />
              }
            </div>
            <div className='flex justify-between mb-6 whitespace-nowrap text-sm sm:text-lg'>
              <p>Have an account?
                <Link
                  to="/sign-in"
                  className='text-red-500 hover:text-red-600 transition duration-200 ease-in-out ml-1'
                >
                  Sign In
                </Link>
              </p>
              <p >
                <Link
                  to="/forgot-password"
                  className='text-blue-600 hover:text-blue-700 transition duration-200 ease-in-out ml-1'
                >
                  Forgot password?
                </Link>
              </p>
            </div>
            <button
              className='w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-lg
              hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-xl active:bg-blue-800'
              type='submit'
            >
              Sign up
            </button>
            <div
              className='flex items-center my-4
              before:border-t before:flex-1 before:border-gray-300
              after:border-t after:flex-1 after:border-gray-300'
            >
              <p className='text-center font-semibold mx-4'>
                OR
              </p>
            </div>
            <ButtonSignInGoogle/>
          </form>

        </div>
      </div>
    </section>
  )
}

export default SignUp