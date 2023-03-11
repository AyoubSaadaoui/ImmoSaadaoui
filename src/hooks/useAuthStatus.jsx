import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react'

export function useAuthStatus() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        // Checking whether the user is signed in or signed out
        onAuthStateChanged(auth, (user) => {
            if(user) {
                // User is signed in
                setLoggedIn(true);
            }
            setCheckingStatus(false);
        });
    }, []);
  return { loggedIn, checkingStatus };
}
