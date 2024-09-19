import "./App.css";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import CeamRoster from "./Pages/Ceam/CeamRoster";
import "@shoelace-style/shoelace/dist/themes/light.css";
import "@shoelace-style/shoelace/dist/components/icon/icon.js";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path";
import CeamOtRoster from "./Pages/Ceam/CeamOtRoster";
import Login from "./Pages/Login/Login";
import CeamApprove from "./Pages/CeamApprove/CeamApprove";
import CeamOtApprove from "./Pages/CeamApprove/CeamOtApprove";
import Navbar from "./Components/Navbar/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmployeeMaster from "./Pages/EmployeeMaster/EmployeeMaster";
import axios from "axios";
import { baseurl } from "./api/apiConfig";
import React from "react";
import ViewAttendance from "./Pages/ViewAttendance/ViewAttendance";
import VendorMaster from "./Pages/VendorMaster/VendorMaster";
import Home from "./Pages/Home/Home";
import BlacklistEmployee from "./Pages/BlacklistEmployee/BlacklistEmployee";
setBasePath(
  "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.86/dist/"
);
function App() {
  let navigate = useNavigate();
  React.useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = () => {
    if (!localStorage.getItem("token")) {
      return;
    }
    axios({
      method: "post",
      url: `${import.meta.env.VITE_API_URL}/mhere/verify-token`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(function (response) {
        // console.log(response.data)
      })
      .catch(function (err) {
        console.log(err);
        localStorage.clear();
        localStorage.removeItem("employee_id");
        localStorage.removeItem("token");
        localStorage.removeItem("fullname");
        localStorage.removeItem("email");
        navigate("/login");
      });
  };

  const Dashboard = () => (
    <div>
      <Navbar />
      <div>
        <Outlet />
      </div>
    </div>
  );
  const Auth = () => (
    <div>
      <Outlet />
    </div>
  );

  return (
    <>
      <Routes>
        <Route element={<Dashboard />}>
          <Route
            exact
            path="/"
            element={
              localStorage.getItem("token") ? (
                <CeamRoster />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          ></Route>
          <Route
            exact
            path="/home"
            element={
              localStorage.getItem("token") ? (
                <Home />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          ></Route>

          <Route
            exact
            path="/ot-roster"
            element={
              localStorage.getItem("token") ? (
                <CeamOtRoster />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          ></Route>
          <Route
            exact
            path="/roster-approve"
            element={
              localStorage.getItem("token") ? (
                <CeamApprove />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          ></Route>
          <Route
            exact
            path="/ot-roster-approve"
            element={
              localStorage.getItem("token") ? (
                <CeamOtApprove />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          ></Route>
          {/*   <Route   exact
          path="/plant-manage"
          element={
            localStorage.getItem('token') ? (
              <PlantManage />
            ) : (
              <Navigate replace to="/login" />
            )
          }>
        </Route> */}
          {/*  <Route   exact
          path="/approve-manage"
          element={
            localStorage.getItem('token') ? (
              <ManageApprovers />
            ) : (
              <Navigate replace to="/login" />
            )
          }>
        </Route> */}
          <Route
            exact
            path="/employee-master"
            element={
              localStorage.getItem("token") ? (
                <EmployeeMaster />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          ></Route>
          <Route
            exact
            path="/verify-employee"
            element={
              localStorage.getItem("token") ? (
                <BlacklistEmployee />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          ></Route>
          {/* <Route   exact
          path="/shift-master"
          element={
            localStorage.getItem('token') ? (
              <ShiftMaster />
            ) : (
              <Navigate replace to="/login" />
            )
          }>
        </Route> */}
          <Route
            exact
            path="/view-attendance"
            element={
              localStorage.getItem("token") ? (
                <ViewAttendance />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          ></Route>
          <Route
            exact
            path="/vendor-master"
            element={
              localStorage.getItem("token") ? (
                <VendorMaster />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          ></Route>
          {/*  <Route  exact
          path="/dept-master"
          element={
            localStorage.getItem('token') ? (
              <DeptMaster />
            ) : (
              <Navigate replace to="/login" />
            )
          }>
        </Route> */}
        </Route>
        <Route element={<Auth />}>
          <Route exact path="/login" element={<Login />}></Route>
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  );
}

export default App;
