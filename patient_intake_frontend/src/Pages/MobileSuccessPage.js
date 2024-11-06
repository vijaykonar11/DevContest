import React from "react";
import { Container, Row, Col, ResponsiveEmbed } from "react-bootstrap";
import SuccessLogo from "../assets/success.png";

const MobileSuccessPage = () => {
  return (
    <Container className="mt-5 text-center">
      <Row>
        <Col xs={12} md={8} className="mx-auto mb-2">
          <h4 className="mb-5">Your conversation has been stored</h4>
          <img src={SuccessLogo} alt="Your Image" className="img-fluid" width={100} />
          <h5 className="mt-4">Recording saved</h5>
          {/* <p></p>
          <a href="https://example.com">Your Link</a> */}
        </Col>
      </Row>
    </Container>
  );
};

export default MobileSuccessPage;
