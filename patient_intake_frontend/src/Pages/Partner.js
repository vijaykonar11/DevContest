import React from "react";
import "../styles/Partner.css";
import Form from "../components/Form";
import Header from "../components/Header";
import Footer from "../components/Footer";
const PartnerWithSunoh = () => {
  return (
    <>
      <div className="partner-container">
        <h1>
          <b>Partner</b> with Health Web
        </h1>

        <h2>Are you an EHR vendor and interested in partnering with Health Web?</h2>
        <p>
          As a medical AI scribe, Health Web offers a unique and immersive experience for both
          doctors and patients, making the documentation of clinical notes faster and more efficient
          than ever before. By integrating with Health Web, EHR vendors can offer their customers a
          cutting-edge solution that streamlines the documentation process and improves overall
          workflow.
        </p>
        <p>
          Contact us today to learn more about how we can work together to enhance the healthcare
          experience for providers and patients alike. Don’t miss out on the opportunity to be a
          part of the future of healthcare documentation.
        </p>
      </div>
      <Form />
    </>
  );
};

export default PartnerWithSunoh;
