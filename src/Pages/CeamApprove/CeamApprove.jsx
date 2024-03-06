import { SlButton } from "@shoelace-style/shoelace/dist/react/index";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { baseurl } from "../../api/apiConfig";
import { toast } from "react-toastify";

function CeamApprove() {
  const [month, setMonth] = useState("2022-12");
  const [rosterData, setRosterData] = useState();
  const [col, setCol] = useState();
  const [selectedCol, setSelectedCol] = useState([]);
  useEffect(() => {
    getRosterApproval();
  }, [month]);

  let navigate = useNavigate();

  const options = {
    tableBodyMaxHeight: "64vh",
    responsive: "standard",
    onRowSelectionChange: (
      currentRowsSelected,
      allRowsSelected,
      rowsSelected
    ) => {
      //  console.log(allRowsSelected);
      const arr = [];
      allRowsSelected.map((item) => {
        arr.push(item.dataIndex);
      });
      console.log(arr);
      setSelectedCol(arr);
    },
  };

  function sendApproval(status_data) {
    let approvalData = [];

    selectedCol.map((item) => {
      approvalData.push(rosterData[item].approval_id);
    });
    const data = {
      status: status_data,
      approval_remarks: "heelo",
      employee_id: localStorage.getItem("employee_id"),
      approval_id: approvalData,
    };
    console.log(data);
    axios({
      method: "post",
      url: `${import.meta.env.VITE_API_URL}/mhere/change-ststus-roster`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    })
      .then((res) => {
        console.log(res);
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "colored",
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "colored",
        });
      });
  }

  function getRosterApproval() {
    let arr = month.split("-");

    const data = {
      employee_id: localStorage.getItem("employee_id"),
      month: arr[1],
      year: arr[0],
    };

    axios({
      method: "post",
      url: `${import.meta.env.VITE_API_URL}/mhere/get-roster-approval`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    })
      .then((res) => {
        console.log(res);
        if (res.data.data.length) {
          setRosterData(res.data.data);
          const columns = Object.keys(res.data.data[0]);

          const statusIndex = columns.indexOf("status");
          const status = columns.splice(statusIndex, 1);
          const plantIndex = columns.indexOf("plant");

          const plant = columns.splice(plantIndex, 1);
          columns.unshift(plant[0]);
          const index = columns.indexOf("employee_id");
          const empid = columns.splice(index, 1);
          columns.unshift(empid[0]);
          setCol(columns);
        } else {
          setRosterData();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="ceam-roster-main">
      {/* <div className="ceam-roster-date-main">
        <input
        onChange={(e)=>{
            setMonth(e.target.value)
            console.log(e.target.value);
        }}
            className="month-picker-ceam"
            type="month"
            value={month}
            name=""
            id=""
        />
      
    </div> */}
      <div className="ceam-file-main">
        <div className="ceam-search-main">
          <input
            onChange={(e) => {
              setMonth(e.target.value);
              console.log(e.target.value);
            }}
            className="month-picker-ceam-second"
            type="month"
            value={month}
            name=""
            id=""
          />
          <SlButton
            variant="primary"
            onClick={() => {
              getRosterApproval();
            }}
          >
            Get Approval Roster
          </SlButton>
        </div>
        <div className="ceam-main-buttons">
          <SlButton
            variant="success"
            outline
            onClick={() => {
              sendApproval("approved");
              getRosterApproval();
            }}
          >
            Approve Selected
          </SlButton>
          <SlButton
            variant="danger"
            outline
            onClick={() => {
              sendApproval("rejected");
              getRosterApproval();
            }}
          >
            Reject Selected
          </SlButton>
          <SlButton
            variant="neutral"
            onClick={() => {
              navigate("/");
            }}
          >
            Back
          </SlButton>
        </div>
      </div>
      <div className="table-ceam">
        {rosterData ? (
          <MUIDataTable
            title="Shift Roster"
            data={rosterData}
            columns={col}
            options={options}
          ></MUIDataTable>
        ) : (
          <p className="no-data">No Data Found For This Month</p>
        )}
      </div>
    </div>
  );
}

export default CeamApprove;
