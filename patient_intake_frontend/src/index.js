import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, json } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { persistor, store } from "./App/Store";
import { PersistGate } from "redux-persist/integration/react";
import { VoiceClient } from "realtime-ai";
import { VoiceClientProvider } from "realtime-ai-react";

const user = localStorage.getItem("userData")
  ? JSON.parse(localStorage.getItem("userData"))?.data
  : { _id: "668500ca44dc630328ea7889" };
// console.log(user);

const voiceClient = new VoiceClient({
  // baseUrl: "http://192.168.20.89:8078",
  baseUrl: "http://216.81.248.13:8078",
  // baseUrl: "http://localhost:8078",
  // baseUrl: "https://crosstower.sourcesoftsolutions.com",
  enableMic: true,
  callbacks: {
    onConnected: () => {
      console.log("[CALLBACK] Connected");
    },
    onDisconnected: () => {
      console.log("[CALLBACK] Disconnected");
    },
    onTransportStateChanged: (state) => {
      console.log("[CALLBACK] State change:", state);
    },
    onBotConnected: () => {
      console.log("[CALLBACK] Bot connected");
    },
    onBotReady: () => {
      console.log("[CALLBACK] Bot ready");
    },
    onBotDisconnected: () => {
      console.log("[CALLBACK] Bot disconnected");
    },
    onBotStartedTalking: () => {
      console.log("[CALLBACK] Bot started talking");
    },
    onBotStoppedTalking: () => {
      console.log("[CALLBACK] Bot stopped talking");
    },
    onLocalStartedTalking: () => {
      console.log("[CALLBACK] Local started talking");
    },
    onLocalStoppedTalking: () => {
      console.log("[CALLBACK] Local stopped talking");
    },
    onJsonCompletion: (jsonString) => {
      console.log("[CALLBACK] JSON Completion: ", jsonString);
    },
    onMetrics: (data) => {
      console.log("[METRICS]:", data);
    },
    onUserTranscript: (data) => {
      console.log("[USER TRANSCRIPT]:", data);
    },
    onBotTranscript: (text) => {
      console.log("[BOT TRANSCRIPT]:", text);
    },
  },
  config: {
    llm: {
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content:
            "You are Jessica, an agent for a company called Source Infotech Health Services. Your job is to collect important information from the user before their doctor visit. You're talking to Arjun. You should address the user by their first name and be polite and professional. You're not a medical professional, so you shouldn't provide any advice. Keep your responses short. Your job is to collect information to give to a doctor. Don't make assumptions about what values to plug into functions. Ask for clarification if a user response is ambiguous. Start by introducing yourself. Then, ask the user to confirm their identity by telling you their birthday, including the year.",
        },
        {
          role: "system",
          content:
            "Next, thank the user for confirming their identity, then ask the user to list their current prescriptions. Each prescription needs to have a medication name and a dosage. Do not move to the next any unknown dosages.",
        },
        {
          role: "system",
          content:
            "Next, ask the user if they have any allergies. Once they have listed their allergies or confirmed they don't have any, movw to the next.",
        },
        {
          role: "system",
          content:
            "Finally, ask the user the reason for their doctor visit today. Once they answer, Say thank the user and end the conversation.",
        },
      ],
    },
    tts: {
      voice: "79a125e8-cd45-4c13-8a67-188112f4dd22",
    },
    user_id: user?._id,
  },

  // config: {
  //   llm: {
  //     model: "llama3-70b-8192",
  //     messages: [
  //       {
  //         role: "system",
  //         content:
  //           "You are Jessica, an agent for a company called Source Infotech Health Services. Your job is to collect important information from the user before their doctor visit. You're talking to Arjun. You should address the user by their first name and be polite and professional. You're not a medical professional, so you shouldn't provide any advice. Keep your responses short. Your job is to collect information to give to a doctor. Don't make assumptions about what values to plug into functions. Ask for clarification if a user response is ambiguous. Start by introducing yourself. Then, ask the user to confirm their identity by telling you their birthday, including the year.",
  //       },
  //       {
  //         role: "system",
  //         content:
  //           "Next, thank the user for confirming their identity, then ask the user to list their current prescriptions. Each prescription needs to have a medication name and a dosage. Do not move to the next any unknown dosages.",
  //       },
  //       {
  //         role: "system",
  //         content:
  //           "Next, ask the user if they have any allergies. Once they have listed their allergies or confirmed they don't have any, movw to the next.",
  //       },
  //       {
  //         role: "system",
  //         content:
  //           "Finally, ask the user the reason for their doctor visit today. Once they answer, Say thank the user and end the conversation.",
  //       },
  //       {
  //         role: "system",
  //         content:
  //           "Hint: When the user correctly provides the information, return it in a dictionary. For example:\n- After the date of birth: {'date of birth': 'YYYY-MM-DD'}\n- After the current prescription: {'prescription': 'list all the current medications'}\n- And do the same for allergies and reason for doctor visit.",
  //       },
  //     ],
  //   },
  //   tts: {
  //     voice: "79a125e8-cd45-4c13-8a67-188112f4dd22",
  //   },
  // },
  // config: {
  //   llm: {
  //     model: "llama3-70b-8192",
  //     messages: [
  //       {
  //         role: "system",
  //         content:
  //           "You are Jessica, an agent for a company called Source Infotech Health Services. Your job is to collect important information from the user before their doctor visit. You're talking to Arjun. You should address the user by their first name and be polite and professional. You're not a medical professional, so you shouldn't provide any advice. Keep your responses short. Your job is to collect information to give to a doctor. Don't make assumptions about what values to plug into functions. Ask for clarification if a user response is ambiguous. Start by introducing yourself. Then, ask the user to confirm their identity by telling you their birthday, including the year.",
  //       },
  //       {
  //         role: "system",
  //         content:
  //           "Next, thank the user for confirming their identity, then ask the user to list their current prescriptions. Each prescription needs to have a medication name and a dosage. Do not move to the next any unknown dosages.",
  //       },
  //       {
  //         role: "system",
  //         content:
  //           "Next, ask the user if they have any allergies. Once they have listed their allergies or confirmed they don't have any, movw to the next.",
  //       },
  //       {
  //         role: "system",
  //         content:
  //           "Finally, ask the user the reason for their doctor visit today. Once they answer, Say thank the user and end the conversation.",
  //       },
  //     ],
  //   },
  //   tts: {
  //     voice: "79a125e8-cd45-4c13-8a67-188112f4dd22",
  //   },
  // },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* <GoogleOAuthProvider clientId="513322071742-12kfv2386aq4ig2rj4789aajch0fhh60.apps.googleusercontent.com"> */}
        <GoogleOAuthProvider clientId="686404141659-q6ttfis7fcu6kf2p32tj1fptrga4vbbh.apps.googleusercontent.com">
          <BrowserRouter>
            <VoiceClientProvider voiceClient={voiceClient}>
              <App />
            </VoiceClientProvider>
          </BrowserRouter>
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
