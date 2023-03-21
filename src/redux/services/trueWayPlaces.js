import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'



export const forwardReverseGeocoding = createApi({
    reducerPath: 'forwardReverseGeocoding',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://trueway-places.p.rapidapi.com',
        prepareHeaders: (headers) => {
            if (!headers.has('X-RapidAPI-Key')) {
                headers.set('X-RapidAPI-Key', '3e4277fd7fmsh0bc93fb5e985052p11948fjsna8e2af29ee68');
              }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getGeolocation: builder.query({ query: (address) => `/FindPlaceByText?text=${address}&language=fr` }),
    }),
});
export const {
    useGetGeolocationQuery,
} = forwardReverseGeocoding