import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profiles from "./pages/Profiles";
import ProfileDetail from "./pages/ProfileDetail";
import NotFound from "./pages/NotFound"; 
import ContractorProfile from "./pages/ContractorProfile";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profiles" element={<Profiles />} />
      <Route path="/profile/:id" element={<ProfileDetail />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/contractor-profile" element={<ContractorProfile />} />
    </Routes> 
  );
}
