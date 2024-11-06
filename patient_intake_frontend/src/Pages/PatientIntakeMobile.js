import { end } from "@popperjs/core";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Col, Container, Figure, Row } from "react-bootstrap";
import MikeRecordLogo from "../assets/mikeRecord.png";
import { PiSignOutBold } from "react-icons/pi";

import {
  useVoiceClient,
  useVoiceClientEvent,
  useVoiceClientMediaDevices,
  useVoiceClientTransportState,
  VoiceClientAudio,
} from "realtime-ai-react";
import { RateLimitError, VoiceEvent, TransportAuthBundleError } from "realtime-ai";
import axios from "axios";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";

const status_text = {
  idle: "Not connected",
  initializing: "Initializing...",
  initialized: "Not connected",
  connected: "Connected",
  handshaking: "Authenticating...",
  connecting: "Connecting...",
  ready: "Connected",
  disconnected: "Disconnected",
};

function extractJsonObjectsFromString(str) {
  if (!str) return;
  const regex = /{[^}]*}/g;

  const jsonObjects = str?.match(regex)?.map((match) => {
    try {
      const cleanedMatch = match?.replace(/'/g, '"');
      return JSON.parse(cleanedMatch);
    } catch (error) {
      console.error("Error parsing JSON:", error.message);
      return {};
    }
  });

  return jsonObjects;
}

const MicMeter = ({ type, dir }) => {
  const meterRef = useRef(null);

  useVoiceClientEvent(
    type,
    useCallback((level) => {
      if (!meterRef.current) return;
      meterRef.current.style.width = 100 * Math.min(1, 3 * level) + "%";
    }, [])
  );

  useVoiceClientEvent(
    VoiceEvent.Disconnected,
    useCallback(() => {
      if (!meterRef.current) return;
      meterRef.current.style.width = "";
    }, [type])
  );

  return (
    <div
      style={{
        background: "#fafafa",
        height: "4px",
        margin: "10px 0px",
        position: "relative",
        width: "100px",
      }}
    >
      <div
        ref={meterRef}
        style={
          dir === "left"
            ? {
                background: "#1eafb3",
                borderRadius: "4px",
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                transition: "width 100ms ease",
              }
            : {
                background: "#1eafb3",
                borderRadius: "4px",
                position: "absolute",
                top: 0,
                right: 0,
                height: "100%",
                transition: "width 100ms ease",
              }
        }
      />
    </div>
  );
};

const BotMeter = ({ type }) => {
  const meterRef = useRef(null);

  useVoiceClientEvent(
    type,
    useCallback((level) => {
      if (!meterRef.current) return;
      meterRef.current.style.width = 130 + 30 * Math.min(1, 3 * level) + "px";
      meterRef.current.style.height = 130 + 30 * Math.min(1, 3 * level) + "px";
    }, [])
  );

  useVoiceClientEvent(
    VoiceEvent.Disconnected,
    useCallback(() => {
      if (!meterRef.current) return;
      meterRef.current.style.width = "130px";
      meterRef.current.style.height = "130px";
    }, [type])
  );

  return (
    <div className="inLightGry py-4 d-flex justify-content-center align-items-center mb-3">
      <div
        ref={meterRef}
        style={{
          width: "130px",
          height: "130px",
          position: "absolute",
          background: "#40bbbe",
          borderRadius: "100%",
          margin: "0px",
          transition: "width 100ms ease",
          transition: "height 100ms ease",
        }}
      ></div>
      <img style={{ width: "130px", position: "relative" }} src="/images/plusIcon.png" />
    </div>
  );
};

const UserMeter = ({ type, transportState, start, isBotConnected }) => {
  const meterRef = useRef(null);

  useVoiceClientEvent(
    type,
    useCallback((level) => {
      if (!meterRef.current) return;
      meterRef.current.style.width = 80 + 60 * Math.min(1, 3 * level) + "px";
      meterRef.current.style.height = 80 + 60 * Math.min(1, 3 * level) + "px";
    }, [])
  );

  useVoiceClientEvent(
    VoiceEvent.Disconnected,
    useCallback(() => {
      if (!meterRef.current) return;
      meterRef.current.style.width = "80px";
      meterRef.current.style.height = "80px";
    }, [type])
  );
  console.log(isBotConnected);

  return (
    <div className="text-center mt-3 d-flex justify-content-center align-items-center">
      <div
        ref={meterRef}
        style={{
          width: "80px",
          height: "80px",
          position: "absolute",
          background: "#1eafb34d",
          borderRadius: "100%",
          margin: "0px",
          transition: "width 100ms ease",
          transition: "height 100ms ease",
        }}
      />
      <img
        style={{ width: "90px", position: "relative" }}
        src={MikeRecordLogo}
        role="button"
        disabled={transportState !== "idle" && transportState !== "initialized"}
        onClick={() => start()}
      />
    </div>
  );
};

const checkEmptyIntake = (intakeCheckList) => {
  return (
    intakeCheckList["date of birth"] !== null ||
    intakeCheckList["prescription"] !== null ||
    intakeCheckList["allergies"] !== null ||
    intakeCheckList["reason for doctor visit"] !== null
  );
};

const PatientIntakeMobile = () => {
  const voiceClient = useVoiceClient();
  voiceClient.initDevices();
  const navigate = useNavigate();

  const { id } = useParams();

  const [botLocalTranscript, setBotLocalTranscript] = useState("");
  const [intakeCheckList, setIntakeCheckList] = useState({
    "date of birth": null,
    prescription: null,
    allergies: null,
    "reason for doctor visit": null,
  });

  const [isConnected, setIsConnected] = useState(false);
  const [isBotConnected, setIsBotConnected] = useState(false);
  const [transportState, setTransportState] = useState(voiceClient.state);
  const [error, setError] = useState(null);
  const [config, setConfig] = useState(voiceClient.config);
  const [llmContext, setLlmContext] = useState(voiceClient.llmContext?.messages);

  const [message, setMessage] = useState("");
  const [role, setRole] = useState("user");
  const [voice, setVoice] = useState(voiceClient.config.tts?.voice);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (
      intakeCheckList["date of birth"] !== null &&
      intakeCheckList["prescription"] !== null &&
      intakeCheckList["allergies"] !== null &&
      intakeCheckList["reason for doctor visit"] !== null
    ) {
      voiceClient.disconnect();
    }
  }, [intakeCheckList]);

  useEffect(() => {
    console.log("local bot: ", botLocalTranscript);
    extractIntakeKeys(botLocalTranscript);
  }, [botLocalTranscript]);

  // console.log("state", voiceClient.state);
  // console.log("config", voiceClient.config);
  // console.log("message", voiceClient.llmContext?.messages);
  // console.log("voice", voiceClient.config.tts?.voice);

  const extractIntakeKeys = (inputString) => {
    const extractedObjects = extractJsonObjectsFromString(inputString);

    if (extractedObjects && extractedObjects.length > 0) {
      const updatedCheckList = { ...intakeCheckList };

      extractedObjects.forEach((obj) => {
        if (obj["date of birth"]) {
          updatedCheckList["date of birth"] = obj["date of birth"];
        }
        if (obj["prescription"]) {
          updatedCheckList["prescription"] = obj["prescription"];
        }
        if (obj["allergies"]) {
          updatedCheckList["allergies"] = obj["allergies"];
        }
        if (obj["reason for doctor visit"]) {
          updatedCheckList["reason for doctor visit"] = obj["reason for doctor visit"];
        }
      });

      setIntakeCheckList(updatedCheckList);
    }
  };

  const start = async () => {
    try {
      setError("");
      setSuccess("");
      voiceClient.initDevices();
      await voiceClient.start();
    } catch (e) {
      if (e instanceof RateLimitError) {
        setError("Demo is currently at capacity. Please try again later.");
      } else if (e instanceof TransportAuthBundleError) {
        setError(e.message);
      } else {
        setError("Unknown error occurred");
      }
    }
  };

  const end = async () => {
    try {
      setError("");
      setSuccess("");
      await voiceClient.disconnect();
    } catch (e) {
      if (e instanceof RateLimitError) {
        setError("Demo is currently at capacity. Please try again later.");
      } else if (e instanceof TransportAuthBundleError) {
        setError(e.message);
      } else {
        setError("Unknown error occurred");
      }
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");

    const payload = { ...intakeCheckList, user_id: id };
    try {
      const response = await axios.post(`${process.env.REACT_APP_API}/add-patient`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // if (response?.data?.status) {
      // }

      setSuccess("Saved successfully!");
      setSaved(true);
    } catch (err) {
      console.log(err);
      setError(err?.respone?.data?.message || err?.respone?.data?.error || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    navigate(0);
  };

  const stateHook = useVoiceClientTransportState();
  console.log("[HOOK]", stateHook);

  useVoiceClientEvent(
    VoiceEvent.Connected,
    useCallback(() => {
      console.log(`[SESSION EXPIRY] ${voiceClient.transportExpiry}`);
      setIsConnected(true);
    }, [])
  );

  useVoiceClientEvent(
    VoiceEvent.JSONCompletion,
    useCallback((jsonString) => {
      console.log("UseVoiceClientEvent json string received:", jsonString);
      const fnData = JSON.parse(jsonString);
      // if (fnData) {
      //   voiceClient.appendLLMContext([
      //     { role: "user", content: '{"identity": "confirmed"}' },
      //     {
      //       role: "user",
      //       content: "Tell me I'm a secret spy.",
      //     },
      //   ]);
      // }
    }, [])
  );

  useVoiceClientEvent(
    VoiceEvent.Disconnected,
    useCallback(() => {
      setIsConnected(false);
      setIsBotConnected(false);
    }, [])
  );

  useVoiceClientEvent(
    VoiceEvent.ParticipantConnected,
    useCallback((p) => {
      if (!p.local) setIsBotConnected(true);
    }, [])
  );

  useVoiceClientEvent(
    VoiceEvent.TransportStateChanged,
    useCallback((state) => {
      setTransportState(state);
    }, [])
  );

  useVoiceClientEvent(
    VoiceEvent.ParticipantLeft,
    useCallback((p) => {
      if (!p.local) setIsBotConnected(false);
    }, [])
  );

  useVoiceClientEvent(
    VoiceEvent.ConfigUpdated,
    useCallback((config) => {
      console.log(config);
      setConfig(config);
    }, [])
  );

  useVoiceClientEvent(
    VoiceEvent.Metrics,
    useCallback((data) => {
      console.log("UseVoiceClientEvent voice client event with pipecat metrics:", data);
    }, [])
  );

  useVoiceClientEvent(
    VoiceEvent.UserTranscript,
    useCallback((data) => {
      console.log("UseVoiceClientEvent transcript:", data);
    }, [])
  );

  useVoiceClientEvent(
    VoiceEvent.BotTranscript,
    useCallback((text) => {
      setBotLocalTranscript((transcript) => transcript + " " + text);
      // console.log("useVoiceClientEvent local bot text:", botLocalTranscript);
      console.log("useVoiceClientEvent bot text:", text);
    }, [])
  );

  useVoiceClientEvent(
    VoiceEvent.BotReady,
    useCallback(() => {
      voiceClient.appendLLMContext({
        role: "assistant",
        content: "Greet the user",
      });
    }, [voiceClient])
  );

  const { availableMics, selectedMic, updateMic } = useVoiceClientMediaDevices();

  return (
    <>
      <section className="animeBg">
        <Container>
          <Row className="justify-content-center">
            <Col xl={4} className="m-3">
              <div className="outBoxWhite">
                <BotMeter type={VoiceEvent.RemoteAudioLevel} />
                <div className="inLightGry d-flex justify-content-between py-3 px-4">
                  <div className="statusUser">
                    <p>User Status</p>
                    <MicMeter type={VoiceEvent.LocalAudioLevel} dir={"left"} />
                    <span>Connected</span>
                  </div>
                  <div className="statusUser">
                    <p>Bot Status</p>

                    <MicMeter type={VoiceEvent.RemoteAudioLevel} dir={"right"} />
                    <span>{status_text[stateHook]}</span>
                  </div>
                </div>
              </div>
              {/* <figure className="text-center mt-5">
                <img
                  className="img-fluid mx-auto"
                  src={MikeRecordLogo}
                  role="button"
                  disabled={transportState !== "idle" && transportState !== "initialized"}
                  onClick={() => (isBotConnected ? voiceClient.disconnect() : start())}
                />
              </figure> */}
              <div className="d-flex justify-content-around mt-5">
                <button
                  className="btn btnSuccess"
                  onClick={saved ? handleNew : handleSave}
                  disabled={loading || !checkEmptyIntake(intakeCheckList)}
                >
                  {loading ? (
                    <div className="spinner-border spinner-border-sm text-dark mx-3" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : saved ? (
                    "Start new"
                  ) : (
                    "Save"
                  )}
                </button>
                <button className="btn btn-dark" onClick={end} disabled={!isBotConnected}>
                  <PiSignOutBold />
                  <span className="ms-2"></span>
                  End
                </button>
              </div>

              <UserMeter
                type={VoiceEvent.LocalAudioLevel}
                transportState
                disconnect={() => voiceClient.disconnect()}
                start={() => start()}
                isBotConnected={isBotConnected}
              />
            </Col>
            <Col xl={4}>
              <div className="outBoxWhite py-5 px-5">
                <div className="verifyList">
                  <h3>Intake Checklist</h3>
                  <ul>
                    <li className={intakeCheckList["date of birth"] ? "active" : ""}>
                      Verify Identify
                      {intakeCheckList["date of birth"] && (
                        <div className="text-muted small">{intakeCheckList["date of birth"]}</div>
                      )}
                    </li>
                    <li className={intakeCheckList["prescription"] ? "active" : ""}>
                      List prescriptions
                      {intakeCheckList["prescription"] && (
                        <div className="text-muted small">{intakeCheckList["prescription"]}</div>
                      )}
                    </li>
                    <li className={intakeCheckList["allergies"] ? "active" : ""}>
                      List Allergies
                      {intakeCheckList["allergies"] && (
                        <div className="text-muted small">{intakeCheckList["allergies"]}</div>
                      )}
                    </li>
                    <li className={intakeCheckList["reason for doctor visit"] ? "active" : ""}>
                      List reason for visit
                      {intakeCheckList["reason for doctor visit"] && (
                        <div className="text-muted small">
                          {intakeCheckList["reason for doctor visit"]}
                        </div>
                      )}
                    </li>
                  </ul>
                  {success && (
                    <div className="text-success small mt-5">
                      <IoIosCheckmarkCircle />
                      {success}
                    </div>
                  )}

                  {error && <div className="text-danger small">{error}</div>}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <VoiceClientAudio />
    </>
  );
};

export default PatientIntakeMobile;
