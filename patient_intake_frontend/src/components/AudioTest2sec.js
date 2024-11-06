import { FaMicrophone, FaStop } from "react-icons/fa";
import { Card, Col, Container, Row } from "react-bootstrap";
import React, { useState, useRef, useEffect } from "react";
import { MediaRecorder } from "extendable-media-recorder";
import { MdTranscribe } from "react-icons/md";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";

import "../styles/AudioRecorder.css";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const ffmpeg = new FFmpeg({ log: true });

const convertToMono = async (blob) => {
  try {
    await ffmpeg.load();
    await ffmpeg.writeFile("input.wav", await fetchFile(blob));
    await ffmpeg.exec(["-i", "input.wav", "-ac", "1", "output.wav"]);
    const data = await ffmpeg.readFile("output.wav");
    const monoBlob = new Blob([data.buffer], { type: "audio/wav" });
    return monoBlob;
  } catch (err) {
    console.log(err);
    return new Blob();
  }
};

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const AudioTest2sec = ({ patient_name, dob }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [conversations, setConversations] = useState([]);
  const chatBoxRef = useRef(null);
  const [audios, setAudios] = useState([]);

  const [ehrInfo, setEhrInfo] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  const timerValueRef = useRef(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [transcript]);

  const user = useSelector((state) => state?.userInfo?.user);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const intervalIdRef = useRef(null);

  useEffect(() => {
    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, []);

  let increamentTime = 0;

  // const startRecording = async () => {
  //   try {
  //     setTranscript("");
  //     setAudioURL("");
  //     setAudioBlob(null);
  //     audioChunksRef.current = [];
  //     setIsDisabled(true);

  //     const micStream = await navigator.mediaDevices.getUserMedia({
  //       audio: true,
  //     });

  //     const screenStream = await navigator.mediaDevices.getDisplayMedia({
  //       audio: true,
  //       video: true,
  //     });

  //     const audioContext = new AudioContext();

  //     const micSource = audioContext.createMediaStreamSource(micStream);
  //     const speakerSource = audioContext.createMediaStreamSource(screenStream);

  //     const destination = audioContext.createMediaStreamDestination();
  //     micSource.connect(destination);
  //     speakerSource.connect(destination);

  //     const mediaRecorder = new MediaRecorder(destination.stream, {
  //       mimeType: "audio/wav",
  //     });

  //     setTimeout(() => setIsDisabled(false), 2500);
  //     timerRef.current = setInterval(() => {
  //       setTimer((prevTime) => prevTime + 1);
  //     }, 1000);

  //     mediaRecorder.ondataavailable = (event) => {
  //       if (event.data.size > 0) {
  //         audioChunksRef.current.push(event.data);
  //       }
  //     };

  //     mediaRecorder.onstop = async () => {
  //       micStream.getTracks().forEach((track) => track.stop());
  //       screenStream.getTracks().forEach((track) => track.stop());

  //       if (audioChunksRef.current.length === 0) return;

  //       const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
  //       const monoBlob = await convertToMono(blob);
  //       const audioURL = URL.createObjectURL(monoBlob);
  //       setAudioURL(audioURL);
  //       setAudioBlob(blob);

  //       setIsDisabled(true);

  //       await sendAudioDataPeriodically();

  //       console.log(audios);

  //       audioChunksRef.current.map((ref) => setAudios([...audios, URL.createObjectURL(ref)]));
  //       audioChunksRef.current = [];

  //       setLoading(true);

  //       try {
  //         const formData = new FormData();
  //         formData.append("file", monoBlob, "recording.wav");

  //         const response = await axios.post(
  //           // "https://us2.sourcesoftsolutions.com:8032/finaltranscribe",
  //           "http://192.168.20.89:5000/finaltranscribe",
  //           formData,
  //           {
  //             headers: {
  //               "Content-Type": "multipart/form-data",
  //             },
  //           }
  //         );

  //         const result = response.data;
  //         setTranscript(result?.transcript);
  //         setConversations(result?.refined_transcript?.conversation);
  //         setEhrInfo(result?.ehr_info);

  //         sendAudioDataToBackend(blob, result);
  //       } catch (error) {
  //         console.error("Error uploading audio:", error);
  //         toast.error(error?.message || "Error uploading audio:");
  //       } finally {
  //         setIsDisabled(false);
  //         setLoading(false);
  //       }
  //     };

  //     mediaRecorder.start(2000);
  //     mediaRecorderRef.current = mediaRecorder;
  //     setIsRecording(true);

  //     // Start sending audio data every 2 seconds
  //     // intervalIdRef.current = setInterval(() => {
  //     //   if (mediaRecorder.state === "recording") {
  //     //     sendAudioDataPeriodically();
  //     //     increamentTime += 2000;
  //     //   }
  //     // }, 4000 + increamentTime);

  //     increamentTime = 0;
  //     const updateInterval = () => {
  //       clearInterval(intervalIdRef.current);
  //       intervalIdRef.current = setInterval(() => {
  //         if (mediaRecorder.state === "recording") {
  //           sendAudioDataPeriodically();
  //           console.log(timerRef.current);
  //           if (timer > 60) {
  //             increamentTime += 2000;
  //             updateInterval(); // Update the interval again with the new time
  //           }
  //           // updateInterval(); // Update the interval again with the new time
  //         }
  //       }, 2000 + increamentTime);
  //     };

  //     updateInterval(); // Start the initial interval
  //   } catch (error) {
  //     console.error("Error accessing microphone:", error);
  //     alert("Failed to access microphone. Please check your browser settings and permissions.");
  //     setIsDisabled(false);
  //   }
  // };

  const startRecording = async () => {
    try {
      setTranscript("");
      setAudioURL("");
      setAudioBlob(null);
      audioChunksRef.current = [];
      setIsDisabled(true);

      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: true,
      });

      const audioContext = new AudioContext();

      const micSource = audioContext.createMediaStreamSource(micStream);
      const speakerSource = audioContext.createMediaStreamSource(screenStream);

      const destination = audioContext.createMediaStreamDestination();
      micSource.connect(destination);
      speakerSource.connect(destination);

      const mediaRecorder = new MediaRecorder(destination.stream, {
        mimeType: "audio/wav",
      });

      setTimeout(() => setIsDisabled(false), 2500);

      // Use a ref to keep track of the timer value
      timerRef.current = setInterval(() => {
        timerValueRef.current += 1;
        setTimer(timerValueRef.current); // Update the state for re-rendering
        if (timerValueRef.current % 60 === 0 && increamentTime <= 9000) {
          console.log("Internal timer:", timerValueRef.current); // Check the current timer value
          increamentTime += 1000;
          updateInterval(); // Update the interval again with the new time
        }
      }, 1000);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        micStream.getTracks().forEach((track) => track.stop());
        screenStream.getTracks().forEach((track) => track.stop());

        if (audioChunksRef.current.length === 0) return;

        const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const monoBlob = await convertToMono(blob);
        const audioURL = URL.createObjectURL(monoBlob);
        setAudioURL(audioURL);
        setAudioBlob(blob);

        setIsDisabled(true);

        await sendAudioDataPeriodically();

        console.log(audios);

        audioChunksRef.current.map((ref) => setAudios([...audios, URL.createObjectURL(ref)]));
        audioChunksRef.current = [];

        setLoading(true);

        try {
          const formData = new FormData();
          formData.append("file", monoBlob, "recording.wav");

          const response = await axios.post(
            "https://us2.sourcesoftsolutions.com:8032/finaltranscribe",
            // "http://192.168.20.89:5000/finaltranscribe",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          const result = response.data;
          setTranscript(result?.transcript);
          setConversations(result?.refined_transcript?.conversation);
          setEhrInfo(result?.ehr_info);

          sendAudioDataToBackend(blob, result);
        } catch (error) {
          console.error("Error uploading audio:", error);
          toast.error(error?.message || "Error uploading audio:");
        } finally {
          setIsDisabled(false);
          setLoading(false);
        }
      };

      mediaRecorder.start(2000);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

      increamentTime = 0;
      const updateInterval = () => {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = setInterval(() => {
          if (mediaRecorder.state === "recording") {
            sendAudioDataPeriodically();
            console.log("Timer: ", timerValueRef.current); // Check the current timer value
            console.log("incrementtime: ", increamentTime); // Check the current timer value
          }
        }, 2000 + increamentTime);
      };

      updateInterval(); // Start the initial interval
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
      const monoBlob = await convertToMono(blob);

      formData.append("file", monoBlob, "recording.wav");

      try {
        const response = await axios.post(
          "https://us2.sourcesoftsolutions.com:8032/realtimetranscribe",
          // "http://192.168.20.89:5000/realtimetranscribe",
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
        if (axios.isCancel(error)) console.log("Request canceled", error.message);
        else console.error("Error uploading audio:", error);
      }
    } else {
      console.log("abcdef");
    }
  };

  const sendAudioDataToBackend = async (blob, result) => {
    const formData = new FormData();
    formData.append("file", blob, "recording.wav");
    formData.append("user_id", user?.id);
    formData.append("ehr_info", JSON.stringify(result?.ehr_info));
    formData.append("refined_transcript", JSON.stringify(result?.refined_transcript));
    formData.append("transcript", result?.transcript);
    formData.append("dob", dob);
    formData.append("patient_name", patient_name);

    try {
      await axios.post("https://us2.sourcesoftsolutions.com:8032/saveAudio", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.error("Error saving audio data:", error);
      toast.error(error?.message || "Something went wrong");
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
                      className={`btn d-flex align-items-center ${
                        isRecording ? "btn-danger" : "btnSuccess"
                      } btn-lg`}
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
                                <span
                                  className={`badge custom-primary me-2`}
                                  // style={{ backgroundColor: "#ff8989" }}
                                >
                                  {"Doctor"}
                                </span>
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
                          <p className="card-text">
                            {ehrInfo["Allergies"] || "Information not provided"}
                          </p>
                        </div>
                        <div className="col-md-6 my-3">
                          <h5 className="card-subtitle mb-1 text-muted">Current Medication</h5>
                          <p className="card-text">
                            {ehrInfo["Current_Medication"] || "Information not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 my-3">
                          <h5 className="card-subtitle mb-1 text-muted">Diagnosis Codes</h5>
                          <p className="card-text">
                            {ehrInfo["Diagnosis_Codes"] || "Information not provided"}
                          </p>
                        </div>
                        <div className="col-md-6 my-3">
                          <h5 className="card-subtitle mb-1 text-muted">Lab Test</h5>
                          <p className="card-text">
                            {ehrInfo["Lab_Tests"] || "Information not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 my-3">
                          <h5 className="card-subtitle mb-1 text-muted">Next Appointment</h5>
                          <p className="card-text">
                            {ehrInfo["Next_Appointment"] || "Information not provided"}
                          </p>
                        </div>
                        <div className="col-md-6 my-3">
                          <h5 className="card-subtitle mb-1 text-muted">Patient History</h5>
                          <p className="card-text">
                            {ehrInfo["Patient_History"] || "Information not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 my-3">
                          <h5 className="card-subtitle mb-1 text-muted">Vitals</h5>
                          <p className="card-text">
                            {ehrInfo["Vitals"] || "Information not provided"}
                          </p>
                        </div>
                        <div className="col-md-6 my-3">
                          <h5 className="card-subtitle mb-1 text-muted">Symptoms</h5>
                          <p className="card-text">
                            {ehrInfo["Symptoms"] || "Information not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 my-3">
                          <h5 className="card-subtitle mb-1 text-muted">Summary</h5>
                          <p className="card-text">
                            {ehrInfo["Summary"] || "Information not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default AudioTest2sec;
