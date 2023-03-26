import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import LoaderImage from '../components/LoaderImage';
import { useGetGeolocationQuery } from '../redux/services/trueWayPlaces';
import {  getAuth } from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid';
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useNavigate, useParams } from 'react-router';



export default function CreateListing() {
    const auth = getAuth()
    const navigate = useNavigate()
    const params = useParams()
    const [geolocationEnabled, setGeolocationEnabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState(null);
    const [formData, setFormData] = useState({
        type: "rent",
        name: "",
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: "",
        description: "",
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        latitude: 0,
        longitude: 0,
        images: {},
    });
    const {
        type,
        name,
        bedrooms,
        bathrooms,
        parking,
        address,
        furnished,
        description,
        offer,
        regularPrice,
        discountedPrice,
        latitude,
        longitude,
        images,
    } = formData;

    // cannot edit someone else's page
    useEffect(() => {
        if (listing && listing.userRef !== auth.currentUser.uid) {
            toast.error("You can't edit this listing");
            navigate("/");
        }
    }, [listing, auth.currentUser.uid, navigate])

    useEffect(() => {
        setLoading(true);
        async function fetchListing() {
            const docRef = doc(db, "listings", params.listingId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setListing(docSnap.data());
                setFormData({ ...docSnap.data() });
                setLoading(false);

            } else {
                navigate("/");
                toast.error("Listing does not exist")
            }

        }
        fetchListing()
    }, [navigate,params.listingId]);



    // Using a query hook automatically fetches data and returns query values
    const { data } = useGetGeolocationQuery(address)

    function onChange(e) {
        let boolean = null;

        if (e.target.value === "true") {
            boolean = true;
        }
        if (e.target.value === "false") {
            boolean = false;
        }
        // Files
        if (e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files,
            }));
        }
        // Text/Boolean/number
        if (!e.target.files) {
            setFormData((prevState) => ({
                // (??)  check if a boolean is null provide a default
                ...prevState,
                [e.target.id]: boolean ?? e.target.value,
            }));
        }
    }

    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true);
        if (offer === true && discountedPrice >= regularPrice) {
            setLoading(false);
            toast.error ("Discounted price needs to be less than regular price");
            return;
        }
        if (images.length > 6) {
            setLoading(false);
            toast.error ("maximum 6 images are allowed");
            return;
        }

        let geolocation = {};
        let location;
        if (geolocationEnabled) {
            geolocation.lat = data?.results[0]?.location?.lat ?? 0 ;
            geolocation.lng = data?.results[0]?.location?.lng ?? 0 ;
            location =  data?.results?.length === 0 && undefined ;

            if (location === undefined) {
                setLoading(false);
                toast.error("please enter a correct address");
                return;
            }

        }else {
            geolocation.lat = latitude;
            geolocation.lng = longitude;
        }

        async function storeImage(image) {
            return new Promise((resolve, reject) => {
                const storage = getStorage();
                // image name
                const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
                const storageRef = ref(storage, fileName);
                const uploadTask = uploadBytesResumable(storageRef, image);
                uploadTask.on('state_changed',
                    (snapshot) => {
                        // Observe state change events such as progress, pause, and resume
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                        }
                    },
                    (error) => {
                        // Handle unsuccessful uploads
                        reject(error)
                    },
                    () => {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve( downloadURL);
                        });
                    }
                );
            })
        }

        const imgUrls = await Promise.all(
            [...images].map((image) => storeImage(image))
        ).catch((error) => {
            setLoading(false);
            toast.error("iamges not uploaded");
            return;
        });

        const formDataCopy = {
            ...formData,
            imgUrls,
            geolocation,
            timestamp: serverTimestamp(),
            userRef: auth.currentUser.uid,
        };

        delete formDataCopy.images;
        delete formDataCopy.latitude;
        delete formDataCopy.longitude;
        !formDataCopy.offer && delete formDataCopy.discountedPrice;

        // update
        const docRef = doc(db, "listings", params.listingId);
        await updateDoc(docRef, formDataCopy);
        setLoading(false);
        toast.success("Listing edited");
        navigate(`/category/${formDataCopy.type}/${docRef.id}`);
    }


    if (loading) {
        return <LoaderImage/>
    }
  return (
    <main className='max-w-md px-2 mx-auto'>
        <h1 className='text-3xl text-center font-bold mt-6'>Edit Listing</h1>
        <form onSubmit={onSubmit}>
            <p className='text-lg mt-6 font-semibold'>Sell / Rent</p>
            <div className='flex space-x-3'>
                <button
                    type='button'
                    id='type'
                    value='sale'
                    onClick={onChange}
                    className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg
                    focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                        type === "rent" ?
                        "bg-white text-black" :
                        "bg-slate-600 text-white"
                    }`}
                >
                    Sell
                </button>
                <button
                    type='button'
                    id='type'
                    value='rent'
                    onClick={onChange}
                    className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg
                    focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                        type === "sale" ?
                        "bg-white text-black" :
                        "bg-slate-600 text-white"
                    }`}
                >
                    Rent
                </button>
            </div>
            <p className='text-lg font-semibold mt-6'>Name</p>
            <input
                type='text'
                id='name'
                value={name}
                placeholder='Name'
                onChange={onChange}
                maxLength="32"
                minLength="10"
                required
                className='w-full px-4 py-2 rounded text-xl text-gray-700 bg-white border border-gray-300 mb-6
                transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'
            />
            <div className='flex space-x-6 '>
                <div>
                    <p className='text-lg font-semibold'>Beds</p>
                    <input
                        type='number'
                        id='bedrooms'
                        value={bedrooms}
                        onChange={onChange}
                        min="1"
                        max="50"
                        required
                        className='px-4 py-2 rounded text-xl text-center text-gray-700 bg-white border border-gray-300
                        transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'

                    />
                </div>
                <div>
                    <p className='text-lg font-semibold'>Baths</p>
                    <input
                        type='number'
                        id='bathrooms'
                        value={bathrooms}
                        onChange={onChange}
                        min="1"
                        max="50"
                        required
                        className='px-4 py-2 rounded text-xl text-center text-gray-700 bg-white border border-gray-300
                        transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'

                    />
                </div>
            </div>
            <p className='text-lg mt-6 font-semibold'>Parking spot</p>
            <div className='flex space-x-3'>
                <button
                    type='button'
                    id='parking'
                    value={true}
                    onClick={onChange}
                    className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg
                    focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                        !parking ?
                        "bg-white text-black" :
                        "bg-slate-600 text-white"
                    }`}
                >
                    Yes
                </button>
                <button
                    type='button'
                    id='parking'
                    value={false}
                    onClick={onChange}
                    className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg
                    focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                        parking ?
                        "bg-white text-black" :
                        "bg-slate-600 text-white"
                    }`}
                >
                    No
                </button>
            </div>
            <p className='text-lg mt-6 font-semibold'>
                Furnished
            </p>
            <div className='flex space-x-3'>
                <button
                    type='button'
                    id='furnished'
                    value={true}
                    onClick={onChange}
                    className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg
                    focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                        !furnished ?
                        "bg-white text-black" :
                        "bg-slate-600 text-white"
                    }`}
                >
                    YES
                </button>
                <button
                    type='button'
                    id='furnished'
                    value={false}
                    onClick={onChange}
                    className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg
                    focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                        furnished ?
                        "bg-white text-black" :
                        "bg-slate-600 text-white"
                    }`}
                >
                    NO
                </button>
            </div>
            <p className='text-lg font-semibold mt-6'>Address</p>
            <textarea
                type='text'
                id='address'
                value={address}
                placeholder='Address'
                onChange={onChange}
                required
                className='w-full px-4 py-2 rounded text-xl text-gray-700 bg-white border border-gray-300
                transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'
            />{!geolocationEnabled && (
                <div className="flex space-x-6 mt-6 mb-6">
                  <div className="">
                    <p className="text-lg font-semibold">Latitude</p>
                    <input
                      type="number"
                      id="latitude"
                      value={latitude}
                      onChange={onChange}
                      required
                      min="-90"
                      max="90"
                      className="px-3 py-2 rounded text-xl text-center text-gray-700 bg-white border border-gray-300
                      transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
                    />
                  </div>
                  <div className="">
                    <p className="text-lg font-semibold">Longitude</p>
                    <input
                      type="number"
                      id="longitude"
                      value={longitude}
                      onChange={onChange}
                      required
                      min="-180"
                      max="180"
                      className="px-3 py-2 rounded text-xl text-center text-gray-700 bg-white border border-gray-300
                      transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
                    />
                  </div>
                </div>
              )}
            <p className='text-lg font-semibold mt-6'>Description</p>
            <textarea
                type='text'
                id='description'
                value={description}
                placeholder='description'
                onChange={onChange}
                required
                className='w-full px-4 py-2 rounded text-xl text-gray-700 bg-white border border-gray-300
                transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'
            />
            <p className='text-lg mt-6 font-semibold'>
                Offer
            </p>
            <div className='flex space-x-3  mb-6'>
                <button
                    type='button'
                    id='offer'
                    value={true}
                    onClick={onChange}
                    className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg
                    focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                        !offer ?
                        "bg-white text-black" :
                        "bg-slate-600 text-white"
                    }`}
                >
                    Yes
                </button>
                <button
                    type='button'
                    id='offer'
                    value={false}
                    onClick={onChange}
                    className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg
                    focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                        offer ?
                        "bg-white text-black" :
                        "bg-slate-600 text-white"
                    }`}
                >
                    No
                </button>
            </div>
            <div className='flex items-center mb-6'>
                <div className=''>
                    <p className='text-lg font-semibold '>Regular Price</p>
                    <div className='flex w-full justify-center items-center space-x-6'>
                        <input
                            type='number'
                            id='regularPrice'
                            name='regularPrice'
                            value={regularPrice}
                            onChange={onChange}
                            min='0'
                            required
                            className='w-full px-4 py-2 rounded text-xl text-gray-700 bg-white border border-gray-300 text-center
                            transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'
                        />
                        {type === "rent" ?
                            <div><p className='text-md w-full whitespace-nowrap '>Dhs / Month</p></div>:
                            <div><p className='text-md w-full whitespace-nowrap '>Dhs </p></div>
                        }
                    </div>
                </div>
            </div>
            {offer && (
                <div className='flex items-center mb-6'>
                    <div className=''>
                        <p className='text-lg font-semibold '>Discounted Price</p>
                        <div className='flex w-full justify-center items-center space-x-6'>
                            <input
                                type='number'
                                id='discountedPrice'
                                name='discountedPrice'
                                value={discountedPrice}
                                onChange={onChange}
                                min='0'
                                required={offer}
                                className='w-full px-4 py-2 rounded text-xl text-gray-700 bg-white border border-gray-300 text-center
                                transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'
                            />
                            {type === "rent" ?
                                <div><p className='text-md w-full whitespace-nowrap '>Dhs / Month</p></div>:
                                <div><p className='text-md w-full whitespace-nowrap '>Dhs </p></div>
                            }
                        </div>
                    </div>
                </div>
            )}
            <div className='mb-6'>
                <p className='text-lg font-semibold'>Images</p>
                <p className='text-md font-light text-gray-600'>The first image will be the cover (max 6).</p>
                <input
                    type='file'
                    id='images'
                    onChange={onChange}
                    accept='.jpg,.png,.jpeg'
                    multiple
                    required
                    className='w-full px-3 py-1.5 rounded text-xl text-gray-700 bg-white border border-gray-300 text-center
                    transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'
                />

            </div>
            <button
                className='mb-6 w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-sm
                hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800'
            >
                Edit Listing
            </button>
        </form>
    </main>
  )
}
