// import React from "react";
// import {
//   MDBContainer,
//   MDBRow,
//   MDBCol,
//   MDBCard,
//   MDBCardHeader,
//   MDBCardBody,
//   MDBIcon,
//   MDBBtn,
//   MDBScrollbar,
//   MDBCardFooter,
//   MDBInputGroup,
// } from "mdb-react-ui-kit";

// import '../styles/Conversation.css'
// import Header from "../components/Header";
// import Footer from "../components/Footer";

// function ConversationDashboard() {
//   return (
//     <>
//     <Header />
//     <MDBContainer className="py-5">
//     <MDBRow className="d-flex justify-content-center">
//       <MDBCol md="8" lg="6" xl="4">
//         <MDBCard id="chat1" style={{ borderRadius: "15px" }}>
//           <MDBCardHeader
//             className="d-flex justify-content-between align-items-center p-3 bg-info text-white border-bottom-0"
//             style={{
//               borderTopLeftRadius: "15px",
//               borderTopRightRadius: "15px",
//             }}
//           >

//             <p className="mb-0 fw-bold">Conversations</p>

//           </MDBCardHeader>

//           <MDBCardBody>
//             <div className="d-flex flex-row justify-content-start mb-4">
//               <img
//                 // src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
//                 // alt="avatar 1"
//                 // style={{ width: "45px", height: "100%" }}
//               />
//               <div
//                 className="p-3 ms-3"
//                 style={{
//                   borderRadius: "15px",
//                   backgroundColor: "rgba(57, 192, 237,.2)",
//                 }}
//               >
//                 <p className="small mb-0">
//                   Hello and thank you for visiting MDBootstrap. Please click
//                   the video below.
//                 </p>
//               </div>
//             </div>

//             <div className="d-flex flex-row justify-content-end mb-4">
//               <div
//                 className="p-3 me-3 border"
//                 style={{ borderRadius: "15px", backgroundColor: "#fbfbfb" }}
//               >
//                 <p className="small mb-0">
//                   Thank you, I really like your product.
//                 </p>
//               </div>
//               {/* <img
//                 src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"
//                 alt="avatar 1"
//                 style={{ width: "45px", height: "100%" }}
//               /> */}
//             </div>

//             {/* <div className="d-flex flex-row justify-content-start mb-4">
//               <img
//                 src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
//                 alt="avatar 1"
//                 style={{ width: "45px", height: "100%" }}
//               />
//               <div className="ms-3" style={{ borderRadius: "15px" }}>
//                 <div className="bg-image">
//                   <img
//                     src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/screenshot1.webp"
//                     style={{ borderRadius: "15px" }}
//                     alt="video"
//                   />
//                   <a href="#!">
//                     <div className="mask"></div>
//                   </a>
//                 </div>
//               </div>
//             </div> */}

//             {/* <div className="d-flex flex-row justify-content-start mb-4">
//               <img
//                 src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
//                 alt="avatar 1"
//                 style={{ width: "45px", height: "100%" }}
//               />
//               <div
//                 className="p-3 ms-3"
//                 style={{
//                   borderRadius: "15px",
//                   backgroundColor: "rgba(57, 192, 237,.2)",
//                 }}
//               >
//                 <p className="small mb-0">...</p>
//               </div>
//             </div>

//             <MDBTextArea
//               className="form-outline"
//               label="Type your message"
//               id="textAreaExample"
//               rows={4}
//             /> */}
//           </MDBCardBody>
//         </MDBCard>
//       </MDBCol>
//     </MDBRow>
//   </MDBContainer>
//   <Footer/>
//   </>
// );
// }

// export default ConversationDashboard;

import React from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBBtn,
  MDBCardFooter,
  MDBInputGroup,
} from "mdb-react-ui-kit";

import "../styles/Conversation.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AudioRecorder from "../components/AudioRecorder";

function ConversationDashboard() {
  return (
    <>
      <MDBContainer className="py-5">
        <MDBRow className="d-flex justify-content-end" style={{ height: "100vh", width: "100%" }}>
          <MDBCol md="4" lg="3" xl="3" className="d-flex flex-column h-100">
            <AudioRecorder />
          </MDBCol>

          <MDBCol md="8" lg="6" xl="4" className="d-flex flex-column h-100">
            <MDBCard id="chat1" className="flex-grow-1" style={{ borderRadius: "15px" }}>
              <MDBCardHeader className="d-flex justify-content-between align-items-center p-3 bg-info text-white border-bottom-0">
                <p className="mb-0 fw-bold">Conversations</p>
              </MDBCardHeader>

              <MDBCardBody className="overflow-auto">
                <div className="message-row">
                  <div className="message-icon">
                    <i className="fas fa-user-doctor fa-2x"></i>
                  </div>
                  <div className="message-content doctor">
                    <p className="small mb-0">
                      Hello and thank you for visiting Speech to Text project.
                    </p>
                  </div>
                </div>

                <div className="message-row justify-content-end">
                  <div className="message-content patient">
                    <p className="small mb-0">Thank you, I really like your product.</p>
                  </div>
                  <div className="message-icon">
                    <i className="fas fa-user fa-2x"></i>
                  </div>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  );
}

export default ConversationDashboard;
