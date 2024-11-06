// import React, { useState, useRef, useEffect } from "react";
// import { MediaRecorder } from "extendable-media-recorder";
// import { FaMicrophone, FaStop, FaUserCircle } from "react-icons/fa";
// import axios from "axios";
// import { Card, Col, Container, Image, Row } from "react-bootstrap";
// import { MdDownload, MdTranscribe } from "react-icons/md";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import "../styles/AudioRecorder.css";
// import Footer from "./Footer";
// import Header from "./Header";

// const formatTime = (time) => {
//   const minutes = Math.floor(time / 60);
//   const seconds = time % 60;
//   return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
// };

// const AudioOld2 = ({ patient_name, dob }) => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [audioURL, setAudioURL] = useState("");
//   const [audioBlob, setAudioBlob] = useState(null);
//   const [transcript, setTranscript] = useState("");
//   const [conversations, setConversations] = useState([]);
//   const chatBoxRef = useRef(null);
//   const audioChunks = useRef(null);
//   const [liveConversations, setLiveConversations] = useState([]);
//   const [audios, setAudios] = useState([]);

//   const [ehrInfo, setEhrInfo] = useState([]);
//   const [isDisabled, setIsDisabled] = useState(false);
//   const [timer, setTimer] = useState(0);
//   const timerRef = useRef(null);
//   const [loading, setLoading] = useState(false);

//   const [displayConversation, setDisplayConversation] = useState(false);

//   useEffect(() => {
//     if (chatBoxRef.current) {
//       chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
//     }
//   }, [liveConversations]);

//   const user = useSelector((state) => state?.userInfo?.user.id);

//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);
//   const intervalIdRef = useRef(null);

//   useEffect(() => {
//     return () => {
//       clearInterval(intervalIdRef.current);
//     };
//   }, []);

//   const startRecording = async () => {
//     try {
//       setTranscript("");
//       setDisplayConversation(false);
//       setLiveConversations([]);
//       setAudioURL("");
//       setAudioBlob(null);
//       audioChunksRef.current = [];
//       // audioChunks.current = [];
//       setIsDisabled(true);
//       setTimeout(() => setIsDisabled(false), 2500);
//       timerRef.current = setInterval(() => {
//         setTimer((prevTime) => prevTime + 1);
//       }, 1000);

//       const permission = await navigator.permissions.query({
//         name: "microphone",
//       });
//       if (permission?.status === "denied") console.log(permission.status);
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       console.log("permissions: ", stream);
//       const mediaRecorder = new MediaRecorder(stream, {
//         mimeType: "audio/wav",
//       });

//       mediaRecorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           audioChunksRef.current.push(event.data);
//         }
//       };

//       mediaRecorder.onstop = async () => {
//         console.log(audios);
//         if (audioChunksRef.current.length === 0) return;
//         // console.log(audioChunksRef.current.length);
//         const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
//         const audioURL = window.URL.createObjectURL(blob);
//         setAudioURL(audioURL);
//         setAudioBlob(blob);
//         audioChunksRef.current.map((ref) =>
//           setAudios([...audios, window.URL.createObjectURL(ref)])
//         );
//         audioChunksRef.current = [];

//         stream.getTracks().forEach((track) => track.stop());
//         setIsDisabled(true);
//         setLoading(true);

//         await sendAudioDataFull();

//         // Make an API call with the audio blob
//         try {
//           const formData = new FormData();
//           formData.append("file", blob, "recording.wav");

//           const response = await axios.post(
//             "https://us2.sourcesoftsolutions.com:8032/finaltranscribe",
//             formData,
//             {
//               headers: {
//                 "Content-Type": "multipart/form-data",
//               },
//             }
//           );

//           const result = response.data;
//           setTranscript(result?.transcript);
//           setConversations(result?.refined_transcript?.conversation);
//           setEhrInfo(result?.ehr_info);
//           setDisplayConversation(true);
//           sendAudioDataToBackend(blob, result);
//         } catch (error) {
//           console.error("Error uploading audio:", error);
//           toast.error(error?.message || "Error uploading audio:");
//         } finally {
//           setIsDisabled(false);
//           setLoading(false);
//         }
//       };

//       mediaRecorder.start(2000);
//       mediaRecorderRef.current = mediaRecorder;
//       setIsRecording(true);

//       // Start sending audio data every 2 seconds
//       intervalIdRef.current = setInterval(() => {
//         if (mediaRecorder.state === "recording") {
//           sendAudioDataPeriodically();
//           sendAudioDataFull();
//         }
//       }, 2000);
//     } catch (error) {
//       console.error("Error accessing microphone:", error);

//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//       clearInterval(intervalIdRef.current);
//       clearInterval(timerRef.current);
//       setTimer(0);
//     }
//   };

//   const sendAudioDataPeriodically = async () => {
//     if (audioChunksRef.current.length > 0) {
//       const formData = new FormData();
//       const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });

//       formData.append("file", blob, "recording.wav");

//       try {
//         const response = await axios.post(
//           "https://us2.sourcesoftsolutions.com:8032/realtimetranscribe",
//           formData,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );

//         const result = response?.data;
//         setTranscript(result?.transcript);
//         console.log(result);
//       } catch (error) {
//         console.error("Error uploading audio:", error);
//       }
//     } else {
//       // console.log("abcdef");
//     }
//   };

//   const sendAudioDataFull = async () => {
//     if (audioChunksRef.current.length > 0) {
//       const formData = new FormData();
//       const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });

//       formData.append("file", blob, "recording.wav");

//       try {
//         const response = await axios.post(
//           //"https://us2.sourcesoftsolutions.com:8032/transcribe",
//           "https://us2.sourcesoftsolutions.com:8032/rivatranscribe",
//           formData,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );

//         const result = response?.data;

//         if (result?.speaker_transcripts) {
//           setLiveConversations(result?.speaker_transcripts);
//         }

//         console.log(result);
//       } catch (error) {
//         console.error("Error uploading audio:", error);
//       }
//     } else {
//       // console.log("abcdef");
//     }
//   };

//   const downloadAudio = () => {
//     if (audioBlob) {
//       const url = window.URL.createObjectURL(audioBlob);
//       const a = document.createElement("a");
//       a.style.display = "none";
//       a.href = url;
//       a.download = "recording.wav";
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);
//     }
//   };

//   const sendAudioDataToBackend = async (blob, result) => {
//     const formData = new FormData();
//     formData.append("file", blob, "recording.wav");
//     formData.append("user_id", user);
//     formData.append("ehr_info", JSON.stringify(result?.ehr_info));
//     formData.append(
//       "refined_transcript",
//       JSON.stringify(result?.refined_transcript)
//     );
//     formData.append("transcript", result?.transcript);
//     formData.append("dob", dob);
//     formData.append("patient_name", patient_name);

//     // console.log(extractText(result?.ehr_info));
//     // console.log("Payload for saving audio:", formData);
//     // for (var pair of formData.entries()) {
//     //   console.log(pair[0] + ", " + pair[1]);
//     // }

//     try {
//       await axios.post(
//         "https://us2.sourcesoftsolutions.com:8032/saveAudio",
//         // "http://192.168.2.171:5000/saveAudio",\
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );
//     } catch (error) {
//       console.error("Error saving audio data:", error);
//       toast.error(error?.message || "Something went wrong");
//     }
//   };

//   return (
//     // <div className="d-flex flex-column min-vh-100">
//     //   <Header />
//     //   <div className="d-flex">
//     //     <div className="flex-grow-1 m-5">
//     //       <div style={{ minHeight: "82vh" }}>
//     //         <Container>
//     //           <Row className="justify-content-center">
//     //             <Col md={6} className="w-100">
//     //               <Card className="w-100">
//     //                 <Card.Body className="w-100">
//     //                   <Card.Title className="fw-bold">Doctor</Card.Title>
//     //                   <Card.Text className="text-muted">
//     //                     Click the button to start recording
//     //                   </Card.Text>

//     //                   {transcript ? (
//     //                     <div className="mt-3">
//     //                       <div className="conversation-card" ref={chatBoxRef}>
//     //                         <div
//     //                           className={`conversation-placeholder d-flex align-items-center my-1 justify-content-center text-secondary`}
//     //                         >
//     //                           <span className="mx-2">
//     //                             <MdTranscribe />
//     //                           </span>
//     //                           Your transcribe will be shown here
//     //                         </div>

//     //                         {transcript && (
//     //                           <>
//     //                             <div
//     //                               className={`d-flex align-items-center my-4 justify-content-center`}
//     //                             >
//     //                               <div
//     //                                 className={`chat-message doctor`}
//     //                                 style={{
//     //                                   backgroundColor: "#ff8989",
//     //                                 }}
//     //                               >
//     //                                 <span className="text-muted">
//     //                                   {transcript}
//     //                                 </span>
//     //                               </div>
//     //                             </div>
//     //                           </>
//     //                         )}
//     //                       </div>
//     //                     </div>
//     //                   ) : (
//     //                     <></>
//     //                   )}

//     //                   {displayConversation ? (
//     //                     <div className="mt-3">
//     //                       <div className="conversation-card" ref={chatBoxRef}>
//     //                         {/* <div
//     //                           className={`conversation-placeholder d-flex align-items-center my-1 justify-content-center text-secondary`}
//     //                         >
//     //                           <span className="mx-2">
//     //                             <MdTranscribe />
//     //                           </span>
//     //                           Your transcribe will be shown here
//     //                         </div> */}

//     //                         {liveConversations?.map((conv, index) => (
//     //                           <>
//     //                             <div
//     //                               className={`d-flex align-items-center my-4 justify-content-${
//     //                                 conv.speaker_tag % 2 === 0 ? "end" : "start"
//     //                               }`}
//     //                             >
//     //                               {conv.speaker_tag % 2 !== 0 && (
//     //                                 <div
//     //                                   className="conversation-icon"
//     //                                   style={{ marginRight: "0.5rem" }}
//     //                                 >
//     //                                   <FaUserCircle />
//     //                                 </div>
//     //                               )}
//     //                               <div
//     //                                 className={`chat-message doctor`}
//     //                                 style={{
//     //                                   backgroundColor: "#ff8989",
//     //                                 }}
//     //                               >
//     //                                 <span className="conversation-speaker-tag">
//     //                                   Person {conv.speaker_tag}:{" "}
//     //                                 </span>
//     //                                 <span className="conversation-text">
//     //                                   {conv.transcript}
//     //                                 </span>
//     //                               </div>
//     //                               {conv.speaker_tag % 2 === 0 && (
//     //                                 <div
//     //                                   className="conversation-icon"
//     //                                   style={{ marginLeft: "0.5rem" }}
//     //                                 >
//     //                                   <FaUserCircle />
//     //                                 </div>
//     //                               )}
//     //                             </div>
//     //                           </>
//     //                         ))}
//     //                       </div>
//     //                     </div>
//     //                   ) : (
//     //                     <></>
//     //                   )}

//     //                   {audioURL && (
//     //                     <div className="d-flex justify-content-center align-items-center mt-3">
//     //                       <audio src={audioURL} controls className="w-100" />
//     //                       <button
//     //                         onClick={downloadAudio}
//     //                         className="btn btn-primary btn-sm rounded-pill"
//     //                       >
//     //                         <span className="d-flex align-items-center">
//     //                           <MdDownload />
//     //                           <span className="mx-2">Download</span>
//     //                         </span>
//     //                       </button>
//     //                     </div>
//     //                   )}
//     //                   <div className="d-flex justify-content-center align-items-center mt-3">
//     //                     <button
//     //                       onClick={isRecording ? stopRecording : startRecording}
//     //                       className={`btn ${
//     //                         isRecording ? "btn-danger" : "btn-success"
//     //                       } btn-lg`}
//     //                       disabled={isDisabled}
//     //                     >
//     //                       {isRecording ? (
//     //                         <span className="d-flex align-items-center">
//     //                           <FaStop />
//     //                           <span className="mx-2">
//     //                             Stop {formatTime(timer)}
//     //                           </span>
//     //                         </span>
//     //                       ) : (
//     //                         <span className="d-flex align-items-center">
//     //                           <FaMicrophone />
//     //                           <span className="mx-2">Start Recording</span>
//     //                         </span>
//     //                       )}
//     //                     </button>
//     //                   </div>
//     //                 </Card.Body>
//     //               </Card>
//     //             </Col>
//     //           </Row>
//     //         </Container>

//     //         {loading && (
//     //           <div className="d-flex justify-content-center align-items-center m-3">
//     //             <div className="spinner-border text-primary" role="status">
//     //               <span className="visually-hidden">Loading...</span>
//     //             </div>
//     //           </div>
//     //         )}

//     //         {conversations?.length !== 0 && (
//     //           <div className="container mt-4">
//     //             <div className="card">
//     //               <div className="card-header">
//     //                 <h2 className="card-title">Conversations</h2>
//     //               </div>
//     //               <ul className="list-group list-group-flush">
//     //                 <li className="list-group-item">
//     //                   {conversations.map((conv, index) => (
//     //                     <>
//     //                       {conv.Doctor ? (
//     //                         <div key={index} className="my-3">
//     //                           <span
//     //                             className={`badge custom-primary me-2`}
//     //                             // style={{ backgroundColor: "#ff8989" }}
//     //                           >
//     //                             {"Doctor"}
//     //                           </span>
//     //                           <span className="text">{conv?.Doctor}</span>
//     //                         </div>
//     //                       ) : (
//     //                         <div key={index} className="my-3">
//     //                           <span
//     //                             className={`badge custom-secondary me-2`}
//     //                             // style={{ backgroundColor: "#cbcbcb" }}
//     //                           >
//     //                             {"Patient"}
//     //                           </span>
//     //                           <span className="text">{conv?.Patient}</span>
//     //                         </div>
//     //                       )}
//     //                     </>
//     //                   ))}
//     //                 </li>
//     //               </ul>
//     //             </div>
//     //           </div>
//     //         )}
//     //         {ehrInfo.length !== 0 && (
//     //           <div className="container mt-4">
//     //             <div className="card">
//     //               <div className="card-header">
//     //                 <h3 className="card-title">Patient Information</h3>
//     //               </div>
//     //               <div className="card-body">
//     //                 <div className="row">
//     //                   <div className="col-md-6 my-3">
//     //                     <h5 className="card-subtitle mb-1 text-muted">
//     //                       Allergies
//     //                     </h5>
//     //                     <p className="card-text">
//     //                       {ehrInfo["Allergies"] || "N/A"}
//     //                     </p>
//     //                   </div>
//     //                   <div className="col-md-6 my-3">
//     //                     <h5 className="card-subtitle mb-1 text-muted">
//     //                       Current Medication
//     //                     </h5>
//     //                     <p className="card-text">
//     //                       {ehrInfo["Current Medication"] || "N/A"}
//     //                     </p>
//     //                   </div>
//     //                 </div>
//     //                 <div className="row">
//     //                   <div className="col-md-6 my-3">
//     //                     <h5 className="card-subtitle mb-1 text-muted">
//     //                       Diagnosis Codes
//     //                     </h5>
//     //                     <p className="card-text">
//     //                       {ehrInfo["Diagnosis Codes"] || "N/A"}
//     //                     </p>
//     //                   </div>
//     //                   <div className="col-md-6 my-3">
//     //                     <h5 className="card-subtitle mb-1 text-muted">
//     //                       Lab Test
//     //                     </h5>
//     //                     <p className="card-text">
//     //                       {ehrInfo["Lab Tests"] || "N/A"}
//     //                     </p>
//     //                   </div>
//     //                 </div>
//     //                 <div className="row">
//     //                   <div className="col-md-6 my-3">
//     //                     <h5 className="card-subtitle mb-1 text-muted">
//     //                       Next Appointment
//     //                     </h5>
//     //                     <p className="card-text">
//     //                       {ehrInfo["Next Appointment"] || "N/A"}
//     //                     </p>
//     //                   </div>
//     //                   <div className="col-md-6 my-3">
//     //                     <h5 className="card-subtitle mb-1 text-muted">
//     //                       Patient History
//     //                     </h5>
//     //                     <p className="card-text">
//     //                       {ehrInfo["Patient History"] || "N/A"}
//     //                     </p>
//     //                   </div>
//     //                 </div>
//     //                 <div className="row">
//     //                   <div className="col-md-6 my-3">
//     //                     <h5 className="card-subtitle mb-1 text-muted">
//     //                       Vitals
//     //                     </h5>
//     //                     <p className="card-text">
//     //                       {ehrInfo["Vitals"] || "N/A"}
//     //                     </p>
//     //                   </div>
//     //                   <div className="col-md-6 my-3">
//     //                     <h5 className="card-subtitle mb-1 text-muted">
//     //                       Symptoms
//     //                     </h5>
//     //                     <p className="card-text">
//     //                       {ehrInfo["Symptoms"] || "N/A"}
//     //                     </p>
//     //                   </div>
//     //                 </div>
//     //                 <div className="row">
//     //                   <div className="col-md-12 my-3">
//     //                     <h5 className="card-subtitle mb-1 text-muted">
//     //                       Summary
//     //                     </h5>
//     //                     <p className="card-text">
//     //                       {ehrInfo["Summary"] || "N/A"}
//     //                     </p>
//     //                   </div>
//     //                 </div>
//     //                 {/* <h5 className="mb-1" style={{ whiteSpace: "pre-wrap" }}>
//     //             {ehrInfo}
//     //           </h5> */}
//     //               </div>
//     //             </div>
//     //           </div>
//     //         )}
//     //       </div>
//     //     </div>
//     //   </div>
//     //   <Footer className="mt-auto" />
//     // </div>
//     <div className="d-flex flex-column min-vh-100">
//       <Header />

//       <section className="py-5">
//         <Container>
//           <Row className="justify-content-center">
//             <Col md={12}>
//               <Card className="w-100">
//                 <Card.Body className="w-100">
//                   <Card.Title className="fw-bold">Doctor</Card.Title>
//                   <Card.Text className="text-muted">
//                     Click the button to start recording
//                   </Card.Text>

//                   {transcript ? (
//                     <div className="mt-3">
//                       <div className="conversation-card" ref={chatBoxRef}>
//                         <div
//                           className={`conversation-placeholder d-flex align-items-center my-1 justify-content-center text-secondary`}
//                         >
//                           <span className="mx-2">
//                             <MdTranscribe />
//                           </span>
//                           Your transcribe will be shown here
//                         </div>

//                         {transcript && (
//                           <>
//                             <div
//                               className={`d-flex align-items-center my-4 justify-content-center`}
//                             >
//                               <div
//                               // className={`chat-message doctor`}
//                               // style={{
//                               //   backgroundColor: "#ff8989",
//                               // }}
//                               >
//                                 <span className="text-muted">{transcript}</span>
//                               </div>
//                             </div>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   ) : (
//                     <></>
//                   )}

//                   {displayConversation ? (
//                     <div className="mt-3">
//                       <div className="conversation-card" ref={chatBoxRef}>
//                         {/* <div
//                               className={`conversation-placeholder d-flex align-items-center my-1 justify-content-center text-secondary`}
//                             >
//                               <span className="mx-2">
//                                 <MdTranscribe />
//                               </span>
//                               Your transcribe will be shown here
//                             </div> */}

//                         {liveConversations?.map((conv, index) => (
//                           <>
//                             <div
//                               className={`d-flex align-items-center my-4 justify-content-${
//                                 conv.speaker_tag % 2 === 0 ? "end" : "start"
//                               }`}
//                             >
//                               {conv.speaker_tag % 2 !== 0 && (
//                                 <div
//                                   className="conversation-icon"
//                                   style={{ marginRight: "0.5rem" }}
//                                 >
//                                   <FaUserCircle />
//                                 </div>
//                               )}
//                               <div
//                                 className={`chat-message doctor`}
//                                 style={{
//                                   backgroundColor: "#ff8989",
//                                 }}
//                               >
//                                 <span className="conversation-speaker-tag">
//                                   Person {conv.speaker_tag}:{" "}
//                                 </span>
//                                 <span className="conversation-text">
//                                   {conv.transcript}
//                                 </span>
//                               </div>
//                               {conv.speaker_tag % 2 === 0 && (
//                                 <div
//                                   className="conversation-icon"
//                                   style={{ marginLeft: "0.5rem" }}
//                                 >
//                                   <FaUserCircle />
//                                 </div>
//                               )}
//                             </div>
//                           </>
//                         ))}
//                       </div>
//                     </div>
//                   ) : (
//                     <></>
//                   )}

//                   {audioURL && (
//                     <div className="d-flex justify-content-center align-items-center mt-3">
//                       <audio src={audioURL} controls className="w-100" />
//                       {/* <button
//                             onClick={downloadAudio}
//                             className="btn btn-primary btn-sm rounded-pill"
//                           >
//                             <span className="d-flex align-items-center">
//                               <MdDownload />
//                               <span className="mx-2">Download</span>
//                             </span>
//                           </button> */}
//                     </div>
//                   )}
//                   <div className="d-flex justify-content-center align-items-center mt-3">
//                     <button
//                       onClick={isRecording ? stopRecording : startRecording}
//                       className={`btn d-flex ${
//                         isRecording ? "btn-danger" : "btnSuccess"
//                       } btn-lg`}
//                       disabled={isDisabled}
//                     >
//                       {isRecording ? (
//                         <span className="d-flex align-items-center">
//                           <FaStop />
//                           <span className="mx-2">Stop {formatTime(timer)}</span>
//                         </span>
//                       ) : (
//                         <span className="d-flex align-items-center">
//                           <FaMicrophone />
//                           <span className="mx-2">Start Recording</span>
//                         </span>
//                       )}

//                       {loading && (
//                         <div
//                           className="spinner-border text-primary"
//                           role="status"
//                         >
//                           <span className="visually-hidden">Loading...</span>
//                         </div>
//                       )}
//                     </button>
//                   </div>
//                 </Card.Body>
//               </Card>

//               {conversations?.length !== 0 && (
//                 <div className="mt-5">
//                   <div className="card">
//                     <div className="card-header">
//                       <h2 className="card-title ">Conversations</h2>
//                     </div>
//                     <ul className="list-group list-group-flush">
//                       <li className="list-group-item">
//                         {conversations.map((conv, index) => (
//                           <>
//                             {conv.Doctor ? (
//                               <div key={index} className="my-3">
//                                 <span
//                                   className={`badge custom-primary me-2`}
//                                   // style={{ backgroundColor: "#ff8989" }}
//                                 >
//                                   {"Doctor"}
//                                 </span>
//                                 <span className="text">{conv?.Doctor}</span>
//                               </div>
//                             ) : (
//                               <div key={index} className="my-3">
//                                 <span
//                                   className={`badge custom-secondary me-2`}
//                                   // style={{ backgroundColor: "#cbcbcb" }}
//                                 >
//                                   {"Patient"}
//                                 </span>
//                                 <span className="text">{conv?.Patient}</span>
//                               </div>
//                             )}
//                           </>
//                         ))}
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//               )}
//               {ehrInfo.length !== 0 && (
//                 <div className="mt-5">
//                   <div className="card">
//                     <div className="card-header">
//                       <h3 className="card-title">Patient Information</h3>
//                     </div>
//                     <div className="card-body">
//                       <div className="row">
//                         <div className="col-md-6 my-3">
//                           <h5 className="card-subtitle mb-1 text-muted">
//                             Allergies
//                           </h5>
//                           <p className="card-text">
//                             {ehrInfo["Allergies"] || "N/A"}
//                           </p>
//                         </div>
//                         <div className="col-md-6 my-3">
//                           <h5 className="card-subtitle mb-1 text-muted">
//                             Current Medication
//                           </h5>
//                           <p className="card-text">
//                             {ehrInfo["Current Medication"] || "N/A"}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="row">
//                         <div className="col-md-6 my-3">
//                           <h5 className="card-subtitle mb-1 text-muted">
//                             Diagnosis Codes
//                           </h5>
//                           <p className="card-text">
//                             {ehrInfo["Diagnosis Codes"] || "N/A"}
//                           </p>
//                         </div>
//                         <div className="col-md-6 my-3">
//                           <h5 className="card-subtitle mb-1 text-muted">
//                             Lab Test
//                           </h5>
//                           <p className="card-text">
//                             {ehrInfo["Lab Tests"] || "N/A"}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="row">
//                         <div className="col-md-6 my-3">
//                           <h5 className="card-subtitle mb-1 text-muted">
//                             Next Appointment
//                           </h5>
//                           <p className="card-text">
//                             {ehrInfo["Next Appointment"] || "N/A"}
//                           </p>
//                         </div>
//                         <div className="col-md-6 my-3">
//                           <h5 className="card-subtitle mb-1 text-muted">
//                             Patient History
//                           </h5>
//                           <p className="card-text">
//                             {ehrInfo["Patient History"] || "N/A"}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="row">
//                         <div className="col-md-6 my-3">
//                           <h5 className="card-subtitle mb-1 text-muted">
//                             Vitals
//                           </h5>
//                           <p className="card-text">
//                             {ehrInfo["Vitals"] || "N/A"}
//                           </p>
//                         </div>
//                         <div className="col-md-6 my-3">
//                           <h5 className="card-subtitle mb-1 text-muted">
//                             Symptoms
//                           </h5>
//                           <p className="card-text">
//                             {ehrInfo["Symptoms"] || "N/A"}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="row">
//                         <div className="col-md-12 my-3">
//                           <h5 className="card-subtitle mb-1 text-muted">
//                             Summary
//                           </h5>
//                           <p className="card-text">
//                             {ehrInfo["Summary"] || "N/A"}
//                           </p>
//                         </div>
//                       </div>
//                       {/* <h5 className="mb-1" style={{ whiteSpace: "pre-wrap" }}>
//                       {ehrInfo}
//                     </h5> */}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </Col>
//           </Row>
//         </Container>
//       </section>

//       <Footer className="mt-auto" />
//     </div>
//   );
// };

// export default AudioOld2;

import React, { useState, useRef, useEffect } from "react";
import { MediaRecorder } from "extendable-media-recorder";
import { FaMicrophone, FaStop, FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { Card, Col, Container, Image, Row } from "react-bootstrap";
import { MdDownload, MdTranscribe } from "react-icons/md";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "../styles/AudioRecorder.css";
import Footer from "./Footer";
import Header from "./Header";

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const AudioOld2 = ({ patient_name, dob }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [conversations, setConversations] = useState([]);
  const chatBoxRef = useRef(null);
  const [liveConversations, setLiveConversations] = useState([]);
  const [audios, setAudios] = useState([]);

  const [transcript, setTranscript] = useState("");

  const audioFullRef = useRef([]);

  const [displayConversation, setDisplayConversation] = useState(false);

  const [ehrInfo, setEhrInfo] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state?.userInfo?.user);

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
    setTranscript("");
    setAudioURL("");
    setAudioBlob(null);
    setDisplayConversation(false);

    setIsRecording(true);
    audioBufferRef.current = [];

    setIsDisabled(true);

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
            // sendToBackend(createWavBlob(audioBufferRef.current));
            sendToBackend(createWavBlob(audioFullRef.current));
            audioBufferRef.current = [];
          }
        }, chunkInterval);

        setTimeout(() => setIsDisabled(false), 2500);
        timerRef.current = setInterval(() => {
          setTimer((prevTime) => prevTime + 1);
        }, 1000);
      })
      .catch((err) => {
        console.error("Error accessing the microphone", err);
        alert("Failed to access microphone. Please check your browser settings and permissions.");
        setIsDisabled(false);
        setIsRecording(false);
      });
  };

  const stopRecording = async () => {
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
    if (audioBufferRef.current.length > 0) {
      // sendToBackend(createWavBlob(audioBufferRef.current));
      // sendToBackend(createWavBlob(audioFullRef.current));
    }

    const blob = createWavBlob(audioFullRef.current);
    const audioURL = window.URL.createObjectURL(blob);
    setAudioURL(audioURL);
    setAudioBlob(blob);

    setIsDisabled(true);
    setLoading(true);

    setTimer(0);
    clearInterval(timerRef.current);

    await sendAudioDataFull();

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
      setTranscript(result?.transcript);
      setConversations(result?.refined_transcript?.conversation);
      setEhrInfo(result?.ehr_info);

      setDisplayConversation(true);

      sendAudioDataToBackend(blob, result);
    } catch (error) {
      console.error("Error uploading audio:", error);
      // toast.error(error?.message || "Error uploading audio:");
    } finally {
      setIsDisabled(false);
      setLoading(false);
    }

    audioBufferRef.current = [];
    audioFullRef.current = [];
    clearInterval(timerRef.current);
  };

  const processAudioData = (audioData) => {
    audioBufferRef.current.push(new Float32Array(audioData));
    audioFullRef.current = [...audioFullRef.current, new Float32Array(audioData)];
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

  const sendToBackend = async (blob) => {
    const formData = new FormData();
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
  };

  const sendAudioDataFull = async () => {
    if (audioFullRef.current.length > 0) {
      const formData = new FormData();

      formData.append("file", createWavBlob(audioFullRef.current), "recording.wav");

      try {
        const response = await axios.post(
          //"https://us2.sourcesoftsolutions.com:8032/transcribe",
          "https://us2.sourcesoftsolutions.com:8032/rivatranscribe",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const result = response?.data;

        if (result?.speaker_transcripts) {
          setLiveConversations(result?.speaker_transcripts);
        }

        console.log(result);
      } catch (error) {
        console.error("Error uploading audio:", error);
      }
    } else {
      // console.log("abcdef");
    }
  };

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
    formData.append("user_id", user?.id);
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
    <div className="d-flex flex-column min-vh-100">
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

                  {displayConversation ? (
                    <div className="mt-3">
                      <div className="conversation-card" ref={chatBoxRef}>
                        {/* <div
                              className={`conversation-placeholder d-flex align-items-center my-1 justify-content-center text-secondary`}
                            >
                              <span className="mx-2">
                                <MdTranscribe />
                              </span>
                              Your transcribe will be shown here
                            </div> */}

                        {liveConversations?.map((conv, index) => (
                          <>
                            <div
                              className={`d-flex align-items-center my-4 justify-content-${
                                conv.speaker_tag % 2 === 0 ? "end" : "start"
                              }`}
                            >
                              {conv.speaker_tag % 2 !== 0 && (
                                <div
                                  className="conversation-icon"
                                  style={{ marginRight: "0.5rem" }}
                                >
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
                          <FaMicrophone />
                          <span className="mx-2">Start Recording</span>
                        </span>
                      )}

                      {loading && (
                        <div className="spinner-border text-primary" role="status">
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
              {ehrInfo.length !== 0 && (
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
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default AudioOld2;
