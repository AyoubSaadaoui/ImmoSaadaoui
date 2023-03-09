import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import React from 'react'
import { FcGoogle } from 'react-icons/fc'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { db } from '../firebase'

export default function ButtonSignInGoogle() {
  const navigate = useNavigate();
  async function onGoogleClick() {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user

      // check for the user
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if(!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
          type: user.providerData[0].providerId
        });
        toast.success("Sign up was successful")
      }else{
        toast.success(`Welcome ${user.displayName}!`)
      }

      navigate("/")

    } catch (error) {
      toast.error("Could not authorize with Google");
    }
  }
  return (
    <button

      className='flex items-center justify-center w-full bg-red-700 text-white px-7 py-3 uppercase text-sm font-medium
      hover:bg-red-800 active:bg-red-900 shadow-md hover:shadow-lg active:shadow-lg
      transition duration-150 ease-in-out rounded'
      type='button'
      onClick={onGoogleClick}
    >
        <FcGoogle
            className='text-2xl bg-white rounded-full mr-2'
        />
        Continue with Google
    </button>
  )
}
