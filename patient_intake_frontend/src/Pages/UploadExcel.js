import React, { useRef, useState } from "react";
import axios from "axios";
import { FaDownload, FaSquarePlus } from "react-icons/fa6";
import "../styles/UploadExcel.css";
import { MdOutlineFileUpload } from "react-icons/md";
import { IoIosCheckmarkCircle } from "react-icons/io";
import SampleFile from "../assets/data/SampleFile.xls";

const UploadExcel = () => {
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const [droping, setDroping] = useState(false);
  const [chosenFiles, setChosenFiles] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [files, setFiles] = useState([]);
  const [secretCode, setSecretCode] = useState("");

  const handleFileChange = (files) => {
    if (files.length > 1) {
      // toast.warn("Only one file allowed!");
      setError("Only one file allowed!");
      return;
    }
    // Convert the FileList to an array and filter out unsupported files
    const fileArray = Array.from(files).filter((file) => file.size < 12000000);

    // Map the filtered files to an array of file objects
    const fileObjects = fileArray.map((file) => ({
      _id: file.name,
      img: "https://icon-library.com/images/ms-excel-icon/ms-excel-icon-28.jpg",
      data: file,
      title: file.name,
      type: file.type,
      desc: `The filename is ${file.name}.This is a ${file.type} file.`,
    }));

    setChosenFiles(fileObjects);
    console.log("files", files);
    setFiles(files);
  };

  const removeSelectedFile = (index) => {
    setChosenFiles(chosenFiles.filter((_, i) => i !== index));
    setSuccess("");
    setError("");
  };

  const onDrop = (event) => {
    event.preventDefault();
    setDroping(false);
    handleFileChange(event.dataTransfer.files);
  };

  const onDragOver = (event) => {
    event.preventDefault();
    setDroping(true);
  };

  const onDragLeave = (event) => {
    event.preventDefault();
    setDroping(false);
  };

  const overlayRef = useRef(null);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      setModalOpen(false);
    }
  };

  const handleSendSms = async () => {
    setError("");
    if (secretCode !== process.env.REACT_APP_SECRET_CODE) {
      setError("Wrong secret code!");
      return;
    }
    if (!chosenFiles.length) {
      console.log("No file uploaded!");
      // toast.warn("Please upload file first");
      setError("Please upload file first");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", chosenFiles[0].data);

      const response = await axios.post(
        "https://us2.sourcesoftsolutions.com:8032/send_sms",
        // "http://192.168.20.89:5000/send_sms",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response?.result);
      setSuccess("Message has been Send!");

      setTimeout(() => setModalOpen(false), 1000);

      // toast.success("Message send successfully");
    } catch (err) {
      console.log(err);
      setError("Something went wrong Try again!");
      // toast.error(err?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column">
      <section className="smsServices">
        <h2 className="m-3">Upload Excel File</h2>

        <div className="adding-card card-dim" onClick={() => setModalOpen(true)}>
          <FaSquarePlus />
          <h6 className="m-0">Upload Excel File to send message</h6>
        </div>
        {modalOpen && (
          <div className="modal-overlay" ref={overlayRef} onClick={(e) => handleOverlayClick(e)}>
            <div className="modal-add">
              <div className="modal-header-container">
                <button onClick={() => setModalOpen(false)} className="close-button">
                  ×
                </button>
              </div>
              <div className="modal-body px-3 py-4">
                <div class="d-flex justify-content-between flex-wrap">
                  <h4>Upload Your files here</h4>
                  <a
                    href={SampleFile}
                    download="SampleFile_HealthWeb"
                    target="_blank"
                    rel="noreferrer"
                    className="me-3"
                  >
                    <span className="me-2">Sample File</span>
                    <FaDownload />
                  </a>
                </div>
                {success && (
                  <div className="text-success small my-2">
                    <IoIosCheckmarkCircle />
                    {success}
                  </div>
                )}
                {error && <div className="text-danger small">{error}</div>}
                <div className="file-uploader">
                  {chosenFiles.length === 0 ? (
                    <label
                      className={`file-upload-container ${droping ? "droping" : ""}`}
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                    >
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e.target.files)}
                        hidden
                        multiple
                      />
                      <div className="upload-icon">
                        <MdOutlineFileUpload />
                      </div>
                      <p>Drop your files here</p>
                    </label>
                  ) : (
                    <div className="file-preview-container">
                      {chosenFiles.map((file, index) => (
                        <div key={index} className="file-preview">
                          <img src={file.img} alt="preview" />
                          <button className="remove-file" onClick={() => removeSelectedFile(index)}>
                            ✕
                          </button>
                          <div className="file-name">{file.title}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <label htmlFor="secrete_code" className="me-2">
                  Code
                </label>
                <input
                  id="secrete_code"
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                />
                <div className="file-submit">
                  <button onClick={handleSendSms}>
                    {loading ? (
                      <div className="file-loading-bar">
                        <div className="d-flex justify-content-center align-items-center ">
                          <div
                            className="spinner-border spinner-border-sm text-light"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      "Send SMS"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default UploadExcel;
