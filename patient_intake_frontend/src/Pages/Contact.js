import React from "react";
import "../styles/Contact.css";
import Form from "../components/Form";
import Header from "../components/Header";
import Footer from "../components/Footer";
const Contact = () => {
  return (
    <>
      <div className="contact-us">
        <h1>Contact Us</h1>
        <p>
          We're here to help you save up to two hours of documentation time daily with Health Web.
          Whether you have questions about our AI-powered medical scribe, need support, or want to
          see a demo, our team is ready to assist you.
        </p>
      </div>

      <div className="contact-info">
        <div className="contact-section">
          <h2>Sales Inquiries</h2>
          <p>
            Phone:{" "}
            <a
              href="tel:+17323541541"
              aria-label="call +17323541541"
              className="custom-primary-color"
            >
              +1 732-354-1541
            </a>
          </p>
          <p>
            Email:{" "}
            <a
              href="mailto:info@healthweb.ai"
              aria-label="send an email to info@healthweb.ai"
              className="custom-primary-color"
            >
              info@healthweb.ai
            </a>
          </p>
          <p>
            Address:{" "}
            <a
              href="https://maps.app.goo.gl/RJgeXyn7KX7mpCeo9"
              aria-label="3840 Park Avenue, ste c-205, Edison, NJ, 08820"
              className="custom-primary-color"
              target="_blank"
            >
              3840 Park Avenue, ste c-205, Edison, NJ, 08820
            </a>
          </p>
        </div>
        <div className="contact-section">
          <h2>Customer Support</h2>
          <p>
            <a
              href="https://support.headthWeb.ai"
              aria-label="visit the Customer Support Portal"
              className="custom-primary-color"
            >
              Customer Support Portal
            </a>
          </p>
        </div>
        <div className="contact-section">
          <h2>Media Inquiries</h2>
          <p>
            <a
              href="mailto:info@healthweb.ai"
              aria-label="send an email to info@healthweb.ai"
              className="custom-primary-color"
            >
              info@healthweb.ai
            </a>
          </p>
        </div>
      </div>
      <Form />
    </>
  );
};

export default Contact;
