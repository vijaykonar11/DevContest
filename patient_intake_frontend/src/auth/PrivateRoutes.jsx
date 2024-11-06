import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { setModal } from "../features/modal/ModalSlice";

const PrivateRoutes = ({ children }) => {
  const user = useSelector((state) => state?.userInfo?.user);
  const dispatch = useDispatch();

  if (!user) {
    dispatch(setModal({ type: "login" }));
    return <Navigate to={"/"} replace />;
  }
  return children;
};

export default PrivateRoutes;
