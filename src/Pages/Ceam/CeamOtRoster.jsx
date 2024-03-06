import React, { useEffect, useState } from "react";
import {
  SlButton,
  SlDialog,
  SlSelect,
  SlInput,
  SlOption,
} from "@shoelace-style/shoelace/dist/react/index.js";
import axios from "axios";
import * as xlsx from "xlsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import thirtyonedays from "./templates/31daysTemplate.xlsx";
import thirtydays from "./templates/30daysTemplate.xlsx";
import twentyeightdays from "./templates/28daysTemplate.xlsx";
import twentyninedays from "./templates/9daysTemplate.xlsx";
import MUIDataTable from "mui-datatables";
import { baseurl } from "../../api/apiConfig";
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";

function CeamOtRoster() {
  const [col, setCol] = useState();
  const [openUpSignleOt, setOpenUpSignleOt] = useState(false);
  const [openUploadPast, setOpenUploadPast] = useState(false);
  const [pastFile, setPastFile] = useState();
  const [rosterReportData, setRosterReportData] = useState({
    start_date: "",
    end_date: "",
    employee_id: localStorage.getItem("employee_id"),
  });
  const [openRosterReport, setOpenRosterReport] = useState(false);
  const [signleOtUpData, setSignleOtUpData] = useState({
    employee_id: "",
    date: "",
    month: "",
    year: "",
    plant: "",
    division: "",
    ot_type: "",
    updated_by: localStorage.getItem("employee_id"),
    manager_id: "57055",
  });
  const [plantList, setPlantList] = useState([]);
  const [otList, setOtList] = useState();
  const [divisionList, setDivisionList] = useState([]);
  const [selectMonth, setSelectMonth] = useState(false);
  const [openUploadOT, setOpenUploadOT] = useState(false);
  const [uploadOtDate, setUploadOtDate] = useState("2022-12");
  const [file, setFile] = useState();
  const [downMonth, setDownMonth] = useState("2022-02");
  const [href, setHref] = useState();

  const [month, setMonth] = useState(() => {
    const month_test = new Date().getMonth() + 1;
    return `${new Date().getFullYear()}-${
      month_test < 10 ? "0" + month_test : month_test
    }`;
  });
  const [rosterDataOT, setRosterDataOT] = useState([]);
  const [division, setDivision] = useState();
  const [plantName, setPlantName] = useState();
  let navigate = useNavigate();

  useEffect(() => {
    // getRoster()
    getRosterOT();
  }, [month]);
  useEffect(() => {
    getData();
  }, []);

  const CustomToolbar = ({ displayData }) => {
    return (
      <SlButton
        style={{ marginLeft: "20px" }}
        slot="footer"
        variant="primary"
        onClick={() => {
          setOpenUpSignleOt(true);
        }}
      >
        Update Single Reward
      </SlButton>
    );
  };
  const options = {
    tableBodyMaxHeight: "64vh",
    responsive: "standard",
    selectableRowsHideCheckboxes: true,
    customToolbar: CustomToolbar,
    rowsPerPage: 15,
  };

  function getData() {
    axios({
      method: "get",
      url: `${import.meta.env.VITE_API_URL}/mhere/get-plant`,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setPlantList(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
    axios({
      method: "get",
      url: `${import.meta.env.VITE_API_URL}/mhere/get-ot-type`,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setOtList(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function getDivision(item) {
    const data = {
      plant: item,
    };
    axios({
      method: "post",
      url: `${import.meta.env.VITE_API_URL}/mhere/get-division`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    })
      .then((res) => {
        setDivisionList(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function updateSignleOt() {
    axios({
      method: "post",
      url: `${import.meta.env.VITE_API_URL}/mhere/update-single-ot`,
      headers: {
        "Content-Type": "application/json",
      },
      data: signleOtUpData,
    })
      .then((res) => {
        console.log(res);
        setOpenUpSignleOt(false);
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
  function getRosterOT() {
    let arr = month.split("-");
    const data = {
      month: parseInt(arr[1]),
      year: parseInt(arr[0]),
    };

    axios({
      method: "post",
      url: `${import.meta.env.VITE_API_URL}/mhere/get-ot-roster`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    })
      .then((res) => {
        if (res.data.data.length) {
          const columns = Object.keys(res.data.data[0]);
          const statusIndex = columns.indexOf("status");
          const status = columns.splice(statusIndex, 1);
          columns.unshift(status[0]);
          const plantIndex = columns.indexOf("plant");

          const plant = columns.splice(plantIndex, 1);
          columns.unshift(plant[0]);
          const index = columns.indexOf("Employee Code");
          const empid = columns.splice(index, 1);
          columns.unshift(empid[0]);
          setCol(columns);
          setRosterDataOT(res.data.data);
        } else {
          setRosterDataOT([]);
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
        console.log(err);
      });
  }

  function onSubmitOT() {
    let arr = uploadOtDate.split("-");
    const uploadMonth = arr[1];
    const uploadYear = arr[0];
    const data = {
      month: uploadMonth,
      year: uploadYear,
      ot_roster_data: file,
      employee_id: localStorage.getItem("employee_id"),
      manager_id: "57055",
      plant: plantName,
      division: division,
    };
    console.log(data);
    axios({
      method: "post",
      url: `${import.meta.env.VITE_API_URL}/mhere/upload-ot-roster-bulk`,
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
        // alert(err.response.data.message)
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
        console.log(err);
      });
  }

  const readUploadFile = (e) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        console.log(json);
        setFile(json);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };
  const getDays = (year, month) => {
    let days = new Date(year, month, 0).getDate();
    if (days == 31) {
      setHref(thirtyonedays);
    } else if (days == 30) {
      setHref(thirtydays);
    } else if (days == 28) {
      setHref(twentyeightdays);
    } else if (days == 29) {
      setHref(twentyninedays);
    } else {
      alert("select correct");
    }
  };
  function sendPastDaysRoster() {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = xlsx.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = xlsx.utils.sheet_to_json(worksheet);
      const send_data = {
        roster_data: json,
        employee_id: localStorage.getItem("employee_id"),
      };
      console.log(send_data);
      axios({
        method: "post",
        url: `${import.meta.env.VITE_API_URL}/mhere/upload-ot-bulk-past-days`,
        headers: {
          "Content-Type": "application/json",
        },
        data: send_data,
      })
        .then((res) => {
          toast.success(res.data.message);
          setOpenUploadPast(false);
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          console.log(err);
        });
    };
    reader.readAsArrayBuffer(pastFile[0]);
  }
  function downloadRosterReport() {
    console.log(rosterReportData);
    axios({
      method: "post",
      url: `${
        import.meta.env.VITE_API_URL
      }/mhere/get-upload-ot-roster-bulk-report`,
      headers: {
        "Content-Type": "application/json",
      },
      data: rosterReportData,
    })
      .then((res) => {
        console.log(res);
        toast.success(res.data.message);
        if (res.data.data) {
          const wb = xlsx.utils.book_new();
          const ws = xlsx.utils.json_to_sheet(res.data.data);
          xlsx.utils.book_append_sheet(wb, ws, "Reward Roster Report");
          xlsx.writeFile(wb, "Ceam reward roster report.xlsx");
        }
        setOpenRosterReport(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        console.log(err);
      });
  }

  return (
    <div className="ceam-roster-main">
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
              getRosterOT();
            }}
          >
            Get Roster
          </SlButton>
        </div>
        <div className="ceam-main-buttons">
          <SlButton
            variant="neutral"
            onClick={() => {
              setOpenRosterReport(true);
            }}
          >
            Download Roster Report
          </SlButton>
          {JSON.parse(localStorage.getItem("module_access"))?.ot_approval ? (
            <SlButton
              variant="neutral"
              onClick={() => {
                navigate("/ot-roster-approve");
              }}
            >
              Approve
            </SlButton>
          ) : (
            ""
          )}

          {/*  <SlButton variant='primary' outline onClick={()=>{
        setSelectMonth(true)
      }}>
      Download Roster Template
      </SlButton> */}
          <SlButton
            variant="primary"
            outline
            onClick={() => {
              setOpenUploadOT(true);
            }}
          >
            Bulk Upload Reward Roster
          </SlButton>

          {JSON.parse(localStorage.getItem("module_access"))
            ?.back_day_roster_upload ? (
            <SlButton
              variant="primary"
              outline
              onClick={() => {
                setOpenUploadPast(true);
              }}
            >
              Upload Past 2 Days Roster
            </SlButton>
          ) : null}
        </div>
        {/*  <SlButton variant='primary' onClick={()=>{
        navigate("/")
      }}>
        Go Attendence Roster
      </SlButton> */}
      </div>
      <SlDialog
        label="Upload Roster Reward"
        open={openUploadOT}
        onSlRequestClose={() => setOpenUploadOT(false)}
      >
        <div className="file-input-dialog-main">
          <input
            onChange={(e) => {
              setUploadOtDate(e.target.value);
              console.log(e.target.value);
            }}
            className="month-picker-ceam ot-upload-month"
            type="month"
            value={uploadOtDate}
            name=""
            id=""
          />
          <SlSelect
            style={{ marginBottom: "15px" }}
            label="Plant"
            onSlChange={(e) => {
              setPlantName(e.target.value.split("_").join(" "));
              getDivision(e.target.value.split("_").join(" "));
            }}
          >
            {plantList?.map((item, i) => {
              return (
                <SlOption
                  key={`${i}plant`}
                  value={item.plant.split(" ").join("_")}
                >
                  {item.plant}
                </SlOption>
              );
            })}
          </SlSelect>
          <SlSelect
            style={{ marginBottom: "15px" }}
            label="Division"
            onSlChange={(e) => {
              setDivision(e.target.value.split("_").join(" "));
            }}
          >
            {divisionList?.map((item, i) => {
              return (
                <SlOption
                  key={`${i}divisionu`}
                  value={item.division.split(" ").join("_")}
                >
                  {item.division}
                </SlOption>
              );
            })}
          </SlSelect>
          <input
            className="custom-file-input"
            type="file"
            onChange={(e) => {
              readUploadFile(e);
            }}
          />
        </div>
        <SlButton
          slot="footer"
          style={{ marginRight: "15px" }}
          variant="success"
          onClick={() => {
            onSubmitOT();
            setOpenUploadOT(false);
          }}
        >
          Upload
        </SlButton>
        <SlButton
          slot="footer"
          variant="danger"
          onClick={() => {
            setOpenUploadOT(false);
          }}
        >
          Close
        </SlButton>
      </SlDialog>
      <div className="table-ceam report-table roster-table  ">
        {rosterDataOT ? (
          <MUIDataTable
            title="Reward Roster"
            data={rosterDataOT}
            columns={col}
            options={options}
          ></MUIDataTable>
        ) : (
          <p className="no-data">No Data Found For This Month</p>
        )}
      </div>
      <SlDialog
        label="Download Template"
        open={selectMonth}
        onSlRequestClose={() => setSelectMonth(false)}
      >
        <input
          onChange={(e) => {
            setDownMonth(e.target.value);
            console.log(e.target.value);
            let arr = e.target.value.split("-");
            console.log(arr);
            getDays(arr[0], arr[1]);
          }}
          className="month-picker-ceam-second"
          type="month"
          value={downMonth}
          name=""
          id=""
        />
        <p style={{ marginTop: "20px" }}>
          Allowed Values{" "}
          {otList?.map((item, i) => {
            return (
              <span key={`${i}ot`} style={{ fontWeight: "bold" }}>
                {item.shift_character},{" "}
              </span>
            );
          })}
        </p>
        <SlButton
          style={{ marginRight: "20px" }}
          slot="footer"
          variant="success"
        >
          <a href={href} download="template">
            Download Roster
          </a>
        </SlButton>
        <SlButton
          slot="footer"
          variant="danger"
          onClick={() => setSelectMonth(false)}
        >
          Close
        </SlButton>
      </SlDialog>
      <SlDialog
        label="Update/Add Single Reward"
        open={openUpSignleOt}
        onSlRequestClose={() => setOpenUpSignleOt(false)}
      >
        <div className="update-ot-single-main">
          <SlInput
            label="Employee Code"
            onSlChange={(e) => {
              setSignleOtUpData({
                ...signleOtUpData,
                employee_id: e.target.value,
              });
            }}
          />
          <SlInput
            type="date"
            label="Reward Date"
            placeholder="Date"
            onSlChange={(e) => {
              console.log(e.target.value);
              let arr = e.target.value.split("-");
              console.log(arr);
              setSignleOtUpData({
                ...signleOtUpData,
                year: arr[0],
                month: parseInt(arr[1]),
                date: parseInt(arr[2]),
              });
            }}
          />

          <FormControl>
            <InputLabel id="ot-label">Reward Type</InputLabel>
            <Select
              labelId="ot-label"
              label="Reward Type"
              onChange={(e) => {
                const selectedValue = e.target.value;
                setSignleOtUpData({
                  ...signleOtUpData,
                  ot_type: selectedValue.split("_").join(" "),
                });
              }}
            >
              <MenuItem value="">Remove</MenuItem>
              {otList?.map((item, i) => (
                <MenuItem
                  key={`${i}ot`}
                  value={item.shift_character.split(" ").join("_")}
                >
                  {item.shift_character}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel id="plant-label">Plant</InputLabel>
            <Select
              labelId="plant-label"
              label="Plant"
              onChange={(e) => {
                const selectedValue = e.target.value;
                setSignleOtUpData({
                  ...signleOtUpData,
                  plant: selectedValue.split("_").join(" "),
                });
                getDivision(selectedValue.split("_").join(" "));
              }}
            >
              {plantList?.map((item, i) => (
                <MenuItem
                  key={`${i}plant`}
                  value={item.plant.split(" ").join("_")}
                >
                  {item.plant}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel id="division-label">Division</InputLabel>
            <Select
              labelId="division-label"
              label="Division"
              onChange={(e) => {
                const selectedValue = e.target.value;
                setSignleOtUpData({
                  ...signleOtUpData,
                  division: selectedValue.split("_").join(" "),
                });
              }}
            >
              {divisionList?.map((item, i) => (
                <MenuItem
                  key={`${i}division`}
                  value={item.division.split(" ").join("_")}
                >
                  {item.division}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <SlButton
          style={{ marginRight: "15px" }}
          slot="footer"
          variant="success"
          onClick={() => {
            console.log(signleOtUpData);
            updateSignleOt();
          }}
        >
          Update
        </SlButton>
        <SlButton
          slot="footer"
          variant="primary"
          onClick={() => setOpenUpSignleOt(false)}
        >
          Close
        </SlButton>
      </SlDialog>
      <SlDialog
        label="Upload Past 2 Days Roster"
        open={openUploadPast}
        onSlRequestClose={() => setOpenUploadPast(false)}
      >
        <input
          style={{ marginBottom: "20px" }}
          label="Upload File"
          type="file"
          onChange={(e) => {
            setPastFile(e.target.files);
          }}
        />
        <SlButton
          slot="footer"
          variant="success"
          style={{ marginRight: "15px" }}
          onClick={() => sendPastDaysRoster()}
        >
          Upload
        </SlButton>
        <SlButton
          slot="footer"
          variant="primary"
          onClick={() => setOpenUploadPast(false)}
        >
          Close
        </SlButton>
      </SlDialog>
      <SlDialog
        label="Roster Report"
        open={openRosterReport}
        onSlRequestClose={() => setOpenRosterReport(false)}
      >
        <SlInput
          label="Start Date"
          type="date"
          style={{ marginBottom: "20px" }}
          onSlChange={(e) => {
            setRosterReportData({
              ...rosterReportData,
              start_date: e.target.value,
            });
            console.log(e.target.value);
          }}
        ></SlInput>
        <SlInput
          label="End Date"
          type="date"
          onSlChange={(e) => {
            setRosterReportData({
              ...rosterReportData,
              end_date: e.target.value,
            });
            console.log(e.target.value);
          }}
        ></SlInput>

        <SlButton
          slot="footer"
          variant="success"
          style={{ marginRight: "15px" }}
          onClick={() => downloadRosterReport()}
        >
          Download
        </SlButton>
        <SlButton
          slot="footer"
          variant="primary"
          onClick={() => setOpenRosterReport(false)}
        >
          Close
        </SlButton>
      </SlDialog>
    </div>
  );
}

export default CeamOtRoster;
