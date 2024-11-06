import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MyRecordings from "../components/MyRecordings";
import { BiSolidVideoRecording } from "react-icons/bi";
import "../styles/Dashboard.css";
import { useSelector } from "react-redux";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBBtn,
  MDBCardFooter,
  MDBInputGroup,
} from "mdb-react-ui-kit";

const Dashboard = () => {
  const [info, setInfo] = useState(null);

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPatientsRecord, setLoadingPatientsRecord] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const userId = useSelector((state) => state?.userInfo?.user?.id);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingPatientsRecord(true);
      if (selectedPatient) {
        try {
          const res = await axios.get(`${process.env.REACT_APP_API}/audio/${selectedPatient?._id}`);

          setInfo(res?.data?.data);
          setLoadingPatientsRecord(false);
        } catch (err) {
          setError(err);
          setLoadingPatientsRecord(false);
          console.log(err);
        }
      } else {
        setLoadingPatientsRecord(false);
      }
    };
    fetchData();
  }, [selectedPatient]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.REACT_APP_API}/audio/user/${userId}`);

        if (res?.data?.status === "false") {
          setLoading(false);
          return;
        }

        setPatients(res?.data?.data);

        // console.log(res?.data);

        if (res?.data?.data?.length !== 0) setSelectedPatient(res?.data?.data[0]);

        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
        console.log(err);
      }
    };

    fetchData();
  }, []);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // }

  return (
    <>
      <div className="d-flex">
        <div className="border-dark-subtle w-25">
          <div className="myRecording">
            <h2>My Recordings</h2>
            <div className="p-2">
              <MyRecordings
                loading={loading}
                info={patients}
                onSelectPatient={(record) => setSelectedPatient(record)}
              />
            </div>
          </div>
        </div>

        <div className="w-50 patientSummary">
          <h2 className="text-center my-3">Patient Summary</h2>
          <div className="card">
            {loadingPatientsRecord ? (
              <div className="d-flex justify-content-center m-2">
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : info ? (
              <>
                {" "}
                <div className="itemBox">
                  <div className="listItem">Summary</div>
                  <div className="card-footer" style={{ width: "100%" }}>
                    {info?.ehr_info_summary || "No information"}
                  </div>
                </div>
                <div className="itemBox">
                  <div className="listItem">Allergies</div>
                  <div className="card-footer" style={{ width: "100%" }}>
                    {info?.ehr_info_allergies || "No information"}
                  </div>
                </div>
                <div className="itemBox">
                  <div className="listItem">Current Medication</div>
                  <div className="card-footer" style={{ width: "100%" }}>
                    {info?.ehr_info_current_medication || "No information"}
                  </div>
                </div>
                <div className="itemBox">
                  <div className="listItem">Lab tests</div>
                  <div className="card-footer" style={{ width: "100%" }}>
                    {info?.ehr_info_lab_tests || "No information"}
                  </div>
                </div>
                <div className="itemBox">
                  <div className="listItem">Next Appointment</div>
                  <div className="card-footer" style={{ width: "100%" }}>
                    {info?.ehr_info_next_appointment || "No information"}
                  </div>
                </div>
                <div className="itemBox">
                  <div className="listItem">Patient History</div>
                  <div className="card-footer" style={{ width: "100%" }}>
                    {info?.ehr_info_patient_history || "No information"}
                  </div>
                </div>
                <div className="itemBox">
                  <div className="listItem">Symptoms</div>
                  <div className="card-footer" style={{ width: "100%" }}>
                    {info?.ehr_info_symptoms || "No information"}
                  </div>
                </div>
                <div className="itemBox">
                  <div className="listItem">Diagnosis Codes</div>
                  <div className="card-footer" style={{ width: "100%" }}>
                    {info?.ehr_info_diagnosis_codes || "No information"}
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="w-25 conversationList">
          <h2 className="text-center my-3">Conversation</h2>
          {loadingPatientsRecord ? (
            <div className="d-flex justify-content-center m-2">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : info ? (
            <div className="px-2">
              {/* <MDBRow className="d-flex justify-content-end h-100">
                <MDBCol md="12" className="d-flex flex-column h-100"> */}
              <MDBCard id="chat1" className="flex-grow-1 h-100 border-0">
                <MDBCardBody className="overflow-auto">
                  <audio controls>
                    <source
                      src={`${process.env.REACT_APP_API}/${info?.file_path}`}
                      type="audio/mp3"
                    />
                    Your browser does not support the audio element.
                  </audio>

                  {/* {info.refined_transcript.map((line, index) => {

                        return (
                          <div key={index} className="message-row">
                            {line?.startsWith("Doctor:") ? (
                              <>
                                <div className="message-icon">
                                  <i className="fas fa-user-doctor fa-2x"></i>
                                </div>
                                <div className="message-content doctor">
                                  <p className="small mb-0">
                                    {line.replace("Doctor:", "").trim()}
                                  </p>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="message-icon">
                                  <i className="fas fa-user fa-2x"></i>
                                </div>
                                <div className="message-content patient">
                                  <p className="small mb-0">
                                    {line.replace("Patient:", "").trim()}
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })} */}

                  {/* {info?.refined_transcript.map((conv, index) => {
                        let parts;
                        if (conv?.includes("\n\n")) {
                          parts = conv.split("\n\n");
                        } else {
                          parts = conv.split("\n");
                        }
                        return (
                          <li className="list-group-item" key={index}>
                            {parts.map((part, index) => {
                              const isDoctor = part.startsWith("Doctor:");
                              return (
                                <div key={index} className="my-3">
                                  <span
                                    className={`badge ${
                                      isDoctor ? "bg-primary" : "bg-secondary"
                                    } me-2`}
                                  >
                                    {isDoctor ? "Doctor" : "Patient"}
                                  </span>
                                  <span className="text">
                                    {part.substring(part.indexOf(":") + 1)}
                                  </span>
                                </div>
                              );
                            })}
                          </li>
                        );
                      })} */}
                  {info?.refined_transcript.map((conv, index) => (
                    <>
                      <li className="listItem" key={index}>
                        {conv.Doctor ? (
                          <div key={index} className="doctorIcon my-2">
                            <span className={`name me-2`}>{"Doctor"}</span>
                            <span className="text">{conv?.Doctor}</span>
                          </div>
                        ) : (
                          <div key={index} className="patientIcon my-2">
                            <span className={`name me-2`}>{"Patient"}</span>
                            <span className="text">{conv?.Patient}</span>
                          </div>
                        )}
                      </li>
                    </>
                  ))}
                </MDBCardBody>
              </MDBCard>
              {/* </MDBCol>
              </MDBRow> */}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
