import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaLocationDot, FaMobileScreenButton, FaXTwitter } from "react-icons/fa6";
import {
  faFacebookF,
  faTwitter,
  faGoogle,
  faInstagram,
  faLinkedinIn,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import footerLogo from "../assets/logo.png";
import { Col, Figure } from "react-bootstrap";
import { FaRegEnvelope, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-body-tertiary">
      <div className="container">
        <div className="row justify-content-around pt-4">
          <Col xl={3}>
            <Figure>
              <img src={footerLogo} />
            </Figure>
            <p>
              Learn how our solutions have revolutionized our clients' workflow and boosted their
              productivity.
            </p>
          </Col>
          <Col xl={3}>
            <h3 className="futTitle">Services</h3>
            <ul className="futLink">
              <li>
                <Link to="/audio">AI Scribe</Link>
              </li>
              <li>
                <Link to="/SMS-Service">SMS</Link>
              </li>
              <li>
                <Link to="/patient-intake">Patient Intake</Link>
              </li>
            </ul>
          </Col>
          <Col xl={3}>
            <h3 className="futTitle">Contact Us</h3>
            <ul className="contactUs">
              <li>
                <FaMobileScreenButton className="icon" />
                <div className="d-flex flex-column">
                  <span>Phone:</span>
                  <a href="tel:+17323541541" aria-label="call +17323541541">
                    +1 732-354-1541
                  </a>
                </div>
              </li>
              <li>
                <FaRegEnvelope className="icon" />
                <div className="d-flex flex-column">
                  <span>Phone:</span>
                  <a
                    href="mailto:info@healthweb.ai"
                    aria-label="send an email to info@healthweb.ai"
                  >
                    info@healthweb.ai
                  </a>
                </div>
              </li>
              <li>
                <FaLocationDot className="icon" />
                <div className="d-flex flex-column">
                  <span>ADDRESS :</span>
                  <p>3840 Park Avenue, STE C-205, Edison, NJ 08820</p>
                </div>
              </li>
            </ul>
          </Col>
        </div>
      </div>
      <hr className="my-0" />
      <div className="d-flex flex-wrap justify-content-center justify-content-md-between align-items-center py-3 px-4">
        <div>
          © 2024 Copyright:
          <a className="text-body" href="https://sourcesoftsolutions.com/">
            sourcesoftsolutions.com
          </a>
        </div>
        <section className="d-flex gap-2 justify-content-center mt-md-0 mt-3">
          <a
            className="btn text-white"
            style={{ backgroundColor: "#3b5998" }}
            href="https://www.facebook.com/profile.php?id=61558703439738"
            target="_blank"
            role="button"
          >
            <FontAwesomeIcon icon={faFacebookF} />
          </a>
          {/* <a className="btn text-white" style={{ backgroundColor: "#55acee" }} href="#!" role="button">
            <FaXTwitter />
          </a> */}
          {/* <a
            className="btn text-white"
            style={{ backgroundColor: "#dd4b39" }}
            href="#!"
            role="button"
          >
            <FontAwesomeIcon icon={faGoogle} />
          </a> */}
          <a
            className="btn text-white"
            style={{ backgroundColor: "#fd1d1d" }}
            href="https://www.instagram.com/healthweb.ai/"
            target="_blank"
            role="button"
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a
            className="btn text-white"
            style={{ backgroundColor: "#0082ca" }}
            href="https://www.linkedin.com/company/healthweb-ai/"
            target="_blank"
            role="button"
          >
            <FontAwesomeIcon icon={faLinkedinIn} />
          </a>
          <a
            className="btn text-white"
            style={{ backgroundColor: "#FF0000" }}
            href="https://www.youtube.com/@healthweb-ai"
            target="_blank"
            role="button"
          >
            <FaYoutube />
          </a>
          {/* <a className="btn text-white" style={{ backgroundColor: "#333" }} href="#!" role="button">
            <FontAwesomeIcon icon={faGithub} />
          </a> */}
        </section>
      </div>
    </footer>
  );
};

export default Footer;
