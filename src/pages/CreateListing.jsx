import React, { useState } from 'react'

export default function CreateListing() {
    const [formData, setFormData] = useState({
        type: "rent",
        name: "",
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: "",
        description: "",
        offer: true,
        regularPrice: 0,
        discountedPrice: 0
    })
    const {
        type,
        name,
        bedrooms,
        bathrooms,
        parking,
        furnished,
        address,
        description,
        offer,
        regularPrice,
        discountedPrice,

    } = formData
    function onChange() {}
  return (
    <main className='max-w-md px-2 mx-auto'>
        <h1 className='text-3xl text-center font-bold mt-6'>
            Create a Listing
        </h1>
        <form>
            <p className='text-lg mt-6 font-semibold'>
                Sell / Rent
            </p>
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
                    value='sale'
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
            <p className='text-lg mt-6 font-semibold'>
                Parking spot
            </p>
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
            />
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
                Create Listing
            </button>
        </form>
    </main>
  )
}
