import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Home.css";
import gif from "../styles/Sunoh_Audiowave.gif";
import Reviews2 from "../components/Reviews2";
import video1 from "../styles/Settings.mp4";
import FAQs from "../components/FAQs";
import WorkFlow from "../components/WorkFlow";
import ReviewsClient from "../components/ReviewsClient";
import DoctorPatientLogo from "../assets/doctor-patient.jpg";

import BannerIcon from "../assets/banner-icon.png";
import MicLineIcon from "../assets/mic_line.png";
import CommentIcon from "../assets/comment-icon.png";
import AssistIcon from "../assets/assist.png";
import SummaryIcon from "../assets/summary.png";
import DocumentIcon from "../assets/document-icon.png";
import VideoIcon from "../assets/video-icon.png";
import PersonIcon from "../assets/person.png";
import StarIcon from "../assets/star.png";
import PersonIcon02 from "../assets/person02.png";
import PersonIcon01 from "../assets/person01.png";

import Mike1 from "../assets/mike1.png";
import Envelop1 from "../assets/envelop1.png";
import Sms1 from "../assets/sms1.png";

import { Col, Container, Figure, Row } from "react-bootstrap";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import HowSunohWorks from "./HowSunohWorks";
import HomeBanner from "./HomeBanner";
import { Link } from "react-router-dom";

const Home = () => {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const productsServices = [
    {
      src: Mike1,
      title: "AI Scribe",
      paragraph:
        "It captures patient-provider conversations to accurately and efficiently document clinical information.",
    },
    {
      src: Envelop1,
      title: "Patient Intake",
      paragraph:
        "A system which collects personal, medical, and insurance information before a medical appointment.",
    },
    {
      src: Sms1,
      title: "SMS Service",
      paragraph:
        "An SMS service sends automated reminders to ensure timely payments of pending dues.",
    },
  ];

  return (
    <div className="min-vh-100">
      <div className="">
        <aside className="homeBanner">
          <HomeBanner />
          {/* <div className="pageTitle1 p-5">
          <h3 className="mb-2">Home Page</h3>
          <p>20 Records</p>
        </div> */}
          {/* <Container>
            <Row className="align-items-center justify-content-between text-lg-start text-center">
              <Col lg xxl={5}>
                <h2>
                  <span>HealthWeb</span>Medical AI Scribe
                </h2>
                <p>
                  An innovative AI-driven ambient monitoring solution for healthcare documentation
                </p>
                <button onClick={() => navigate("/contact")}>Request a Demo</button>
              </Col>
              <Col lg xxl={5}>
                <Figure className="mt-lg-0 mt-5">
                  <img src={BannerIcon} className="img-fluid banerMike" alt="Banner Image" />
                </Figure>
              </Col>
            </Row>
          </Container> */}
        </aside>

        <section className="ourService">
          <Container>
            <h1 className="heading text-center mb-5">
              Explore Our
              <br className="d-none d-xl-block" />
              Products & Services
            </h1>
            <Row className="g-5">
              {productsServices.map((items, index) => (
                <Col xl={4} key={index}>
                  <div className="servicesBox">
                    <img src={items.src} className="img-fluid mb-3" />
                    <h2>{items.title}</h2>
                    <p className="mb-4">{items.paragraph}</p>
                    <Link to="/contact" className="btn">
                      Request a Demo
                    </Link>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* <aside>
          <div className="workTitle">
            <h3>How Health Web Works ?</h3>
          </div>
          <Container>
            <Row>
              <Col>
                <ul className="workList">
                  <li>
                    <div className="numBox">
                      <Figure className="me-sm-4 me-lg-5 mb-0">
                        <img src={MicLineIcon} />
                      </Figure>
                      <div className="ps-2">
                        <h3>Hear the Dialogue</h3>
                        <p>
                          It captures patient-provider conversations to accurately and efficiently
                          document clinical information.
                        </p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="numBox">
                      <Figure className="me-sm-4 me-lg-5 mb-0">
                        <img src={CommentIcon} />
                      </Figure>
                      <div className="ps-2">
                        <h3>Creates a conversation flow</h3>
                        <p>
                          It utilizes AI and voice recognition technology to generate a transcript
                          of the dialogue between providers and patients.
                        </p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="numBox">
                      <Figure className="me-sm-4 me-lg-5 mb-0">
                        <img src={DocumentIcon} />
                      </Figure>
                      <div className="ps-2">
                        <h3>Creates a clinical document draft</h3>
                        <p>
                          It organizes the summarized content into relevant Progress Note sections
                          and facilitates the review and import of pertinent data for clinical
                          documentation.
                        </p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="numBox">
                      <Figure className="me-sm-4 me-lg-5 mb-0">
                        <img src={AssistIcon} />
                      </Figure>
                      <div className="ps-2">
                        <h3>Assists with order entry</h3>
                        <p>
                          It drafts and records information on labs, imaging, procedures, medication
                          orders, and follow-up visit details.
                        </p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="numBox">
                      <Figure className="me-sm-4 me-lg-5 mb-0">
                        <img src={SummaryIcon} />
                      </Figure>
                      <div className="ps-2">
                        <h3>Provides a summary for review</h3>
                        <p>
                          It simplifies the clinical documentation process by enabling healthcare
                          providers to review and adjust summarized content for accuracy, and
                          seamlessly integrate pre-configured defaults with a single click.
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </Col>
            </Row>
          </Container>
        </aside> */}

        <aside className="patientDr py-5">
          <Container>
            <Row className="align-items-center text-lg-start text-center">
              <Col lg={7} className="pe-xl-5">
                <h3>Why HealthWeb.ai</h3>
                <p>
                  Health Web is a medical AI scribe which converts the natural conversations between
                  healthcare providers and patients into clinical documentation. Health Web offers a
                  unique and immersive experience for both doctors and patients, making the
                  documentation of clinical notes faster and more efficient than ever before. Use it
                  with your EHR to accelerate your documentation.
                </p>
              </Col>
              <Col lg={5}>
                <img className="img-fluid alScribe mt-lg-0 mt-4" src={DoctorPatientLogo} />
              </Col>
            </Row>
          </Container>
        </aside>

        <aside className="ourClient py-5">
          <Container>
            <Row className="align-items-center">
              <Col xxl={3} className="text-center text-xxl-start">
                <h3>What Our Clients Are Saying</h3>
                <p>
                  Discover how our solutions have transformed the workflow and productivity of our
                  clients. Read their stories and see why they trust us to handle their
                  documentation needs.
                </p>
              </Col>
              <Col xxl={9}>
                <Carousel responsive={responsive}>
                  <div>
                    <div className="clientBox">
                      <div className="d-flex align-items-center mb-3">
                        <img className="clientImg" src={PersonIcon} />
                        <div className="ms-3">
                          <h3>Alex Harper</h3>
                          <img className="starImg" src={StarIcon} />
                        </div>
                      </div>
                      <p>
                        HealthWeb.ai has significantly reduced our clinical documentation time by at
                        least two hours daily. Its dependability and cost-efficiency stand out
                        compared to traditional medical scribes, while its precise, error-free
                        documentation has truly impressed us.
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="clientBox">
                      <div className="d-flex align-items-center mb-3">
                        <img className="clientImg" src={PersonIcon02} />
                        <div className="ms-3">
                          <h3>Jamie Rivera</h3>
                          <img className="starImg" src={StarIcon} />
                        </div>
                      </div>
                      <p>
                        HealthWeb.ai offers more than just rapid results. Our medical team has
                        observed a significant improvement in report detail, with the system
                        capturing complete conversations and accelerating documentation speed.
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="clientBox">
                      <div className="d-flex align-items-center mb-3">
                        <img className="clientImg" src={PersonIcon01} />
                        <div className="ms-3">
                          <h3>Morgan Brooks</h3>
                          <img className="starImg" src={StarIcon} />
                        </div>
                      </div>
                      <p>
                        On busy days, we often missed capturing the complete HPI and other key
                        details due to time limitations. Since implementing HealthWeb.ai, we’ve
                        experienced a significant boost in efficiency,{" "}
                      </p>
                    </div>
                  </div>
                </Carousel>
              </Col>
            </Row>
          </Container>
        </aside>

        <aside className="text-center py-5">
          <Container>
            <Row className="justify-content-center">
              <Col xxl={7}>
                <h3 className="pb-3 pt-md-4">
                  Unlock an Extra few Hours in Your Day with Our Documentation Solutions!
                </h3>
                <p>
                  Experience the power of AI-powered ambient listening technology in the palm of
                  your hand.
                </p>
                <video className="card-video homeVideo" controls>
                  <source
                    src="https://sitemployee.sourcesoftsolutions.com/assets/images/script_1.mp4"
                    type="video/mp4"
                  />
                </video>
                {/* <Figure><img className="img-fluid" src={VideoIcon} /></Figure> */}
              </Col>
            </Row>
          </Container>
        </aside>
      </div>

      {/* <section className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-xl-12">
            <div className="text-center fs-1 montserrat-top-text mb-5">
              <div>HealthWeb Medical AI Scribe,</div>
              <div>a revolutionary AI-powered ambient</div>
              <div>listening technology for</div>
              <div>clinical documentation</div>
              <img src="../images/HealthWeb.gif" alt="GIF" className="mt-5  " />
              <div className="d-flex justify-content-center mt-5">
                <button type="button" className="btn logoColorBtn btn-lg">
                  Request a Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* <section className="videoContainer">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-7">
              <h2 className="mb-4 fw-bold">Your Medical AI Scribe</h2>
              <p className="contentAi">
                Health Web is a medical AI scribe which converts the natural conversations between
                healthcare providers and patients into clinical documentation. Health Web offers a
                unique and immersive experience for both doctors and patients, making the
                documentation of clinical notes faster and more efficient than ever before. Use it
                with your EHR to accelerate your documentation.
              </p>
            </div>
            <div className="col-xl-5">
              <img className="img-fluid" src={DoctorPatientLogo} />
            </div>
          </div>
        </div>
      </section> */}

      {/* <WorkFlow/> */}

      {/* <ReviewsClient /> */}

      <FAQs />

      {/* <Reviews2 /> */}
    </div>
  );
};

export default Home;
