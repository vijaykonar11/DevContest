import React, { useState, useRef, useEffect } from "react";
import { MediaRecorder } from "extendable-media-recorder";
import { FaMicrophone, FaStop, FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { Card, Col, Container, Row } from "react-bootstrap";
import { MdDownload, MdTranscribe } from "react-icons/md";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "../styles/AudioRecorder.css";

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const models = [
  {
    name: "Riva model 1",
    url: "https://us2.sourcesoftsolutions.com:8032/transcribe",
  },
  {
    name: "Riva model 2",
    url: "https://us2.sourcesoftsolutions.com:8032/rivatranscribe",
  },
  {
    name: "Assembly model",
    url: "https://us2.sourcesoftsolutions.com:8032/assembletranscribe",
  },
];

const AudioTest = ({ patient_name, dob }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [conversations, setConversations] = useState([]);
  const chatBoxRef = useRef(null);
  const [liveConversations, setLiveConversations] = useState([]);
  const [audios, setAudios] = useState([]);
  const [ehrInfo, setEhrInfo] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const [responseLength, setResponseLength] = useState(1);
  const [lastMessage, setLastMessage] = useState([]);

  const [selectModel, setSelectModel] = useState(
    "https://us2.sourcesoftsolutions.com:8032/transcribe"
  );

  const userId = useSelector((state) => state?.userInfo?.user.id);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [liveConversations]);

  // --------------------------------------------- send audio chunk by appending audio[full audio] ----------------------------------------------

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
      setAudioURL("");
      setLiveConversations([]);
      setAudioBlob(null);
      audioChunksRef.current = [];
      setIsDisabled(true);
      setTimeout(() => setIsDisabled(false), 2500);
      timerRef.current = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);

      const permission = await navigator.permissions.query({
        name: "microphone",
      });
      if (permission?.status === "denied") console.log(permission.status);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("permissions: ", stream);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/wav",
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log(audios);
        await sendAudioDataPeriodically();
        setLiveConversations(lastMessage);
        if (audioChunksRef.current.length === 0) return;
        const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const audioURL = window.URL.createObjectURL(blob);
        setAudioURL(audioURL);
        setAudioBlob(blob);
        audioChunksRef.current.map((ref) =>
          setAudios([...audios, window.URL.createObjectURL(ref)])
        );
        audioChunksRef.current = [];

        stream.getTracks().forEach((track) => track.stop());
        setIsDisabled(true);
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
          setConversations(result?.refined_transcript?.conversation);
          setEhrInfo(result?.ehr_info);

          sendAudioDataToBackend(blob, result);
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
          // "http://192.168.20.89:5001/transcribe",
          // "https://us2.sourcesoftsolutions.com:8032/transcribe",
          // "https://us2.sourcesoftsolutions.com:8032/gpttranscribe",
          // "https://us2.sourcesoftsolutions.com:8032/multipletranscribe",
          selectModel,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const result = response?.data;
        if (result?.speaker_transcripts) {
          if (result?.speaker_transcripts.length < responseLength) {
            setResponseLength(result?.speaker_transcripts.length);
          } else {
            setLiveConversations((prev) => result?.speaker_transcripts);
            setLiveConversations((prev) => prev.pop());
            setResponseLength(result?.speaker_transcripts.length);
          }
          console.log("lastMessage: ", lastMessage);
          setLastMessage(result?.speaker_transcripts);
        }

        // console.log(result);
      } catch (error) {
        console.error("Error uploading audio:", error);
      }
    } else {
      console.log("no chunks");
    }
  };

  // ------------------------------------------------------ common function to be used ------------------------------------------------------

  const downloadAudio = () => {
    if (audioBlob) {
      const url = window.URL.createObjectURL(audioBlob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "recording.wav";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  const sendAudioDataToBackend = async (blob, result) => {
    const formData = new FormData();
    formData.append("file", blob, "recording.wav");
    formData.append("user_id", userId);
    formData.append("ehr_info", JSON.stringify(result?.ehr_info));
    formData.append("refined_transcript", JSON.stringify(result?.refined_transcript));
    formData.append("transcript", result?.transcript);
    formData.append("dob", dob);
    formData.append("patient_name", patient_name);

    try {
      await axios.post(
        "https://us2.sourcesoftsolutions.com:8032/saveAudio",
        // "http://192.168.2.171:5000/saveAudio",\
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    } catch (error) {
      console.error("Error saving audio data:", error);
      // toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <div style={{ minHeight: "82vh" }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={6} className="w-100">
            <Card className="w-100">
              <Card.Body className="w-100">
                <Card.Title className="fw-bold">Doctor</Card.Title>
                <Card.Text className="d-flex justify-content-between">
                  <span>Click the button to start recording</span>
                  <select
                    className="form-select w-25"
                    aria-label="Default select example"
                    value={selectModel}
                    onChange={(e) => {
                      setConversations([]);
                      setLiveConversations([]);
                      setEhrInfo([]);
                      setSelectModel(e.target.value);
                    }}
                  >
                    {models?.map((m) => (
                      <option value={m.url}>{m.name}</option>
                    ))}
                  </select>
                </Card.Text>

                {liveConversations ? (
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

                      {liveConversations?.map((conv, index) => (
                        <>
                          <div
                            className={`d-flex align-items-center my-4 justify-content-${
                              conv.speaker_tag % 2 === 0 ? "end" : "start"
                            }`}
                          >
                            {conv.speaker_tag % 2 !== 0 && (
                              <div className="conversation-icon" style={{ marginRight: "0.5rem" }}>
                                <FaUserCircle />
                              </div>
                            )}
                            <div
                              className={`chat-message doctor`}
                              style={{
                                backgroundColor: "#ff8989",
                              }}
                            >
                              <span className="conversation-speaker-tag">
                                Person {conv.speaker_tag}:{" "}
                              </span>
                              <span className="conversation-text">{conv.transcript}</span>
                            </div>
                            {conv.speaker_tag % 2 === 0 && (
                              <div className="conversation-icon" style={{ marginLeft: "0.5rem" }}>
                                <FaUserCircle />
                              </div>
                            )}
                          </div>
                        </>
                      ))}
                    </div>
                  </div>
                ) : (
                  <></>
                )}

                {audioURL && (
                  <div className="d-flex justify-content-center align-items-center mt-3">
                    <audio src={audioURL} controls className="w-100" />
                    <button onClick={downloadAudio} className="btn btn-primary btn-sm rounded-pill">
                      <span className="d-flex align-items-center">
                        <MdDownload />
                        <span className="mx-2">Download</span>
                      </span>
                    </button>
                  </div>
                )}
                <div className="d-flex justify-content-center align-items-center mt-3">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`btn ${isRecording ? "btn-danger" : "btn-success"} btn-lg`}
                    disabled={isDisabled}
                  >
                    {isRecording ? (
                      <span className="d-flex align-items-center">
                        <FaStop />
                        <span className="mx-2">Stop {formatTime(timer)}</span>
                      </span>
                    ) : (
                      <span className="d-flex align-items-center">
                        <FaMicrophone />
                        <span className="mx-2">Start Recording</span>
                      </span>
                    )}
                  </button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {loading && (
        <div className="d-flex justify-content-center align-items-center m-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {conversations?.length !== 0 && (
        <div className="container mt-4">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Conversations</h2>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                {conversations.map((conv, index) => (
                  <>
                    {conv.Doctor ? (
                      <div key={index} className="my-3">
                        <span
                          className={`badge custom-primary me-2`}
                          // style={{ backgroundColor: "#ff8989" }}
                        >
                          {"Doctor"}
                        </span>
                        <span className="text">{conv?.Doctor}</span>
                      </div>
                    ) : (
                      <div key={index} className="my-3">
                        <span
                          className={`badge custom-secondary me-2`}
                          // style={{ backgroundColor: "#cbcbcb" }}
                        >
                          {"Patient"}
                        </span>
                        <span className="text">{conv?.Patient}</span>
                      </div>
                    )}
                  </>
                ))}
              </li>
            </ul>
          </div>
        </div>
      )}
      {ehrInfo.length !== 0 && (
        <div className="container mt-4">
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
                  <p className="card-text">{ehrInfo["Current Medication"] || "N/A"}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 my-3">
                  <h5 className="card-subtitle mb-1 text-muted">Diagnosis Codes</h5>
                  <p className="card-text">{ehrInfo["Diagnosis Codes"] || "N/A"}</p>
                </div>
                <div className="col-md-6 my-3">
                  <h5 className="card-subtitle mb-1 text-muted">Lab Test</h5>
                  <p className="card-text">{ehrInfo["Lab Tests"] || "N/A"}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 my-3">
                  <h5 className="card-subtitle mb-1 text-muted">Next Appointment</h5>
                  <p className="card-text">{ehrInfo["Next Appointment"] || "N/A"}</p>
                </div>
                <div className="col-md-6 my-3">
                  <h5 className="card-subtitle mb-1 text-muted">Patient History</h5>
                  <p className="card-text">{ehrInfo["Patient History"] || "N/A"}</p>
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
    </div>
  );
};

export default AudioTest;
