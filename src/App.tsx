import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Тільки Home завантажується одразу
import Home from "./pages/Home";

// Решта сторінок завантажується по потребі (lazy loading)
const Listings = lazy(() => import("./pages/Listings"));
const ApartmentPage = lazy(() => import("./pages/ApartmentPage"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Login = lazy(() => import("./pages/Login"));
const CreateListing = lazy(() => import("./pages/CreateListing"));
const Profile = lazy(() => import("./pages/Profile"));
const AboutUs = lazy(() => import("./pages/AboutUs"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route
          path="/signup"
          element={
            <Suspense fallback={<PageLoader />}>
              <SignUp />
            </Suspense>
          }
        />
        <Route
          path="/login"
          element={
            <Suspense fallback={<PageLoader />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/listing"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProtectedRoute>
                <CreateListing />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="/listings"
          element={
            <Suspense fallback={<PageLoader />}>
              <Listings />
            </Suspense>
          }
        />
        <Route
          path="/listings/:id"
          element={
            <Suspense fallback={<PageLoader />}>
              <ApartmentPage />
            </Suspense>
          }
        />
        <Route
          path="/profile"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="/about-us"
          element={
            <Suspense fallback={<PageLoader />}>
              <AboutUs />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
