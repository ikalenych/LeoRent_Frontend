import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import ApartmentPage from "./pages/ApartmentPage.tsx";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import CreateListing from "./pages/CreateListing";
import Profile from "./pages/Profile";
import AboutUs from "./pages/AboutUs.tsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/listing" element={<CreateListing />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<ApartmentPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/about-us" element={<AboutUs />} />
      </Route>
    </Routes>
  );
}
