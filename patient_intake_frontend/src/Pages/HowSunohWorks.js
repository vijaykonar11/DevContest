import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Home.css";
import gif from "../styles/Sunoh_Audiowave.gif";
import Reviews2 from "../components/Reviews2";
import video1 from "../styles/Settings.mp4";
import FAQs from "../components/FAQs";
import WorkCards from "../components/WorkCards";

const HowSunohWorks = () => {
  return (
    <div className="d-flex flex-column">
      <WorkCards />
      {/* <div className="container d-flex flex-grow-1 flex-column align-items-center mt-5">
                <div className="text-center fs-1 montserrat-top-text mb-5">
                   
                    </div>
              
                <div className=" fs-1 montserrat-top-text mb-5 d-flex ">
                   
                </div>
               
            </div> */}
    </div>
  );
};

export default HowSunohWorks;
