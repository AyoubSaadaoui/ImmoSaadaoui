import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Offers from "./pages/Offers";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import EditListings from "./pages/EditListings";
import Listing from "./pages/Listing";
import Category from "./pages/Category";

function App() {
  return (
    <>
      <Router>
        <Header/>
        <Routes>
          <Route path="/" element={ <Home/> } />
          <Route path="/offers" element={ <Offers/> } />
          <Route path="/category/:listingType/:listingId" element={ <Listing/> } />
          <Route path="/category/:listingType" element={ <Category/> } />
          <Route path="/profile" element={ <PrivateRoute/> }>
            <Route path="/profile" element={ <Profile/> } />
          </Route>
          <Route path="/sign-in" element={ <SignIn/> } />
          <Route path="/sign-up" element={ <SignUp/> } />
          <Route path="/forgot-password" element={ <ForgotPassword/> } />
          <Route path="/create-listing" element={ <PrivateRoute/> }>
            <Route path="/create-listing" element={ <CreateListing/> } />
          </Route>
          <Route path="/edit-listing" element={ <PrivateRoute/> }>
            <Route path="/edit-listing/:listingId" element={ <EditListings/> } />
          </Route>
        </Routes>
      </Router>
      <ToastContainer
        position="bottom-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
