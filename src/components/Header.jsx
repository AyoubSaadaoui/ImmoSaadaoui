import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import logo from '../assets/LogoImmo.png'

export default function Header() {
    const location = useLocation()
    const navigate = useNavigate()
    const [pageState, setPageState] = useState();
    const auth = getAuth();

    function pathMathRoute(route) {
        if( route === location.pathname) {
            return true
        }
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
        if (user) {
            setPageState("Profile");
        } else {
            setPageState("Sign in");
        }
        });
    }, [auth]);


  return (
    // shadow-sm
    <div className='bg-white border-b shadow-md sticky top-0 z-50 '>
        <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
            <div>
                <img src={logo} alt='logo'
                className='h-12 cursor-pointer'
                onClick={()=> navigate("/")}
                />
            </div>
            <div>
                <ul className='flex space-x-10'>
                    <li
                        className={`cursor-pointer py-3 text-sm font-semibold text-gray-400  ${
                            pathMathRoute("/") && " border-b-[3px] border-b-red-500 text-gray-900"
                        }`}
                        onClick={ ()=> navigate("/") }

                    >
                        Home
                    </li>
                    <li
                        className={`cursor-pointer py-3 text-sm font-semibold text-gray-400  ${
                            pathMathRoute("/offers") && " border-b-[3px] border-b-red-500 text-gray-900"
                        }`}
                        onClick={ ()=> navigate("/offers") }
                    >
                        Offers
                    </li>

                    <li
                        className={`cursor-pointer py-3 text-sm font-semibold text-gray-400  ${
                            ( pathMathRoute("/profile") || pathMathRoute("/sign-in")) &&
                            " border-b-[3px] border-b-red-500 text-gray-900 "
                        }`}
                        onClick={ ()=> navigate("/profile") }
                    >
                        {pageState}
                    </li>
                </ul>
            </div>
        </header>
    </div>
  )
}
