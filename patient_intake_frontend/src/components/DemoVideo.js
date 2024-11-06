import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Header from "./Header";
import Footer from "./Footer";

function DemoVideo() {
  return (
    <>
      <section className="py-5">
        <Container>
          <div className="videoContainer pt-5 px-5 mt-4">
            <Row className="align-items-center">
              <Col xl={6}>
                <video className="card-video" controls>
                  <source
                    src="https://sitemployee.sourcesoftsolutions.com/assets/images/script_1.mp4"
                    type="video/mp4"
                  />
                </video>
              </Col>
              <Col xl={6} className="ps-5">
                <h2 className="mb-4">Health Web for Smartphones</h2>
                <p>
                  Experience the power of AI-powered ambient listening technology in the palm of
                  your hand. Health Web provides a comprehensive summary of a patient visit, and
                  pre-fill orders for meds, labs, imaging, and referrals on any iOS or Android
                  smartphone.
                </p>
              </Col>
            </Row>
          </div>
        </Container>

        <Container>
          <div className="videoContainer pt-5 px-5 mt-4">
            <Row className="align-items-center">
              <Col xl={6}>
                <h2 className="mb-4">Health Web for iPad</h2>
                <p>
                  Get the power of AI-powered ambient listening technology in your hands on a bigger
                  screen. Just like on your smartphone, Health Web provides a comprehensive summary
                  of a patient visit, pre-fill orders for meds, labs, imaging, and referrals right
                  on your iPad®.
                </p>
              </Col>
              <Col xl={6}>
                <video className="card-video" controls>
                  <source
                    src="https://sitemployee.sourcesoftsolutions.com/assets/images/script_2.mp4"
                    type="video/mp4"
                  />
                </video>
              </Col>
            </Row>
          </div>
        </Container>
      </section>
    </>
  );
}

export default DemoVideo;
