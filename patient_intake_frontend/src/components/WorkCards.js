import React from "react";
import "../styles/Cards.css";
import WorkFlow from "./WorkFlow";
import { Col, Container, Row } from "react-bootstrap";
import DemoVideo from "./DemoVideo";

const SunohCardLeft = ({ title, description, videoSrc, imageAlt }) => (
  <>
    <Row className="align-items-center">
      <Col xl={6}>
        <video className="card-video" controls>
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Col>
      <Col xl={6} className="ps-5">
        <h2 className="mb-4">{title}</h2>
        <p>{description}</p>
      </Col>
    </Row>
  </>
);
const SunohCardRight = ({ title, description, videoSrc, imageAlt }) => (
  <>
    <Row className="align-items-center">
      <Col xl={6}>
        <h2 className="mb-4">{title}</h2>
        <p>{description}</p>
      </Col>
      <Col xl={6}>
        <video className="card-video" controls>
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Col>
    </Row>
  </>
);

const WorkCards = () => (
  <>
  <section className="howWork">
      <div className="titleBox pt-5">
        <Container>
          <Row>
            <Col xl={4}>
                <h1>How Health Web Works</h1>
            </Col>
            <Col xl={8}>
              <p>Health Web is an <strong>AI Medical Scribe</strong> that simplifies clinical
              documentation by using AI and ambient listening technology to generate a
              transcript of patient-provider conversations. As an EHR agnostic
              solution, Health Web can be used alongside your current EHR, and the
              generated note and summary can be easily imported into your EMR. With
              Health Web innovative approach, healthcare providers can streamline their
              documentation process and improve their workflow. Try Health Web today and
              experience the benefits of an AI Medical Scribe.</p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        <div className="videoContainer pt-5 px-5 mt-4">
            <Row className="align-items-center">
            <Col xl={6}>
                <video className="card-video" controls>
                    <source src="https://sitemployee.sourcesoftsolutions.com/assets/images/script_1.mp4" type="video/mp4" />            
                </video>
            </Col>
            <Col xl={6} className="ps-5">
                <h2 className="mb-4">Health Web for Smartphones</h2>
                <p>Experience the power of AI-powered ambient listening technology in the palm of your hand. Health Web provides a comprehensive summary of a patient visit, and pre-fill orders for meds, labs, imaging, and referrals on any iOS or Android smartphone.</p>
            </Col>
            </Row>
        </div>
      </Container>

      <Container>
        <div className="videoContainer pt-5 px-5 mt-4">
            <Row className="align-items-center">
                <Col xl={6}>
                    <h2 className="mb-4">Health Web for iPad</h2>
                    <p>Get the power of AI-powered ambient listening technology in your hands on a bigger screen. Just like on your smartphone, Health Web provides a comprehensive summary of a patient visit, pre-fill orders for meds, labs, imaging, and referrals right on your iPad®.</p>
                </Col>
                <Col xl={6}>
                    <video className="card-video" controls>
                        <source src="https://sitemployee.sourcesoftsolutions.com/assets/images/script_2.mp4" type="video/mp4" />            
                    </video>
                </Col>
            </Row>
        </div>
      </Container>


      
      


        <div className="text-center mt-5">
            <button className="demoButton">Schedule a Demo</button>
          </div>


    <WorkFlow />

  </section>

  </>
);

export default WorkCards;
