import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { db } from '../firebase';

export default function Contact({ userRef, listing }) {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState("");
    useEffect(() => {
        async function getLandlord() {
            const docRef = doc(db, "users", userRef);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setLandlord(docSnap.data());
            } else {
                toast.error("Cloid not get landlord data");
            }
        }
        getLandlord();
    }, [userRef])

    function onChange(e) {
        setMessage(e.target.value)
    }
  return (
    <>{landlord !== null && (
        <div className='flex flex-col w-full'>
            <p>
                Contact {landlord.name} for the {listing.name.toLowerCase()}
            </p>
            <div className='mt-3 mb-6'>
                <textarea
                    name='message'
                    id='message'
                    rows='2'
                    value={message}
                    onChange={onChange}
                    className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'
                ></textarea>
            </div>
            <a href={`mailto:${landlord.email}?Subject=${listing.name}&body=${message}`}>
                <button className='px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg w-full text-center transition duration-150 ease-in-out '>
                    Send Message
                </button>
            </a>
            <div
              className='flex items-center my-4
              before:border-t before:flex-1 before:border-gray-300
              after:border-t after:flex-1 after:border-gray-300'
            >
              <p className='text-center font-semibold mx-4'>
                OR
              </p>
            </div>
            <a href={`tel:${listing.phoneNumber}`}>
                <button className='px-7 py-3 bg-green-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg active:bg-green-800 active:shadow-lg w-full text-center transition duration-150 ease-in-out mb-6'>
                    Call us now
                </button>
            </a>
        </div>
    )}</>
  )
}
