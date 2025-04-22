import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/Hero";
import SignUp from "./components/account/SignUp"; // make sure path is correct
import SignIn from "./components/account/SignIn";
import Profile from "./components/account/Profile";
import SellerDashboard from "./components/Dashboard_Seller/SellerDashboard";
import AddProductForm from "./components/Dashboard_Seller/AddProductForm";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
        <Route path="/add-product" element={<AddProductForm />} />
      </Routes>
    </Router>
  );
}

export default App;
