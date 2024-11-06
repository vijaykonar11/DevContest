import React, { useState } from "react";
import { MDBAccordion, MDBAccordionItem, MDBContainer } from "mdb-react-ui-kit";
import { Col, Container, Row } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";

const FAQs = () => {
  const questions = [
    {
      question: "How do I begin using HealthWeb?",
      answer:
        "To get started with Health Web’s medical AI scribe, click here to Request a demo. Our team will walk you through the setup and integration process, ensuring a smooth transition to our advanced AI-driven ambient technology.",
    },
    {
      question: "How accurate is the documentation produced by HealthWeb?",
      answer:
        "Health Web produces highly accurate clinical documentation, thanks to its sophisticated natural language processing and machine learning algorithms.",
    },
    {
      question: "Can HealthWeb recognize various accents and dialects?",
      answer:
        "Yes, Health Web is capable of understanding a variety of accents and dialects, ensuring accessibility for a diverse group of healthcare providers and patients.",
    },
    {
      question: "Does HealthWeb comply with HIPAA regulations?",
      answer:
        "Health Web is committed to safeguarding patient data with the highest standards of privacy and security. We adhere to HIPAA requirements by signing business associate agreements and implementing the necessary administrative, physical, and technical safeguards. Our platform employs industry-standard encryption and security protocols. However, it's important to remember that HIPAA compliance is not solely reliant on the technology; users must also adhere to their own obligations to ensure compliance.",
    },
  ];

  return (
    <>
      <section className="py-5">
        {/* <MDBContainer id="faqs" className='py-5'>
          <MDBAccordion alwaysOpen >
            <div className="faq montserrat-top-text">
                {questions.map((question, index) => (
                    <MDBAccordionItem collapseId={index} headerTitle={question.question} key={index}>
                    {<p>{question.answer}</p>}
                    </MDBAccordionItem>
                ))}
            </div>
          </MDBAccordion>
        </MDBContainer> */}

        <Container id="faq-container">
          <div className="faqPage">
            <Row>
              <Col>
                <h1 className="titleFaq mb-4 mb-lg-5">Frequently Asked Questions</h1>
              </Col>
              <Col xl={12}>
                <Accordion defaultActiveKey="0">
                  {questions.map((question, index) => (
                    <Accordion.Item eventKey={index.toString()} key={index}>
                      <Accordion.Header>{question.question}</Accordion.Header>
                      <Accordion.Body>{question.answer}</Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Col>
            </Row>
          </div>
        </Container>
      </section>
    </>
  );
};

export default FAQs;
