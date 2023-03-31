import { collection, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import ListingItem from '../components/ListingItem';
import LoaderImage from '../components/LoaderImage';
import { db } from '../firebase';
import { useParams } from 'react-router';

function Category() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);
  const params = useParams();


  useEffect(() => {
    async function fetchListing() {
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("type", "==", params.listingType),
          orderBy("timestamp", "desc"),
          limit(8)
        );
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data()
          });
        });
        setListings(listings);
        // for last visible listing
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);
        setLoading(false);

      } catch (error) {
        toast.error("Cloud not fetch listing");
      }
    }
    fetchListing();
  },[params.listingType]);

  async function onFetchMoreListings() {
    try {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("type", "==", params.listingType),
        orderBy("timestamp", "desc"),
        // starting point in a collection
        startAfter(lastFetchedListing),
        limit(4)
      );
      const querySnap = await getDocs(q);
      const listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        });
      });
      setListings((prevState) => [...prevState, ...listings]);
      // for last visible listing
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);
      setLoading(false);

    } catch (error) {
      toast.error("Cloud not fetch listing");
    }
  }
  return (
    <div className='max-w-6xl mx-auto px-3'>
      <h1 className='text-3xl text-center mt-6 font-bold mb-6'>
        {params.listingType === "rent" ? "Places for rent" : "Places for sale"}
        </h1>
      {loading
        ? (<LoaderImage/>)
        : listings && listings.length > 0
          ? (
            <>
              <main>
                <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6'>
                {listings?.map((listing) => (
                  <ListingItem
                    key={listing.id}
                    id={listing.id}
                    listing={listing.data}

                  />
                ))}
              </ul>
              </main>
              {lastFetchedListing && (
                <div className='flex justify-center items-center'>
                  <button
                    className='bg-white px-3 py-1.5 text-gray-700 border border-gray-300 mb-6 mt-6 hover:border-slate-600 rounded transition duratioin-150 ease-in-out'
                    onClick={onFetchMoreListings}
                  >
                    Load more
                  </button>
                </div>
              )}
            </>
          )
          : (
                <p>
                    The are no current
                    {params.listingType === "rent" ? "places for rent" : "places for sale"}
                </p>
            )
      }
    </div>
  )
}

export default Category