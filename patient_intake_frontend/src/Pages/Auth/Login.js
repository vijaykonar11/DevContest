// import React, { useEffect } from "react";
// import { Modal, Box, Typography, TextField, Button, Link } from "@mui/material";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { useState } from "react";
// import ForgotPasswordModal from "./ForgotPassword";
// import { FaFacebook, FaGoogle } from "react-icons/fa";
// import { useGoogleLogin } from "@react-oauth/google";
// // // import FacebookLogin from "react-facebook-login";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   p: 4,
//   borderRadius: "8px",
// };

// const userData = JSON.parse(localStorage.getItem("userData"));

// function LoginModal({ open, onClose, onRegisterOpen }) {
//   const [email_id, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [user, setUser] = useState(null);

//   const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

//   const handleRegisterClick = () => {
//     onClose();
//     onRegisterOpen();
//   };

//   const handleForgotPasswordClick = () => {
//     onClose();
//     setForgotPasswordOpen(true);
//   };

//   const handleForgotPasswordClose = () => {
//     setForgotPasswordOpen(false);
//     onClose();
//   };

//   const googleLogin = useGoogleLogin({
//     onSuccess: (tokenResponse) => setUser(tokenResponse),
//   });

//   const fetchData = async () => {
//     try {
//       const userInfoRes = await axios.get(
//         `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${user.access_token}`,
//         {
//           headers: {
//             // Authorization: `Bearer ${user.access_token}`,
//             Accept: "application/json",
//           },
//         }
//       );

//       const obj = userInfoRes?.data;

//       console.log(obj);

//       const payload = {
//         // first_name: obj?.given_name,
//         // last_name: obj?.family_name,
//         // name: obj?.family_name
//         //   ? obj?.given_name + " " + obj?.family_name
//         //   : obj?.given_name,
//         first_name: obj?.given_name,
//         last_name: obj?.family_name,
//         email_id: obj?.email,
//         image: obj?.picture,
//         // GId: obj?.id,
//         method: "GOOGLE",
//       };
//       console.log(payload, "data");

//       const response = await axios.post(
//         `${process.env.REACT_APP_API}/sociallogin`,
//         payload,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response?.status) {
//         toast.success(response?.data?.message || "login Success");
//         // dispatch(SetUserData(response?.data));

//         localStorage.setItem("userData", JSON.stringify(response?.data));

//         onClose();
//       }
//     } catch (err) {
//       console.log(err);
//       toast.error(err.message || "Something went wrong");
//     }
//   };

//   useEffect(() => {
//     if (user) {
//       fetchData();
//     }
//   }, [user]);

//   const responseFacebook = async (response) => {
//     console.log(response, "facebook data");

//     const payload = {
//       first_name: response?.name || "",
//       last_name: "",
//       image: response?.picture?.data?.url || "",
//       email_id: response?.email || "",
//       access_token: response?.accessToken || "",
//       // SocialId: response?.id || "",
//       method: "FACEBOOK",
//     };

//     try {
//       const resp = await axios.post(
//         `${process.env.REACT_APP_API}/sociallogin`,
//         payload,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log(resp, "response from API");
//       if (resp) {
//         toast.success(resp?.message);
//         // dispatch(SetUserData(resp?.data));
//         localStorage.setItem("userData", JSON.stringify(resp?.data));

//         toast.success(resp?.data?.message);

//         onClose();
//         // const pageTokenResponse = await axios.get(
//         //   `https://graph.facebook.com/v12.0/me/accounts?access_token=${response.accessToken}`
//         // );
//         // const pageToken = pageTokenResponse?.data?.data[0]?.access_token;
//         // const pageID = pageTokenResponse?.data?.data[0]?.id;

//         // // if(pageToken) {

//         // try {
//         //   let respon;

//         //   respon = await allApi({
//         //     url:
//         //       `http://192.168.20.47:5000/extended_access_token?` +
//         //       `grant_type=fb_exchange_token` +
//         //       `&client_id=415692071070334` +
//         //       `&client_secret=95f68424a624c592147d94d28991ab4d` +
//         //       `&fb_exchange_token=${pageToken}`,
//         //     method: "GET",
//         //     headers: {
//         //       "Content-Type": "application/json",
//         //     },
//         //     formData: false,
//         //   });

//         //   // console.log(respon, "aarif");

//         //   if (respon) {
//         //     // console.log(respon?.access_token,"setFb_exchange_token")
//         //     const instagramBusinessAccountResponse = await axios.get(
//         //       `https://graph.facebook.com/${pageID}?fields=instagram_business_account&access_token=${respon?.access_token}`
//         //     );
//         //     const instagramBusinessAccountID =
//         //       instagramBusinessAccountResponse?.data?.instagram_business_account
//         //         ?.id;

//         //     const postData = {
//         //       user_id: resp?.data?._id,
//         //       page_id: pageID,
//         //       page_token: respon?.access_token,
//         //       page_data: pageTokenResponse?.data?.data,
//         //       access_token: response.accessToken,
//         //       instagram_business_account_id: instagramBusinessAccountID,
//         //     };

//         //     //  console.log(instagramBusinessAccountID,"instagramBusinessAccountIDinstagramBusinessAccountID")
//         //     const postResponse = await axios.put(
//         //       `${process.env.REACT_APP_API_BACKEND_URL}${apiURL.pagedetails}`,
//         //       postData,
//         //       {
//         //         headers: {
//         //           "Content-Type": "application/json",
//         //         },
//         //       }
//         //     );
//         //     console.log("POST API pageTokenResponse Response:", postResponse);
//         //   }
//         // } catch (error) {
//         //   console.error("Error while making API call:", error);
//         // }
//       }
//     } catch (error) {
//       console.error("Error while making API call:", error);
//       toast.error(error.message || "Something went wrong");
//     }

//     console.log(payload, "facebook payload");
//   };

//   const handleSubmit = async () => {
//     const payload = {
//       email_id: email_id,
//       password: password,
//     };

//     try {
//       const res = await axios.post(
//         `${process.env.REACT_APP_API}/Signin`,
//         payload,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (res?.data?.status == "true") {
//         toast.success(res?.data?.message);
//         localStorage.setItem("userData", JSON.stringify(res?.data));
//         onClose();
//       } else {
//         toast.error(res?.data?.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("Something went wrong");
//     }
//   };

//   return (
//     <>
//       <Modal open={open} onClose={onClose}>
//         <Box sx={style}>
//           <Typography variant="h6" component="h2" gutterBottom>
//             Login
//           </Typography>
//           <Typography variant="body1" gutterBottom>
//             Email
//           </Typography>
//           <TextField
//             label="Enter Email"
//             variant="outlined"
//             fullWidth
//             margin="normal"
//             value={email_id}
//             onChange={(e) => {
//               setEmail(e.target.value);
//             }}
//           />
//           <Typography variant="body1" gutterBottom>
//             Password
//           </Typography>
//           <TextField
//             label="Enter Password"
//             variant="outlined"
//             type="password"
//             fullWidth
//             margin="normal"
//             value={password}
//             onChange={(e) => {
//               setPassword(e.target.value);
//             }}
//           />
//           <Box mt={2} display="flex" justifyContent="space-between">
//             <Button variant="contained" color="secondary" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={() => {
//                 handleSubmit();
//               }}
//             >
//               Login
//             </Button>
//           </Box>
//           <Box mt={2} display="flex" justifyContent="space-between">
//             <Link href="#" variant="body2" onClick={handleForgotPasswordClick}>
//               Forgot Password?
//             </Link>
//             <Link href="#" variant="body2" onClick={handleRegisterClick}>
//               Register here
//             </Link>
//           </Box>
//           <div className="orWith my-4">
//             <span>or</span>
//           </div>
//           <div className="btn-container my-2">
//             <button className="btn-google" onClick={() => googleLogin()}>
//               <span>
//                 <FaGoogle />
//               </span>{" "}
//               Google
//             </button>
//             <div className="btn-facebook-cover">
//               {/* <FacebookLogin
//                 className="btn-facebook"
//                 appId="415692071070334"
//                 autoLoad={false}
//                 fields="id,name,email,picture"
//                 callback={responseFacebook}
//                 scope="pages_show_list,pages_read_engagement,pages_manage_posts,pages_manage_metadata,pages_read_user_content,business_management,instagram_basic,instagram_content_publish,email"
//                 cssClass="btn-facebook"
//                 icon={
//                   <span>
//                     <FaFacebook />{" "}
//                   </span>
//                 }
//                 textButton=" Facebook"
//               /> */}
//             </div>
//           </div>
//         </Box>
//       </Modal>

//       <ForgotPasswordModal
//         open={forgotPasswordOpen}
//         onClose={handleForgotPasswordClose}
//         onRegisterOpen={onRegisterOpen}
//       />
//     </>
//   );
// }

// export default LoginModal;

import React, { useEffect } from "react";
import { Box, Typography, TextField, Link } from "@mui/material";
import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import ForgotPasswordModal from "./ForgotPassword";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { useGoogleLogin } from "@react-oauth/google";
// // import FacebookLogin from "react-facebook-login";
import { useSelector, useDispatch } from "react-redux";
import { setUserDetails } from "../../features/user/UserSlice";
import { Button, Modal } from "react-bootstrap";
import { IoIosCheckmarkCircle } from "react-icons/io";
import GoogleLogo from "../../assets/google_logo.png";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

const userData = JSON.parse(localStorage.getItem("userData"));

function LoginModal({ open, onClose, onRegisterOpen, onLoginOpen }) {
  const [email_id, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [success, setSuccess] = useState("");
  const dispatch = useDispatch();

  const handleRegisterClick = () => {
    onClose();
    onRegisterOpen();
  };

  const handleForgotPasswordClick = () => {
    onClose();
    setForgotPasswordOpen(true);
  };

  const handleForgotPasswordClose = () => {
    setForgotPasswordOpen(false);
    onClose();
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => setUser(tokenResponse),
  });

  const fetchData = async () => {
    setGoogleLoading(true);
    try {
      const userInfoRes = await axios.get(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${user.access_token}`,
        {
          headers: {
            // Authorization: `Bearer ${user.access_token}`,
            Accept: "application/json",
          },
        }
      );

      const obj = userInfoRes?.data;

      const payload = {
        first_name: obj?.given_name,
        last_name: obj?.family_name,
        email_id: obj?.email,
        image: obj?.picture,
        method: "GOOGLE",
      };

      const response = await axios.post(`${process.env.REACT_APP_API}/sociallogin`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response?.status) {
        // toast.success(response?.data?.message || "login Success");
        localStorage.setItem("userData", JSON.stringify(response?.data));

        const { _id, first_name, last_name, email_id, image } = response?.data?.data;

        dispatch(
          setUserDetails({
            id: _id,
            first_name: first_name,
            last_name: last_name,
            email: email_id,
            image: image,
          })
        );
        // onClose();
        setSuccess(response?.data?.message);
        setTimeout(() => {
          onClose();
          setSuccess("");
          setError("");
        }, 1000);
      }
    } catch (err) {
      console.log(err);
      // toast.error(err.message || "Something went wrong");
    } finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const responseFacebook = async (response) => {
    console.log(response, "facebook data");

    const payload = {
      first_name: response?.name || "",
      last_name: "",
      image: response?.picture?.data?.url || "",
      email_id: response?.email || "",
      access_token: response?.accessToken || "",
      // SocialId: response?.id || "",
      method: "FACEBOOK",
    };

    try {
      const resp = await axios.post(`${process.env.REACT_APP_API}/sociallogin`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(resp, "response from API");
      if (resp) {
        // toast.success(resp?.message);
        // dispatch(SetUserData(resp?.data));
        localStorage.setItem("userData", JSON.stringify(resp?.data));

        const { _id, first_name, last_name, email_id, image } = response?.data?.data;

        dispatch(
          setUserDetails({
            id: _id,
            first_name: first_name,
            last_name: last_name,
            email: email_id,
            image: image,
          })
        );

        // toast.success(resp?.data?.message);
        setSuccess("");
        setError("");

        onClose();
        // const pageTokenResponse = await axios.get(
        //   `https://graph.facebook.com/v12.0/me/accounts?access_token=${response.accessToken}`
        // );
        // const pageToken = pageTokenResponse?.data?.data[0]?.access_token;
        // const pageID = pageTokenResponse?.data?.data[0]?.id;

        // // if(pageToken) {

        // try {
        //   let respon;

        //   respon = await allApi({
        //     url:
        //       `http://192.168.20.47:5000/extended_access_token?` +
        //       `grant_type=fb_exchange_token` +
        //       `&client_id=415692071070334` +
        //       `&client_secret=95f68424a624c592147d94d28991ab4d` +
        //       `&fb_exchange_token=${pageToken}`,
        //     method: "GET",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     formData: false,
        //   });

        //   // console.log(respon, "aarif");

        //   if (respon) {
        //     // console.log(respon?.access_token,"setFb_exchange_token")
        //     const instagramBusinessAccountResponse = await axios.get(
        //       `https://graph.facebook.com/${pageID}?fields=instagram_business_account&access_token=${respon?.access_token}`
        //     );
        //     const instagramBusinessAccountID =
        //       instagramBusinessAccountResponse?.data?.instagram_business_account
        //         ?.id;

        //     const postData = {
        //       user_id: resp?.data?._id,
        //       page_id: pageID,
        //       page_token: respon?.access_token,
        //       page_data: pageTokenResponse?.data?.data,
        //       access_token: response.accessToken,
        //       instagram_business_account_id: instagramBusinessAccountID,
        //     };

        //     //  console.log(instagramBusinessAccountID,"instagramBusinessAccountIDinstagramBusinessAccountID")
        //     const postResponse = await axios.put(
        //       `${process.env.REACT_APP_API_BACKEND_URL}${apiURL.pagedetails}`,
        //       postData,
        //       {
        //         headers: {
        //           "Content-Type": "application/json",
        //         },
        //       }
        //     );
        //     console.log("POST API pageTokenResponse Response:", postResponse);
        //   }
        // } catch (error) {
        //   console.error("Error while making API call:", error);
        // }
      }
    } catch (error) {
      console.error("Error while making API call:", error);
      // toast.error(error.message || "Something went wrong");
    }

    console.log(payload, "facebook payload");
  };

  const handleSubmit = async () => {
    const payload = {
      email_id: email_id,
      password: password,
    };

    setError(() => "");
    if (!email_id || !password) {
      setError("Please fill the required details");
      return;
    }

    if (password?.length < 8) {
      setError("Password must be greater than 8");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${process.env.REACT_APP_API}/Signin`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res?.data?.status == "true") {
        // toast.success(res?.data?.message);
        localStorage.setItem("userData", JSON.stringify(res?.data));
        const userData = JSON.parse(localStorage.getItem("userData"));

        const { _id, first_name, last_name, email_id, image } = res?.data?.data;

        dispatch(
          setUserDetails({
            id: _id,
            first_name: first_name,
            last_name: last_name,
            email: email_id,
            image: image,
          })
        );

        setSuccess(res?.data?.message);
        setTimeout(() => {
          onClose();
          setSuccess("");
          setError("");
        }, 1000);
      } else {
        // toast.error(res?.data?.message);
        setError(res?.data?.message);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) setError(error?.response?.data?.message);
      // toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        show={open}
        onHide={onClose}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Login</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Box>
            {success && (
              <div className="text-success small my-2">
                <IoIosCheckmarkCircle />
                {success}
              </div>
            )}
            <Typography variant="body1" gutterBottom>
              Email
            </Typography>
            <TextField
              label="Enter Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email_id}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <Typography variant="body1" gutterBottom>
              Password
            </Typography>
            <TextField
              label="Enter Password"
              variant="outlined"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            {error && <div className="text-danger small">{error}</div>}
            <Box mt={2} display="flex" justifyContent="space-between">
              <Button variant="outline-danger" onClick={onClose}>
                Cancel
              </Button>
              <button
                className="logoColorBtn px-3 rounded"
                onClick={() => {
                  handleSubmit();
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner-border spinner-border-sm text-light mx-3" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </Box>
            <Box mt={2} display="flex" justifyContent="space-between">
              <Link href="#" variant="body2" onClick={handleForgotPasswordClick}>
                Forgot Password?
              </Link>
              <Link href="#" variant="body2" onClick={handleRegisterClick}>
                Register here
              </Link>
            </Box>
            <div className="orWith my-4">
              <span>or</span>
            </div>
            <div className="btn-container my-2">
              <button
                className="btn btn-light d-flex justify-content-center align-items-center w-100 py-2 border rounded"
                onClick={() => googleLogin()}
                disabled={googleLoading}
              >
                {googleLoading ? (
                  <div className="spinner-border spinner-border-sm text-dark my-2" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  <>
                    <span className="me-2">
                      <img src={GoogleLogo} alt="G" width={"25px"} />
                    </span>{" "}
                    Google
                  </>
                )}
              </button>
              <div className="btn-facebook-cover">
                {/* <FacebookLogin
                className="btn-facebook"
                appId="415692071070334"
                autoLoad={false}
                fields="id,name,email,picture"
                callback={responseFacebook}
                scope="pages_show_list,pages_read_engagement,pages_manage_posts,pages_manage_metadata,pages_read_user_content,business_management,instagram_basic,instagram_content_publish,email"
                cssClass="btn-facebook"
                icon={
                  <span>
                  <FaFacebook />{" "}
                  </span>
                  }
                  textButton=" Facebook"
                  /> */}
              </div>
            </div>
          </Box>
        </Modal.Body>
      </Modal>

      <ForgotPasswordModal
        open={forgotPasswordOpen}
        onClose={handleForgotPasswordClose}
        onRegisterOpen={onRegisterOpen}
        onLoginOpen={onLoginOpen}
      />
    </>
  );
}

export default LoginModal;
