import React from "react";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import UserIcon from "../assets/user-icon.png";

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

function ReviewsClient() {
  return (
    <>
      <section className="clientSay">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <h1 className="text-center mb-5">What Clients Say About Us</h1>
              <Carousel responsive={responsive}>
                <div className="pt-5">
                  <div className="imgBox">
                    <img src={UserIcon} />
                    <h3>
                      Geli King-Brown, Sr. Director of Quality Management at HHM
                      Health
                    </h3>
                    <p>
                      Our healthcare providers see many patients every day at
                      the health center, and charting patient information adds a
                      significant administrative burden on them. We’re excited
                      to implement Health Web, an ambient listening solution, to
                      help save time on clinical documentation during patient
                      encounters, allowing providers to focus their efforts on
                      patient care.
                    </p>
                  </div>
                </div>
                <div className="pt-5">
                  <div className="imgBox">
                    <img src={UserIcon} />
                    <h3>
                      Geli King-Brown, Sr. Director of Quality Management at HHM
                      Health
                    </h3>
                    <p>
                      Our healthcare providers see many patients every day at
                      the health center, and charting patient information adds a
                      significant administrative burden on them. We’re excited
                      to implement Health Web, an ambient listening solution, to
                      help save time on clinical documentation during patient
                      encounters, allowing providers to focus their efforts on
                      patient care.
                    </p>
                  </div>
                </div>
                <div className="pt-5">
                  <div className="imgBox">
                    <img src={UserIcon} />
                    <h3>
                      Geli King-Brown, Sr. Director of Quality Management at HHM
                      Health
                    </h3>
                    <p>
                      Our healthcare providers see many patients every day at
                      the health center, and charting patient information adds a
                      significant administrative burden on them. We’re excited
                      to implement Health Web, an ambient listening solution, to
                      help save time on clinical documentation during patient
                      encounters, allowing providers to focus their efforts on
                      patient care.
                    </p>
                  </div>
                </div>
              </Carousel>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ReviewsClient;
