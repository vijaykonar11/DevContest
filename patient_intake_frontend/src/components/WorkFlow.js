import React from "react";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { FaMicrophone, FaUsers, FaFileAlt, FaHospital, FaNotesMedical } from "react-icons/fa";
//import { IoDocumentsOutline } from "react-icons/io5";

//import './Work.css';

const WorkFlow = () => {
  return (
    <>
      <section className="workflow">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8">
              <h1 className="text-center">How Health Web Works ?</h1>
              <div className="steps">
                <VerticalTimeline lineColor="grey">
                  <VerticalTimelineElement
                    iconStyle={{ background: "#1eafb3", color: "#fff" }}
                    icon={<FaMicrophone />}
                    // date="1"
                  >
                    <h2>Listen to the Conversation</h2>
                    <p>
                      It listens to patient-provider conversations to help document clinical
                      information accurately and efficiently.
                    </p>
                  </VerticalTimelineElement>

                  <VerticalTimelineElement
                    iconStyle={{ background: "#1eafb3", color: "#fff" }}
                    icon={<FaUsers />}
                    // date="2"
                  >
                    <h2>Generates a dialogue flow</h2>
                    <p>
                      It uses AI and voice recognition technology to create a transcript of the
                      dialogue flow between providers and patients.
                    </p>
                  </VerticalTimelineElement>

                  <VerticalTimelineElement
                    iconStyle={{ background: "#1eafb3", color: "#fff" }}
                    icon={<FaHospital />}
                    // date="3"
                  >
                    <h2>Creates a clinical document draft</h2>
                    <p>
                      It categorizes the summarized content into appropriate Progress Note sections
                      and allows for reviewing and importing relevant data for clinical
                      documentation.
                    </p>
                  </VerticalTimelineElement>

                  <VerticalTimelineElement
                    iconStyle={{ background: "#1eafb3", color: "#fff" }}
                    icon={<FaFileAlt />}
                    // date="4"
                  >
                    <h2>Assists with order entry</h2>
                    <p>
                      It draft captures labs, imaging, procedures, medication orders, and follow-up
                      visit details.
                    </p>
                  </VerticalTimelineElement>

                  <VerticalTimelineElement
                    iconStyle={{ background: "#1eafb3", color: "#fff" }}
                    icon={<FaNotesMedical />}
                    // date="5"
                  >
                    <h2>Provides a summary for review</h2>
                    <p>
                      It streamlines the clinical documentation process by allowing healthcare
                      providers to review summarized content for accuracy, modify it if necessary,
                      and merge pre-configured defaults with a single click.
                    </p>
                  </VerticalTimelineElement>
                </VerticalTimeline>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WorkFlow;
