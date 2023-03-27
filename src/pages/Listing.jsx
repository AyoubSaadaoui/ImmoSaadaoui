import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import LoaderImage from '../components/LoaderImage';
import { db } from '../firebase';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { EffectFade, Autoplay, Navigation, Pagination } from 'swiper';
import 'swiper/css/bundle'

export default function Listing() {
    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
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
    </main>
  )
}
