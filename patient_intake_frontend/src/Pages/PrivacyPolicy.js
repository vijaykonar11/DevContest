import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <>
      <div className="hero-basic light bg-light px-5 py-5 text-center">
        <div className="hero-basic__bg hero-basic__bg--blue">
          <div className="bg-shapes"></div>
        </div>
        <div className="hero-basic__content">
          <h1>Privacy Policies</h1>
          <p className="customizep">
            Protecting your privacy is important to us. Our Privacy Policy outlines how we collect,
            use, and disclose personal information through HealthWeb. Please review our Privacy
            Policy carefully to understand how we handle your information.
          </p>
        </div>
      </div>

      <section className="terms mt-4">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="heading-container"></div>
              <div className="priBox">
                <h3 className="customisedh3">Information We Collect</h3>
                <br />
                <p className="TandP">
                  We collect personal information such as name, email address, and contact
                  information when you use HealthWeb. We may also collect usage data, cookies, and
                  other tracking technologies to improve our service.
                </p>
              </div>
              <div className="priBox">
                <h3 className="customisedh3">How We Use Your Information</h3>
                <br />
                <p className="TandP">
                  We use the information collected to provide and improve HealthWeb, personalize
                  user experiences, and communicate with users. We do not sell or share personal
                  information with third parties for marketing purposes..
                </p>
              </div>
              <div className="priBox">
                <h3 className="customisedh3">Data Security</h3>
                <br />
                <p className="TandP">
                  We implement measures to protect the security of your personal information and
                  prevent unauthorized access, use, or disclosure. However, no method of
                  transmission over the internet or electronic storage is 100% secure.
                </p>

                <h3 className="customisedh3">Third-Party Links</h3>
                <br />
                <p className="TandP">
                  HealthWeb may contain links to third-party websites or services that are not owned
                  or controlled by HealthWeb. We are not responsible for the privacy practices or
                  content of these websites.
                </p>
              </div>
              <div className="priBox">
                <h3 className="customisedh3">Changes to Privacy Policy</h3>
                <br />
                <p className="TandP">
                  HealthWeb reserves the right to modify or revise our Privacy Policy at any time
                  without prior notice. Your continued use of HealthWeb constitutes acceptance of
                  the modified policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="m-4 text-center">
        <div className="container bg-light p-5 rounded heading-container">
          <h1 className="fs-4">
            By using HealthWeb, you consent to the terms of our Privacy Policy. If you have any
            questions or concerns about our <Link to={"/policy-privacy"}>Privacy Policy </Link> ,
            please contact us at <a href={"mailto:info@healthweb.ai"}>info@healthweb.ai</a>
          </h1>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicy;
