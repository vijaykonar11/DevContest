import React from "react";
import "../styles/About.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const About = () => {
  return (
    <>
      <div className="about-container">
        <h1>The road to getting more time back starts with Health Web</h1>
        <p>
          We are passionate about improving healthcare delivery through AI and ambient listening
          technology. We are engineers, medical professionals, and dreamers who want to help
          physicians reduce administrative burdens and get more time back in their day.
        </p>
        <p>
          Doctors, nurse practitioners, and medical professionals worldwide are dedicated to
          providing quality healthcare. We are committed to helping these professionals by providing
          a service that makes their lives easier, saves time, reduces burnout, and improves care.
        </p>
      </div>
      <div className="about-2container">
        <div className="about-left">
          <h2>Health Web: Listen</h2>
          <p>
            Health Web means “listen,” and that’s just what we did. For years, we have heard the
            stories and experienced burnout firsthand. By listening to physicians and other medical
            professionals, we realized that our goal was simple: eliminate the need for providers to
            split their focus between listening to the patient and taking clinical notes. To enhance
            a provider’s ability to do that, we harnessed the power of Artificial Intelligence to
            develop a virtual scribe for clinical documentation. Through this solution, we’ve
            improved the efficiency of this process by allowing the providers to focus entirely on
            patient interactions and not documentation.
          </p>
        </div>
        <div className="about-right">
          <h2>Why Health Web?</h2>
          <p>
            Health Web is EHR-agnostic, so it works with any EHR. And it’s transformative, so it
            helps providers deliver high-quality patient care. Your patients will love getting that
            face time back, and you will love extra time back in your day. Health Web is more
            cost-effective than traditional medical scribes and other speech recognition solutions.
            We are privately held, which means we have the ability to focus solely on what our
            clients need.
          </p>
        </div>
      </div>

      <div className="want-towork">
        <h2>Want to work with us?</h2>
        <p>
          Join us on our quest to bring this technology to physicians everywhere. We’d love to speak
          with you.
        </p>
        <button className="btnSuccess px-5 py-3 border rounded-pill">Explore Jobs</button>
      </div>
    </>
  );
};

export default About;
