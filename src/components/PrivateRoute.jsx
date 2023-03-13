import { Navigate, Outlet } from "react-router"
import { useAuthStatus } from "../hooks/useAuthStatus"
import LoaderImage from "./LoaderImage";

export default function PrivateRoute() {
    const { loggedIn, checkingStatus } = useAuthStatus();
    if (checkingStatus) {
        return <LoaderImage />
    }
  return loggedIn ? <Outlet/> : <Navigate to="/sign-in" />
}
