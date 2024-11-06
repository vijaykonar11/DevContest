import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import PriceCard from "../components/PriceCard";
import "../styles/Pricing.css";

const Pricing = () => {
  return (
    <div className="d-flex flex-column">
      <div className="container d-flex flex-grow-1 flex-column align-items-center mt-5">
        <div className="text-center fs-1 montserrat-top-text">
          <div>
            <strong>Pricing </strong>for Your Medical AI Scribe
          </div>
          <p className="fs-5 mt-3 px-3">
            Practices across the nation already trust Health Web. Our simple pricing model makes it
            easy for you to make the move to this powerful ambient listening technology.
          </p>
        </div>
        <PriceCard />
        {/* <div className="Available-container  montserrat-top-text rounded-5 rounded-bottom-0">
          <div className="Content-container d-flex justify-content-evenly">
            <div className="p-4 m-4">
              <h3 className="mb-4">Available On</h3>
              <ul>
                <li>iPhone</li>
                <li>iPad</li>
                <li>Android phones</li>
                <li>Web browser</li>
              </ul>
            </div>
            <div className="p-4 m-4">
              <h3 className="mb-4">Features</h3>
              <ul>
                <li>Ambient voice capture</li>
                <li>Voice recognition system included</li>
                <li>Ability to save transcript of visit</li>
                <li>Generates draft clinical summary</li>
                <li>Generates draft SOAP note</li>
                <li>Ability to modify text before importing to EHR</li>
                <li>Ability to export completed note as PDF</li>
              </ul>
            </div>
            <div className="p-4 m-4">
              <h3 className="mb-4">Support</h3>
              <ul>
                <li>24x7 customer support</li>
                <li>Implementation services included</li>
                <li>BAA included</li>
                <li>Runs on Microsoft Azure cloud</li>
              </ul>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Pricing;
