import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import LoaderImage from '../components/LoaderImage';
import { db } from '../firebase';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { EffectFade, Autoplay, Navigation, Pagination } from 'swiper';
import 'swiper/css/bundle'
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare } from 'react-icons/fa';


export default function Listing() {
    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);
    SwiperCore.use([Autoplay, Navigation, Pagination]);

    useEffect(() => {
        async function fetchListing() {
            const docRef = doc(db, "listings", params.listingId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setListing(docSnap.data());
                setLoading(false)
            }
        }
        fetchListing();
    }, [params.listingId]);
    console.log(listing)
    if (loading) {
        return <LoaderImage/>
    }
  return (
    <main>
        <Swiper
            slidesPerView={1}
            navigation
            pagination={{type: "progressbar"}}
            effect="fade"
            modules={[EffectFade]}
            autoplay={{ delay: 4000 }}
        >
            {listing?.imgUrls.map((url, i) => (
                <SwiperSlide key={i}>
                    <div
                        className='relative w-full overflow-hidden h-[300px] '
                        style={{
                            background: `url(${listing.imgUrls[i]}) center no-repeat`,
                            backgroundSize: "cover",

                        }}
                    >

                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
        <div
            className='fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center'
            onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setShareLinkCopied(true);
                setTimeout(() => {
                setShareLinkCopied(false);
            }, 2000);
            }}
        >
            <FaShare className='text-lg text-slate-500'/>
        </div>
        {shareLinkCopied && (
            <p className='fixed top-[23%] right-[5%] font-semibold border-2 border-gray-400 rounded bg-gray-100 z-10 p-1'>
                Link Copied
            </p>
        )}

        <div className='m-4 flex flex-col md:flex-row max-w-6xl lg:max-auto p-4 rounded-lg shadow-lg bg-white lg:space-x-5'>
            <div className='w-full h-[200px] lg-[400px]'>
                <p className='text-2xl font-bold mb-3 text-blue-900 '>
                {listing.name} - Dhs{" "}
                {listing.offer
                    ? listing.discountedPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : listing.regularPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                {listing.type === "rent" ? " / month" : ""}
                </p>
                <p className='flex itmes-center font-semibold mt-6 mb-3 '>
                    <FaMapMarkerAlt className=' text-green-600 mr-1'/>
                    {listing.address}
                </p>
                <div className='flex justify-start items-center space-x-4 w-[75%]'>
                    <p className='bg-red-600 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md'>
                        {listing.type === "rent" ? "Rent" : "Sale"}
                    </p>
                    {listing.offer && (
                        <p className='bg-green-600  rounded-md p-1 text-white text-center font-semibold shadow-md'>
                            {(listing.regularPrice - listing.discountedPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}Dhs discount
                        </p>
                    )}
                </div>
                <p className='mt-3 mb-3'>
                    <span className='font-semibold'>Description - </span>
                    {listing.description}
                </p>
                <ul className='flex items-center space-x-2 sm:space-x-10 text-sm font-semibold mb-6'>
                    <li className='flex items-center whitespace-nowrap'>
                        <FaBed className='text-lg mr-1'/>
                        {+listing.bedrooms > 1 ? `${+listing.bedrooms} Beds` : "1 Bed"}
                    </li>
                    <li className='flex items-center whitespace-nowrap'>
                        <FaBath className='text-lg mr-1'/>
                        {+listing.bathrooms > 1 ? `${+listing.bathrooms} Baths` : "1 Bath"}
                    </li>
                    <li className='flex items-center whitespace-nowrap'>
                        <FaParking className='text-lg mr-1'/>
                        {listing.parking ? "Parking Spot" : "No parking"}
                    </li>
                    <li className='flex items-center whitespace-nowrap'>
                        <FaChair className='text-lg mr-1'/>
                        {listing.furnished ? "Furnished" : "Not furnished"}
                    </li>

                </ul>
            </div>
            <div className='bg-blue-300 w-full h-[200px] lg-[400px] z-10 overflow-x-hidden'></div>
        </div>
    </main>
  )
}