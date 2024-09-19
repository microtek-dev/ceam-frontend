import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
function Home() {
  let navigate = useNavigate();

  return (
    <div className="home-main">
      <div className="home-inner">
        <div
          onClick={() => {
            navigate("/");
          }}
        >
          Attendance Roster
        </div>
        <div
          onClick={() => {
            navigate("/ot-roster");
          }}
        >
          Reward Roster
        </div>
        <div
          onClick={() => {
            navigate("/view-attendance");
          }}
        >
          View Attendance
        </div>
        <div
          onClick={() => {
            navigate("/employee-master");
          }}
        >
          Employee Management
        </div>
        <div
          onClick={() => {
            navigate("/verify-employee");
          }}
          style={{ pointerEvents: "none" }}
        >
          Blacklist Verify
        </div>

        {/*  <div onClick={()=>{
                   navigate("/approve-manage")
                }}>Manage Approver</div>
            <div onClick={()=>{
                  navigate("/shift-master")
                }}>Shift Master</div>
            <div onClick={()=>{
                    navigate("/plant-manage")
                }}>Plant Master</div>
            <div onClick={()=>{
                  navigate("/vendor-master")
                }}>Vendor Master</div> */}
      </div>
    </div>
  );
}

export default Home;
