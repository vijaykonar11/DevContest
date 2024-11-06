import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const PatientIntakeHistory = () => {
  const [patientIntake, setPatientIntake] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const user = useSelector((state) => state?.userInfo?.user);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${process.env.REACT_APP_API}/get_patient/${user?.id}`);

        if (res?.data?.status === "false") {
          setLoading(false);
          return;
        }

        setPatientIntake(res?.data?.data);
      } catch (err) {
        setError(error?.message);
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    // patientIntake?.map((record) => (
    //   <div className="bg-light w-25 rounded p-3 m-2" key={record?._id}>
    //     <p>DOB: {record["date of birth"] || "Not provided"}</p>
    //     <p>Allergies: {record?.allergies || "Not provided"}</p>
    //     <p>Prescription: {record?.prescription || "Not Provided"}</p>
    //     <p>Reason for doctor visit: {record["reason for doctor visit"] || "Not provided"}</p>
    //     <p>Created At: {record?.created_at}</p>
    //   </div>
    // ))
    <div className="container mt-5">
      <h2 className="mb-4">Patient Intake Information</h2>
      <div className="row">
        {loading ? (
          <div className="d-flex justify-content-center m-2">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : patientIntake?.length === 0 ? (
          <div className="d-flex justify-content-center m-2">No record found</div>
        ) : (
          patientIntake.map((intake, index) => (
            <div className="col-md-6 mb-4" key={index}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Patient : {index + 1}</h5>
                  <p className="card-text">
                    <strong>Date of Birth:</strong> {intake["date of birth"] || "Not provided"}
                  </p>
                  <p className="card-text">
                    <strong>Allergies:</strong> {intake.allergies || "Not provided"}
                  </p>
                  <p className="card-text">
                    <strong>Prescriptions:</strong> {intake.prescription || "Not provided"}
                  </p>
                  <p className="card-text">
                    <strong>Reason for Visit:</strong>{" "}
                    {intake["reason for doctor visit"] || "Not provided"}
                  </p>
                  <p className="card-text text-muted">
                    <small>
                      <strong>Created At:</strong> {new Date(intake.created_at).toLocaleString()}
                    </small>
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientIntakeHistory;
