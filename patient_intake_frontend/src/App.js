import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";

import AudioTest2sec from "./components/AudioTest2sec";
import AudioTestGPT from "./components/AudioTestGPT";
import Audiotest2 from "./components/AudioTest2";
import AudioTest3 from "./components/AudioTest3";
import AudioOld2 from "./components/AudioOld2";
import DemoVideo from "./components/DemoVideo";
import AudioTest from "./components/AudioTest";

import Home from "./Pages/Home";
import About from "./Pages/About";
import Career from "./Pages/Career";
import Contact from "./Pages/Contact";
import Pricing from "./Pages/Pricing";
import Dashboard from "./Pages/Dashboard";
import UploadExcel from "./Pages/UploadExcel";
import PartnerWithSunoh from "./Pages/Partner";
import NewRecording from "./Pages/NewRecording";
import HowSunohWorks from "./Pages/HowSunohWorks";
import ChangePassword from "./Pages/Auth/ChangePassword";
import ConversationDashboard from "./Pages/ConversationDashboard";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import MainLayout from "./layouts/MainLayout";
import PrivateRoutes from "./auth/PrivateRoutes";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import AudioForMobile from "./Pages/AudioForMobile";
import PatientIntake from "./components/PatientIntake";
import AudioScreenMic from "./components/AudioScreenMic";
import MobileSuccessPage from "./Pages/MobileSuccessPage";
import TermsAndConditions from "./Pages/TermsAndConditions";

import PatientIntakeHistory from "./Pages/PatientIntakeHistory";
import PatientIntakeMobile from "./Pages/PatientIntakeMobile";

import { register } from "extendable-media-recorder";
import { connect } from "extendable-media-recorder-wav-encoder";
import ErrorLogs from "./Pages/ErrorLogs";
const registerEncoder = async () => {
  await register(await connect());
};
registerEncoder();

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
      />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="how-healthWeb-works" element={<HowSunohWorks />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/audio" element={<PrivateRoutes children={<Dashboard />} />} />

          <Route
            path="/new-recording/:patient_name/:dob"
            element={<PrivateRoutes children={<NewRecording />} />}
          />

          <Route path="/about/careers" element={<Career />} />

          <Route path="/about/partner-with-healthWeb" element={<PartnerWithSunoh />} />

          <Route
            path="/change-password"
            element={<PrivateRoutes children={<ChangePassword />} />}
          />

          <Route path="/error-logs" element={<PrivateRoutes children={<ErrorLogs />} />} />

          <Route
            path="/conversation-dashboard"
            element={<PrivateRoutes children={<ConversationDashboard />} />}
          />

          <Route path="/audio-test-full" element={<AudioTest />} />
          <Route path="/audio-test-pause" element={<Audiotest2 />} />
          <Route path="/audio-test-chunks" element={<AudioTest3 />} />
          <Route path="/audio-test-sec" element={<AudioTest2sec />} />
          <Route path="/audio-test-gpt" element={<AudioTestGPT />} />
          <Route path="/transcript" element={<PrivateRoutes children={<NewRecording />} />} />
          <Route path="/SMS-Service" element={<PrivateRoutes children={<UploadExcel />} />} />
          <Route path="/live-conversation" element={<AudioOld2 />} />
          <Route path="/demo-video" element={<DemoVideo />} />
          <Route
            path="/audio-mic-system"
            element={<PrivateRoutes children={<AudioScreenMic />} />}
          />
          <Route path="/patient-intake" element={<PrivateRoutes children={<PatientIntake />} />} />
          <Route
            path="/patient-intake-history"
            element={<PrivateRoutes children={<PatientIntakeHistory />} />}
          />

          <Route path="/terms-conditions" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Route>

        <Route path="/mobile-version/:id" element={<AudioForMobile />} />
        <Route path="/mobile-success" element={<MobileSuccessPage />} />
        <Route path="/mobile-patient-intake/:id" element={<PatientIntakeMobile />} />
      </Routes>
    </>
  );
}

export default App;
