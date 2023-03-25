import {  getAuth, updateProfile } from 'firebase/auth';
import { collection, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import { FcHome } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

function Profile() {
  const auth = getAuth()
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })
  const [changeDetail, setChangeDetail] = useState(false)
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)
  const { name, email } = formData;

  function onLogout() {
    // User is signed out.
    auth.signOut();
    navigate("/")
  }

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  async function onSubmit() {
    try {
      if(auth.currentUser.displayName !== name) {
        // update display name in firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name
        });
        // update name in the firestore
        const docRef = doc(db, "users", auth.currentUser.uid)
        await updateDoc(docRef, {
          name,
        });

        // message
        const resolveAfter3Sec = new Promise(resolve => setTimeout(resolve, 500));
        toast.promise(
        resolveAfter3Sec,
        {
          pending: 'Please wait...',
          success: 'Profile details updated ',

        })
      }
    } catch (error) {
      toast.error("Could not update the profile details !")
    }
  }
  useEffect(() => {
    async function fetchUserListings() {
      const listingRef = collection(db, "listings");
      // get the listings that have th person is created
      const q = query(listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        });
      });
      setListings(listings);
      setLoading(false);
    };
    fetchUserListings();
  }, [auth.currentUser.uid])

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
              onChange={onChange}
              disabled={!changeDetail}
              className={` mb-6 w-full px-4 py-2 text-xl text-gray-700
              border-gray-300 rounded transition ease-in-out ${changeDetail && "bg-red-200 focus:bg-red-200"}`}
            />
            <input
              type='email'
              id='email'
              value={email}

              disabled
              className=' mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white
              border-gray-300 rounded transition ease-in-out'
            />
            <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6'>
              <p className='flex items-center'>
                Do you want to change your name?
                <span
                  className=' text-red-600 hover:text-red-700 transition ease-in-out duration-200
                  cursor-pointer ml-1'
                  onClick={() => {
                    // changeDetail=true -> onSubmit()
                    changeDetail && onSubmit();
                    setChangeDetail((prevState) => !prevState);
                  } }
                >
                  {changeDetail ? "Applay change" : "Edit"}
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
          <button
            type='submit'
            className='w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-sm
            hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800'
          >
            <Link
              to='/create-listing'
              className='flex justify-center items-center'
            >
              <FcHome
                className='mr-2 text-3xl bg-red-200 rounded-full border-white border-2 p-1'
              />
              sell or rent your home
            </Link>
          </button>
        </div>
      </section>
      <div className ='max-w-6xl px-3 mt-6 mx-auto'>
        {!loading && listings.length > 0 && (
          <>
            <h2 className='text-2xl text-center font-semibold mb-6 '>My Listings</h2>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl-grid-cols-5 mt-6 mb-6'>
              {listings?.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  )
}

export default Profile