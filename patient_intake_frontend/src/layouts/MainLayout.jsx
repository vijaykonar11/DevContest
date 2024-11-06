import React from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <>
      <Header />
      <div className="min-vh-100" id="page-top">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default MainLayout;
