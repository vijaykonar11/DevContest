import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { MdRecordVoiceOver } from "react-icons/md";

const MyRecordings = ({ info, loading, onSelectPatient }) => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const [patientInfo, setPatientInfo] = useState({
    patient_name: "",
    dob: "",
  });

  return (
    <div className="montserrat-top-text">
      <div className="d-flex justify-content-center">
        <button type="button" className="btn logoColorBtn mb-1 mt-1" onClick={handleShowModal}>
          <MdRecordVoiceOver /> New Conversation
        </button>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Patient Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="patientName" className="form-label">
                Patient Name
              </label>
              <input
                type="text"
                className="form-control"
                id="patientName"
                value={patientInfo.patient_name}
                onChange={(e) =>
                  setPatientInfo({
                    ...patientInfo,
                    patient_name: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-3">
              <label htmlFor="dateOfBirth" className="form-label">
                Date of Birth
              </label>
              <input
                type="date"
                className="form-control"
                id="dateOfBirth"
                value={patientInfo.dob}
                onChange={(e) => setPatientInfo({ ...patientInfo, dob: e.target.value })}
              />
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          {/* <Link to={`/new-recording/${patientInfo.patient_name}/${patientInfo.dob}`}> */}
          <Button
            as={Link}
            to={`/new-recording/${patientInfo.patient_name}/${patientInfo.dob}`}
            disabled={!(patientInfo.dob && patientInfo.patient_name)}
            variant="btn btnSuccess"
          >
            Save changes
          </Button>
          {/* </Link> */}
        </Modal.Footer>
      </Modal>
      <div
        style={{
          maxHeight: "65vh",
          overflowY: "scroll",
          scrollbarWidth: "thin",
        }}
      >
        <div className="p-3">
          {loading ? (
            <div className="d-flex justify-content-center m-2">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : info?.length === 0 ? (
            <div className="d-flex justify-content-center m-2">No record found</div>
          ) : (
            info?.map((record) => (
              <div
                className="patientCard"
                key={record?._id}
                onClick={() => onSelectPatient(record)}
              >
                <h4>Name: {record?.patient_name}</h4>
                <p>DOB/Age: {record?.dob}</p>
                <p>Date & Time of recording: {record?.created_at}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRecordings;
