import React from "react";

import { Col, Container, Figure, Row } from "react-bootstrap";

import BannerImg from "../assets/banner-mike.png";
import BannerImg2 from "../assets/banner-email.png";
import BannerImg3 from "../assets/banner-sms.png";

import Carousel from "react-bootstrap/Carousel";
import { Link } from "react-router-dom";
// import ExampleCarouselImage from 'components/ExampleCarouselImage';

function HomeBanner() {
  const bannerContent = [
    {
      spanTitle: "HealthWeb",
      mainTitle: "Medical AI Scribe",
      subTitle: "An innovative AI-driven ambient monitoring solution for healthcare documentation",
      src: BannerImg,
    },
    {
      spanTitle: "HealthWeb",
      mainTitle: "Patient Intake",
      subTitle:
        "Designed to gather personal details, medical history, and insurance information prior to a medical appointment.",
      src: BannerImg2,
    },
    {
      spanTitle: "HealthWeb",
      mainTitle: "SMS Service",
      subTitle:
        "An automated SMS service sends reminders to help ensure timely payment of outstanding bills.",
      src: BannerImg3,
    },
  ];

  return (
    <>
      <Carousel>
        {bannerContent.map((items, index) => (
          <Carousel.Item interval={5000} key={index}>
            <Container>
              <Row className="align-items-center justify-content-between text-lg-start text-center">
                <Col lg xl={6}>
                  <h2>
                    <span>{items.spanTitle}</span>
                    <br />
                    {items.mainTitle}
                  </h2>
                  <p>{items.subTitle}</p>
                  <Link to="/contact" className="btn">
                    Request a Demo
                  </Link>
                </Col>
                <Col lg xl={4}>
                  <Figure className="mt-lg-0 mt-5">
                    <img src={items.src} className="img-fluid banerMike" alt="Banner Image" />
                  </Figure>
                </Col>
              </Row>
            </Container>
          </Carousel.Item>
        ))}
      </Carousel>
    </>
  );
}

export default HomeBanner;
