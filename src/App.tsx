import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";

import SignUp from "./pages/SignUp";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>
    </Routes>
  );
}
