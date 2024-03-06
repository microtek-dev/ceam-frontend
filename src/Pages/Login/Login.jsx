import React, { useEffect } from "react";
import { useState } from "react";

import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseurl } from "../../api/apiConfig";
import { toast } from "react-toastify";

function Login() {
  let navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const submitLogin = () => {
    const data = loginData;
    console.log(data);
    axios({
      method: "post",
      url: `${import.meta.env.VITE_API_URL}/mhere/login`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    })
      .then(function (response) {
        console.log(response);
        localStorage.setItem("employee_id", response.data.new_e_code);
        localStorage.setItem("manager_id", response.data.reporting_manager_id);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("grade", response.data.grade);
        localStorage.setItem("band", response.data.band);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("department", response.data.department);
        localStorage.setItem("fullname", response.data.name_of_the_eployee);

        /*   const data = {
                module_name:"qr-app",
                employee_id: response.data.new_e_code
            }
            axios({
                method: 'post',
                url: `https://internal.microtek.tech:8443/v1/api/mhere/log-login`,
                headers: {
                  'Content-Type': 'application/json',
                },
                data,
              }) */
        const data = {
          employee_id: response.data.new_e_code,
        };
        axios({
          method: "post",
          url: `${baseurl.base_url}/mhere/get-employee-module-access`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          data,
        })
          .then((res) => {
            console.log(res);

            if (res.data.data?.ceam_management) {
              if (response.data.is_first_login) {
                setLoginData({ ...loginData, username: "", password: "" });
                window.location.href =
                  "https://internal.microtek.tech:8443/ess/forget-password";

                return;
              }
              localStorage.setItem(
                "module_access",
                JSON.stringify(res.data.data)
              );

              let data = {
                employee_id: response.data.new_e_code,
                module_name: "Ceam",
              };
              axios({
                method: "post",
                url: `${baseurl.base_url}/mhere/log-login`,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                data,
              });
              navigate("/home");
              window.location.reload();
            } else {
              alert("module access not allowed");
              document.getElementById("login-button").disabled = false;
            }
            //localStorage.setItem('module_access', JSON.stringify(res.data.data))
          })
          .catch((err) => {
            toast.error(err.response.data.message);
            document.getElementById("login-button").disabled = false;
            console.log(err);
          });
      })
      .catch(function (err) {
        toast.error(err.response.data.message);
        console.log(err);
        document.getElementById("login-button").disabled = false;
      });
  };

  return (
    <div className="logi-main">
      <div className="logi-main-left">
        <h3>CEAM</h3>
        <div className="logi-main-left-container">
          <form className="logi-main-left-inner">
            <div className="logi-main-left-header">
              <h3>Welcome Back TEAM !</h3>

              <p> Please enter your details</p>
            </div>
            <div className="logi-input-main">
              <div className="logi-input-inner">
                <label htmlFor="emp">Employee Id</label>
                <input
                  id="emp"
                  placeholder="Enter Your Employee Code"
                  value={loginData.username}
                  onChange={(e) => {
                    setLoginData({ ...loginData, username: e.target.value });
                  }}
                  type="text"
                />
              </div>
              <div className="logi-input-inner">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter Password"
                  onChange={(e) => {
                    setLoginData({ ...loginData, password: e.target.value });
                  }}
                />
              </div>
              <div className="logi-forget-link">
                <a
                  href="https://internal.microtek.tech:8443/ess/forget-password"
                  target="_blank"
                >
                  Change / Forgot Password?
                </a>
              </div>
            </div>
            <div className="logi-buttons-main">
              <button
                type="submit"
                id="login-button"
                onClick={(e) => {
                  console.log("submit");
                  document.getElementById("login-button").disabled = true;
                  e.preventDefault();
                  submitLogin();
                }}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="logi-main-right">
        <div className="logi-main-right-inner">
          {/*  <img src={microtek2} alt="" /> */}
        </div>
      </div>
    </div>
  );
}

export default Login;
