import React from "react";
import "../styles/Career.css";

import Header from "../components/Header";
import Footer from "../components/Footer";
const Career = () => {
  return (
    <>
      <div className="career-page">
        <h1>
          <strong>Careers</strong> at Health Web
        </h1>
        <h2>Join our team to make a difference by improving healthcare.</h2>
      </div>

      <div className="explore">
        <button className="btnSuccess px-5 py-3 border rounded-pill">Browse Jobs</button>
      </div>

      <div className="page-cont">
        <p>
          We are at the forefront of healthcare IT and offer medical providers around the world with
          the necessary technology to combat physician burnout.
        </p>
        <p>
          Our team is deeply passionate and dedicated to creating a positive impact, and we believe
          that your help can make a significant difference in achieving our goals.
          <a href="https://www.indeed.com/cmp/headthWeb.ai">Apply Today.</a>
        </p>
      </div>

      <div className="container1">
        <div className="container2">
          <p>
            Health Web is a product of healow, LLC, an equal opportunity employer. We respect and
            seek to empower each individual and support the diverse cultures, perspectives, skills,
            and experiences that bring us together and help create a healthy world. We prohibit
            discrimination against qualified individuals based on their status as protected veterans
            or individuals with disabilities and prohibit discrimination against all individuals
            based on their race, color, religion, sex, sexual orientation, gender identity, national
            origin, or for inquiring about, discussing, or disclosing compensation information.
          </p>

          <p>
            We value the diverse backgrounds, skills, talents, and experiences people with
            disabilities bring to the workplace. We will provide reasonable accommodations to
            qualified employees and applicants with disabilities, consistent with the Americans with
            Disabilities Act of 1990 and state law unless doing so would create an undue hardship.
            To request reasonable accommodation, please reach out to the Human Resources Department
            at
            <a href="mailto:info@healthweb.ai"> recruitment info@healthweb.ai</a>.
          </p>
        </div>
      </div>

      <div className="explore">
        <button className="btnSuccess px-5 py-3 border rounded-pill">Browse Jobs</button>
      </div>

      <div className="container3">
        <h2>Benefits</h2>
        <div className="listing">
          <ul>
            <li>Generous paid time off and holidays</li>
            <li>Volunteer time off</li>
            <li>
              Planning for the future
              <ul>
                <li>401(k) retirement plan with safe harbor contributions and Roth options</li>
                <li>Financial education programs</li>
              </ul>
            </li>
            <li>Health, dental and vision</li>
            <li>Flexible Spending Accounts (FSA)</li>
            <li>Life insurance</li>
            <li>Short and long-term disability coverage</li>
            <li>Business travel accident insurance</li>
            <li>
              Voluntary benefits
              <ul>
                <li>Accident insurance</li>
                <li>Critical illness coverage</li>
                <li>Whole life insurance</li>
              </ul>
            </li>
            <li>Legal insurance</li>
            <li>Employee Assistance Program</li>
            <li>Wellness programs</li>
            <li>Employee and family activities</li>
            <li>Local and national discount programs</li>
            <li>Personal development and internal learning programs are available</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Career;
