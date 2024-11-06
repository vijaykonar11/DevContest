import { FaMicrophone, FaRegSave, FaStop } from "react-icons/fa";
import { Card, Col, Container, Row } from "react-bootstrap";
import React, { useState, useRef, useEffect } from "react";
import { MediaRecorder } from "extendable-media-recorder";
import { MdTranscribe } from "react-icons/md";
import { toast } from "react-toastify";
import axios from "axios";

import "../styles/AudioRecorder.css";
import { useNavigate, useParams } from "react-router-dom";

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const AudioForMobile = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [transcript, setTranscript] = useState("");
  const [conversations, setConversations] = useState([]);
  const chatBoxRef = useRef(null);
  const [audios, setAudios] = useState([]);
  const [result, setResult] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [savingLoad, setSavingLoad] = useState(false);

  const [ehrInfo, setEhrInfo] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const patient_name = "Patient";
  const dob = "2020-05-21";

  const navigate = useNavigate();

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [transcript]);

  const { id } = useParams();

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const intervalIdRef = useRef(null);

  useEffect(() => {
    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      setTranscript("");
      setAudioURL("");
      audioChunksRef.current = [];
      setIsDisabled(true);

      await navigator.mediaDevices.getUserMedia({ audio: true });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("permissions: ", stream);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/wav",
      });

      setTimeout(() => setIsDisabled(false), 2500);
      timerRef.current = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        if (audioChunksRef.current.length === 0) return;
        setIsDisabled(true);
        await sendAudioDataPeriodically();
        console.log(audios);
        // console.log(audioChunksRef.current.length);
        const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const audioURL = window.URL.createObjectURL(blob);
        setAudioURL(audioURL);
        setAudioBlob(blob);
        audioChunksRef.current.map((ref) =>
          setAudios([...audios, window.URL.createObjectURL(ref)])
        );
        audioChunksRef.current = [];

        stream.getTracks().forEach((track) => track.stop());
        setLoading(true);

        // Make an API call with the audio blob
        try {
          const formData = new FormData();
          formData.append("file", blob, "recording.wav");

          const response = await axios.post(
            "https://us2.sourcesoftsolutions.com:8032/finaltranscribe",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          const result = response.data;
          setResult(result);
          setAudioBlob(blob);
          setTranscript(result?.transcript);
          setConversations(result?.refined_transcript?.conversation);
          setEhrInfo(result?.ehr_info);

          // sendAudioDataToBackend(blob, result);
        } catch (error) {
          console.error("Error uploading audio:", error);
          // toast.error(error?.message || "Error uploading audio:");
        } finally {
          setIsDisabled(false);
          setLoading(false);
        }
      };

      mediaRecorder.start(2000);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

      // Start sending audio data every 2 seconds
      intervalIdRef.current = setInterval(() => {
        if (mediaRecorder.state === "recording") {
          sendAudioDataPeriodically();
        }
      }, 2000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Failed to access microphone. Please check your browser settings and permissions.");
      setIsDisabled(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(intervalIdRef.current);
      clearInterval(timerRef.current);
      setTimer(0);
    }
  };

  const sendAudioDataPeriodically = async () => {
    if (audioChunksRef.current.length > 0) {
      const formData = new FormData();
      const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });

      formData.append("file", blob, "recording.wav");

      try {
        const response = await axios.post(
          "https://us2.sourcesoftsolutions.com:8032/realtimetranscribe",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const result = response?.data;
        setTranscript(result?.transcript);
        console.log(result);
      } catch (error) {
        console.error("Error uploading audio:", error);
      }
    } else {
      console.log("abcdef");
    }
  };

  const sendAudioDataToBackend = async (blob, result) => {
    const formData = new FormData();
    formData.append("file", blob, "recording.wav");
    formData.append("user_id", id);
    formData.append("ehr_info", JSON.stringify(result?.ehr_info));
    formData.append("refined_transcript", JSON.stringify(result?.refined_transcript));
    formData.append("transcript", result?.transcript);
    formData.append("dob", dob);
    formData.append("patient_name", patient_name);

    try {
      setSavingLoad(true);
      const result = await axios.post(
        "https://us2.sourcesoftsolutions.com:8032/saveAudio",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      navigate("/mobile-success");
    } catch (error) {
      console.error("Error saving audio data:", error);
      // toast.error(error?.message || "Something went wrong");
    } finally {
      setSavingLoad(false);
    }
  };

  return (
    <div className="d-flex flex-column">
      <section className="py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={12}>
              <Card className="w-100">
                <Card.Body className="w-100">
                  <Card.Title className="fw-bold">Doctor</Card.Title>
                  <Card.Text className="text-muted">Click the button to start recording</Card.Text>

                  {transcript ? (
                    <div className="mt-3">
                      <div className="conversation-card" ref={chatBoxRef}>
                        <div
                          className={`conversation-placeholder d-flex align-items-center my-1 justify-content-center text-secondary`}
                        >
                          <span className="mx-2">
                            <MdTranscribe />
                          </span>
                          Your transcribe will be shown here
                        </div>

                        {transcript && (
                          <>
                            <div
                              className={`d-flex align-items-center my-4 justify-content-center`}
                            >
                              <div>
                                <span className="text-muted">{transcript}</span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}

                  {audioURL && (
                    <div className="d-flex justify-content-center align-items-center mt-3">
                      <audio src={audioURL} controls className="w-100" />
                    </div>
                  )}
                  <div className="d-flex justify-content-center align-items-center mt-3">
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`btn d-flex ${isRecording ? "btn-danger" : "btnSuccess"} btn-lg`}
                      disabled={isDisabled}
                    >
                      {isRecording ? (
                        <span className="d-flex align-items-center">
                          <FaStop />
                          <span className="mx-2">Stop {formatTime(timer)}</span>
                        </span>
                      ) : (
                        <span className="d-flex align-items-center">
                          {isDisabled ? (
                            <>
                              {loading ? (
                                <span className="mx-2">Generating </span>
                              ) : (
                                <span className="mx-2">Loading transcript</span>
                              )}
                            </>
                          ) : (
                            <>
                              <FaMicrophone />
                              <span className="mx-2">Start Recording</span>
                            </>
                          )}
                        </span>
                      )}

                      {loading && (
                        <div className="spinner-border text-secondary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      )}
                    </button>
                  </div>
                </Card.Body>
              </Card>

              {conversations?.length !== 0 && (
                <div className="mt-5">
                  <div className="card">
                    <div className="card-header">
                      <h2 className="card-title ">Conversations</h2>
                    </div>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item">
                        {conversations.map((conv, index) => (
                          <div key={index}>
                            {conv.Doctor ? (
                              <div className="my-3">
                                <span className={`badge custom-primary me-2`}>{"Doctor"}</span>
                                <span className="text">{conv?.Doctor}</span>
                              </div>
                            ) : (
                              <div className="my-3">
                                <span
                                  className={`badge custom-secondary me-2`}
                                  // style={{ backgroundColor: "#cbcbcb" }}
                                >
                                  {"Patient"}
                                </span>
                                <span className="text">{conv?.Patient}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {ehrInfo && ehrInfo.length !== 0 && (
                <div className="mt-5">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">Patient Information</h3>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6 my-3">
                          <h5 className="card-subtitle mb-1 text-muted">Allergies</h5>
                          <p className="card-text">{ehrInfo["Allergies"] || "N/A"}</p>
                        </div>
                        <div className="col-md-6 my-3">
                          <h5 className="card-subtitle mb-1 text-muted">Current Medication</h5>
                          <p className="card-text">{ehrInfo["Current_Medication"] || "N/A"}</p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 my-3">
                          <h5 className="card-subtitle mb-1 text-muted">Diagnosis Codes</h5>
                          <p className="card-text">{ehrInfo["Diagnosis_Codes"] || "N/A"}</p>
                        </div>
                        <div className="col-md-6 my-3">
                          <h5 className="card-subtitle mb-1 text-muted">Lab Test</h5>
                          <p className="card-text">{ehrInfo["Lab_Tests"] || "N/A"}</p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 my-3">
                          <h5 className="card-subtitle mb-1 text-muted">Next Appointment</h5>
                          <p className="card-text">{ehrInfo["Next_Appointment"] || "N/A"}</p>
                        </div>
                        <div className="col-md-6 my-3">
                          <h5 className="card-subtitle mb-1 text-muted">Patient History</h5>
                          <p className="card-text">{ehrInfo["Patient_History"] || "N/A"}</p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 my-3">
                          <h5 className="card-subtitle mb-1 text-muted">Vitals</h5>
                          <p className="card-text">{ehrInfo["Vitals"] || "N/A"}</p>
                        </div>
                        <div className="col-md-6 my-3">
                          <h5 className="card-subtitle mb-1 text-muted">Symptoms</h5>
                          <p className="card-text">{ehrInfo["Symptoms"] || "N/A"}</p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 my-3">
                          <h5 className="card-subtitle mb-1 text-muted">Summary</h5>
                          <p className="card-text">{ehrInfo["Summary"] || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </Container>

        {result && (
          <div className="d-flex justify-content-center align-items-center mt-3">
            <button
              onClick={() => sendAudioDataToBackend(audioBlob, result)}
              className={`btn d-flex btnSuccess btn-md align-items-center`}
              disabled={savingLoad}
            >
              <FaRegSave />
              <span className="mx-2">Save</span>

              {savingLoad && (
                <div className="spinner-border spinner-border-sm text-light" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default AudioForMobile;
