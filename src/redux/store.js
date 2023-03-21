import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { forwardReverseGeocoding } from "./services/trueWayPlaces";

export const store = configureStore({
    reducer: {
        [forwardReverseGeocoding.reducerPath]: forwardReverseGeocoding.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(forwardReverseGeocoding.middleware),
});
setupListeners(store.dispatch)