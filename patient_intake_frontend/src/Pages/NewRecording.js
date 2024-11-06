import React from "react";
import { useParams } from "react-router-dom";
import AudioOld from "../components/AudioOld";
import { useDispatch, useSelector } from "react-redux";
import { toggleSysAudio } from "../features/user/UserSlice";
import AudioScreenMic from "../components/AudioScreenMic";
import { FaCog } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { Dropdown } from "react-bootstrap";

const NewRecording = () => {
  const { patient_name, dob } = useParams();
  const settings = useSelector((state) => state?.userInfo?.settings);

  const dispatch = useDispatch();
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <div
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      style={{
        position: "absolute",
        fontSize: "20px",
        cursor: "pointer",
        top: 20,
        right: "13%",
        zIndex: 2,
      }}
    >
      {children}
      <IoSettingsOutline />
    </div>
  ));

  return (
    <div className="py-4">
      <Dropdown>
        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" />
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => dispatch(toggleSysAudio())}>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="flexSwitchCheckChecked"
                checked={settings?.captureSysAudio}
                onChange={(e) => dispatch(toggleSysAudio())}
              />
              <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                Capture system audio
              </label>
            </div>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      {settings?.captureSysAudio ? (
        <AudioScreenMic patient_name={patient_name || "unknown"} dob={dob || "2023-01-02"} />
      ) : (
        <AudioOld patient_name={patient_name || "unknown"} dob={dob || "2023-01-02"} />
      )}
    </div>
  );
};

export default NewRecording;
