import React from "react";
import { Link } from "react-router-dom";

const TermsAndConditions = () => {
  return (
    <>
      <div className="hero-basic light bg-light px-5 py-5 text-center">
        <div className="hero-basic__bg hero-basic__bg--blue">
          <div className="bg-shapes"></div>
        </div>
        <div className="hero-basic__content">
          <h1>Terms And Conditions</h1>
          <p className="customizep">
            Welcome to HealthWeb. By accessing or using our chatbot service, you agree to comply
            with the following terms and conditions.
          </p>
        </div>
      </div>
      <section className="terms">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="heading-container"></div>

              <br />
              <h3 className="customisedh3">Acceptance of Terms:</h3>
              <br />
              <p className="TandP">
                {" "}
                By accessing or using HealthWeb, you agree to be bound by these Terms of Service. If
                you do not agree to these terms, please do not use our service.
              </p>
              <div className="priBox">
                <h3 className="customisedh3">Use of Service</h3>
                <br />
                <p className="TandP">
                  HealthWeb is provided for the purpose of assisting businesses with customer
                  engagement and operational efficiency. You may use the service only for lawful
                  purposes and in accordance with these terms.
                </p>
              </div>
              <div className="priBox">
                <h3 className="customisedh3">Intellectual Property</h3>
                <br />
                <p className="TandP">
                  All content, materials, and intellectual property rights associated with HealthWeb
                  are owned by Grey Matterz Inc. You may not use, modify, or distribute any of the
                  content without prior written consent.
                </p>
              </div>
              <div className="priBox">
                <h3 className="customisedh3">Privacy Policy</h3>
                <br />
                <p className="TandP">
                  Our Privacy Policy governs the collection, use, and disclosure of personal
                  information collected through HealthWeb. By using our service, you consent to the
                  terms of our Privacy Policy.
                </p>
              </div>
              <div className="priBox">
                <h3 className="customisedh3">Disclaimer of Warranties</h3>
                <br />
                <p className="TandP">
                  HealthWeb is provided "as is" and "as available" without warranties of any kind,
                  whether express or implied. We do not warrant that the service will be
                  uninterrupted, error-free, or free of viruses or other harmful components.
                </p>
              </div>
              <div className="priBox">
                <h3 className="customisedh3">Limitation of Liability</h3>
                <br />
                <p className="TandP">
                  In no event shall HealthWeb be liable for any direct, indirect, incidental,
                  special, or consequential damages arising out of or in any way connected with the
                  use of HealthWeb.
                </p>
              </div>
              <div className="priBox">
                <h3 className="customisedh3">Governing Law</h3>
                <br />
                <p className="TandP">
                  These Terms of Service shall be governed by and construed in accordance with the
                  laws of New Jersey, USA, without regard to its conflict of law provisions.
                </p>
              </div>
              <div className="priBox">
                <h3 className="customisedh3">Changes to Terms</h3>
                <br />
                <p className="TandP">
                  HealthWeb reserves the right to modify or revise these Terms of Service at any
                  time without prior notice. Your continued use of HealthWeb constitutes acceptance
                  of the modified terms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="m-4 text-center">
        <div className="container bg-light p-5 rounded heading-container">
          <h1 className="fs-4">
            Please review our full <Link to={"/terms-conditions"}> Terms of Service </Link>carefully
            before using HealthWeb. If you have any questions or concerns, please contact us at{" "}
            <a href={"mailto:info@healthweb.ai"}>info@healthweb.ai</a>
          </h1>
        </div>
      </section>
    </>
  );
};

export default TermsAndConditions;
