import React, { useState, useRef, useEffect } from "react";
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

const AudioTest3 = ({ patient_name, dob }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [conversations, setConversations] = useState([]);
  const chatBoxRef = useRef(null);
  const [liveConversations, setLiveConversations] = useState([]);

  const [ehrInfo, setEhrInfo] = useState();
  const [isDisabled, setIsDisabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const userId = useSelector((state) => state?.userInfo?.user.id);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [liveConversations]);

  // ------------------------------------------------------------ send audio chunk after every [chunk_time_duration]2sec -------------------------------------------------------

  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const processorRef = useRef(null);
  const audioBufferRef = useRef([]); // Use useRef for audioBuffer to avoid re-renders
  const chunkInterval = 2000; // Interval to send chunks (in milliseconds)
  const intervalRef = useRef(null);

  const startRecording = () => {
    setIsRecording(true);
    audioBufferRef.current = [];

    setIsDisabled(true);
    setTimeout(() => setIsDisabled(false), 2500);
    timerRef.current = setInterval(() => {
      setTimer((prevTime) => prevTime + 1);
    }, 1000);

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        sourceNodeRef.current = audioContextRef.current.createMediaStreamSource(stream);
        processorRef.current = audioContextRef.current.createScriptProcessor(2048, 1, 1);

        sourceNodeRef.current.connect(processorRef.current);
        processorRef.current.connect(audioContextRef.current.destination);

        processorRef.current.onaudioprocess = (e) => {
          const audioData = e.inputBuffer.getChannelData(0);
          processAudioData(audioData);
        };

        // Set interval to send audio chunks every chunkInterval milliseconds
        intervalRef.current = setInterval(() => {
          if (audioBufferRef.current.length > 0) {
            sendToBackend(createWavBlob(audioBufferRef.current));
            audioBufferRef.current = [];
          }
        }, chunkInterval);
      })
      .catch((err) => {
        console.error("Error accessing the microphone", err);
      });
  };

  const stopRecording = () => {
    console.log(liveConversations);
    setIsRecording(false);
    if (processorRef.current) {
      processorRef.current.disconnect();
    }
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (audioBufferRef.current.length > 0) {
      sendToBackend(createWavBlob(audioBufferRef.current));
    }
    audioBufferRef.current = [];
    clearInterval(timerRef.current);
  };

  const processAudioData = (audioData) => {
    audioBufferRef.current.push(new Float32Array(audioData));
  };

  const createWavBlob = (audioChunks) => {
    const buffer = mergeBuffers(
      audioChunks,
      audioChunks.reduce((acc, chunk) => acc + chunk.length, 0)
    );
    const wav = encodeWAV(buffer);
    return new Blob([wav], { type: "audio/wav" });
  };

  const mergeBuffers = (audioChunks, totalLength) => {
    const result = new Float32Array(totalLength);
    let offset = 0;
    audioChunks.forEach((chunk) => {
      result.set(chunk, offset);
      offset += chunk.length;
    });
    return result;
  };

  const encodeWAV = (samples) => {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    const writeString = (view, offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    const sampleRate = audioContextRef.current.sampleRate;
    const numChannels = 1;
    const bitsPerSample = 16;

    writeString(view, 0, "RIFF");
    view.setUint32(4, 32 + samples.length * 2, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, (sampleRate * numChannels * bitsPerSample) / 8, true);
    view.setUint16(32, (numChannels * bitsPerSample) / 8, true);
    view.setUint16(34, bitsPerSample, true);
    writeString(view, 36, "data");
    view.setUint32(40, samples.length * 2, true);

    const floatTo16BitPCM = (output, offset, input) => {
      for (let i = 0; i < input.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      }
    };

    floatTo16BitPCM(view, 44, samples);

    return view;
  };

  const sendToBackend = (blob) => {
    const formData = new FormData();
    // formData.append("audio", blob, "chunk.wav");
    console.log(blob);
    formData.append("file", blob, "recording.wav");

    axios
      .post("https://us2.sourcesoftsolutions.com:8032/transcribe", formData, {
        // .post(
        //   "https://us2.sourcesoftsolutions.com:8032/multipletranscribe",
        //   formData,
        //   {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Chunk uploaded successfully:", response.data);

        const result = response?.data;
        // setTranscript(result?.transcript);
        if (result?.speaker_transcripts) {
          const newArray = setLiveConversations((prev) => [
            ...prev,
            ...result?.speaker_transcripts,
          ]);
          // setLiveConversations(result?.refined_transcript?.conversation);
        }
        console.log(result);
      })
      .catch((error) => {
        console.error("Error uploading chunk:", error);
      });
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
      toast.error(error?.message || "Something went wrong");
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
                <Card.Text className="text-muted">Click the button to start recording</Card.Text>

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
                                // backgroundColor: `${colors[conv.speaker_tag]}`,
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
      {ehrInfo && (
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
              {/* <h5 className="mb-1" style={{ whiteSpace: "pre-wrap" }}>
                {ehrInfo}
              </h5> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioTest3;
