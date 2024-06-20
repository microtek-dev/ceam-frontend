import {
  SlButton,
  SlDetails,
  SlDialog,
  SlInput,
  SlOption,
  SlSelect,
} from "@shoelace-style/shoelace/dist/react/index";
import "./ViewAttendance.css";
import React, { useRef, useState } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import { baseurl } from "../../api/apiConfig";
import { useEffect } from "react";
import { toast } from "react-toastify";
import * as xlsx from "xlsx";
function ViewAttendance() {
  useEffect(() => {
    getData();
    getCategory();
    getDeptList();
    getVendorlist();
  }, []);

  const muster = useRef(false);
  const trainingmuster = useRef(false);
  const card = useRef(false);
  /* MAx date states */
  const [searchMaxDate, setSearchMaxDate] = useState("");
  const [vendorList, setVendorList] = useState();
  const [divisionList, setDivisionList] = useState([]);

  const [plantList, setPlantList] = useState();
  const [deptList, setDeptList] = useState();
  const [categoryList, setCategoryList] = useState();
  const [openRegularizeDailog, setOpenRegularizeDailog] = useState(false);
  const [regularizeFile, setRegularizeFile] = useState();
  const initialState = {
    start_date: "",
    end_date: "",
    employee_id: "",
    category: "",
    gender: "",
    vendor: "",
    plant: "",
    division: "",
    department: "",
  };
  const [sendEmployeeData, setSendEmployeeData] = useState(initialState);
  const [employeeData, setEmployeeData] = useState();

  const [sendVendorData, setSendVendorData] = useState({
    start_date: "",
    end_date: "",
    vendor_code: "",
  });
  const [vendorData, setVendorData] = useState();
  const [sendPlantData, setSendPlantData] = useState({
    start_date: "",
    end_date: "",
    plant_name: "",
  });
  const [plantData, setPlantData] = useState();
  const EmployeeColumn = [
    {
      name: "employee_id",
      label: "Employee Code",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "employee_name",
      label: "Employee Name",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "base_location",
      label: "Plant",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "division",
      label: "Division",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "vendor_name",
      label: "Vendor Name",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "Date",
      label: "Date",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "Shift",
      label: "Shift",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "IN",
      label: "In Time",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "InDevice",
      label: "In Device",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "OUT",
      label: "Out Time",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "OutDevice",
      label: "Out Device",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "Comming_Late",
      label: "Late",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "Leaving_Early",
      label: "Early",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "Rem",
      label: "Attendance",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "Work_Hours",
      label: "Minutes Worked",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "Extra",
      label: "Reward Attendance",
      options: {
        filter: true,
        sort: false,
      },
    },
  ];
  const options = {
    tableBodyMaxHeight: "64vh",
    responsive: "standard",
    selectableRowsHideCheckboxes: true,
    sort: false,
    rowsPerPage: 15,
  };

  function getAttendanceByEmployee() {
    axios({
      method: "post",
      url: `${
        import.meta.env.VITE_API_URL
      }/mhere/get-attendance-by-variable-new2`,
      headers: {
        "Content-Type": "application/json",
      },
      data: sendEmployeeData,
    })
      .then((res) => {
        //console.log(res.data.data);

        let data = res.data.data;
        data.forEach((item) => {
          item.Work_Hours = `${parseInt(item.Work_Hours / 60)}H ${
            item.Work_Hours - parseInt(item.Work_Hours / 60) * 60
          }M`;
          item.Comming_Late = item.Comming_Late
            ? `${parseInt(item.Comming_Late / 60)}H ${
                item.Comming_Late - parseInt(item.Comming_Late / 60) * 60
              }M`
            : null;
          item.Leaving_Early = item.Leaving_Early
            ? `${parseInt(item.Leaving_Early / 60)}H ${
                item.Leaving_Early - parseInt(item.Leaving_Early / 60) * 60
              }M`
            : null;
          item.Extra = `${parseInt(item.Extra / 60)}H ${
            item.Extra - parseInt(item.Extra / 60) * 60
          }M`;
        });

        if (localStorage.getItem("employee_id") === "58872") {
          setEmployeeData(data.filter((item) => item.division === "SECURITY"));
        } else {
          setEmployeeData(data);
        }
        // setSendEmployeeData(initialState);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
        // setSendEmployeeData(initialState);
      });
  }

  function getAttendanceByVendor() {
    axios({
      method: "post",
      url: `${import.meta.env.VITE_API_URL}/mhere/get-attendance-by-vendor-id`,
      headers: {
        "Content-Type": "application/json",
      },
      data: sendVendorData,
    })
      .then((res) => {
        console.log(res.data.data);
        setVendorData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function getAttendanceByPlantName() {
    axios({
      method: "post",
      url: `${import.meta.env.VITE_API_URL}/mhere/get-attendance-by-plant-name`,
      headers: {
        "Content-Type": "application/json",
      },
      data: sendPlantData,
    })
      .then((res) => {
        console.log(res.data.data);
        setPlantData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function getData() {
    axios({
      method: "get",
      url: `${import.meta.env.VITE_API_URL}/mhere/get-plant`,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log(res);
        setPlantList(res.data.data);
        // setSendEmployeeData(initialState);
      })
      .catch((err) => {
        // setSendEmployeeData(initialState);

        console.log(err);
      });
  }
  function addDays(myDate) {
    let date = new Date(myDate);
    let next_date = new Date(date.setDate(date.getDate() + 62));
    var todayDate = next_date.toISOString().slice(0, 10);
    //console.log(todayDate);
    setSearchMaxDate(todayDate);
    //return new Date(myDate.getTime() + 62*24*60*60*1000);
  }

  function getCategory() {
    axios({
      method: "get",
      url: `${import.meta.env.VITE_API_URL}/mhere/get-ceam-category-master`,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        //  console.log(res.data.data);
        setCategoryList(res.data.data);
        // toast.success(res.data.message)
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function getDeptList() {
    axios({
      method: "get",
      url: `${import.meta.env.VITE_API_URL}/mhere/get-ceam-department-master`,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        // of employee id 58872 disable all the department in dropdown except security

        if (localStorage.getItem("employee_id") === "58872") {
          setDeptList(
            res.data.data?.filter((item) => item.department === "SECURITY")
          );
        } else {
          setDeptList(res.data.data);
        }
        // setDeptList(res.data.data);
        // toast.success(res.data.message)
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
        //  console.log(res);
        setDivisionList(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function getVendorlist() {
    axios({
      method: "get",
      url: `${import.meta.env.VITE_API_URL}/mhere/get-ceam-vendor-master`,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        // console.log(res);
        setVendorList(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function sendRegularizeData() {
    const data = {
      employee_id: localStorage.getItem("employee_id"),
      attendance_data: regularizeFile,
    };
    axios({
      method: "post",
      url: `${
        import.meta.env.VITE_API_URL
      }/mhere/upload-roster-regularization-bulk-past-days`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    })
      .then((res) => {
        toast.success(res.data.message);
        setOpenRegularizeDailog(false);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function downloadCard() {
    card.current.disabled = true;
    card.current.innerText = "Wait for Download";

    const data = sendEmployeeData;
    data.month =
      sendEmployeeData.start_date.split("-")[1] || new Date().getMonth() + 1;
    data.year =
      sendEmployeeData.start_date.split("-")[0] || new Date().getFullYear();
    console.log(data);
    axios({
      method: "post",
      url: `${
        import.meta.env.VITE_API_URL
      }/mhere/get-attendance-card-by-variable`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    })
      .then((res) => {
        console.log(res.data.data);
        card.current.disabled = false;
        card.current.innerText = "Download Attendance Card";

        window.open(res.data.data, "_blank");
      })
      .catch((err) => {
        card.current.innerText = "Download Attendance Card";

        card.current.disabled = false;
        console.log(err);
      });
  }

  function downloadMusterRoll() {
    muster.current.disabled = true;
    muster.current.innerText = "Wait for Download";
    const data = sendEmployeeData;
    data.month =
      sendEmployeeData.start_date.split("-")[1] || new Date().getMonth() + 1;
    data.year =
      sendEmployeeData.start_date.split("-")[0] || new Date().getFullYear();
    console.log(data);

    axios({
      method: "post",
      url: `${import.meta.env.VITE_API_URL}/mhere/get-muster-card-by-variable`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    })
      .then((res) => {
        console.log(res.data.data);
        muster.current.disabled = false;
        muster.current.innerText = "Download Muster Roll";
        window.open(res.data.data, "_blank");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        muster.current.innerText = "Download Muster Roll";
        console.log(err);
        muster.current.disabled = false;
      });
  }
  function downloadTrainingMusterRoll() {
    trainingmuster.current.disabled = true;
    trainingmuster.current.innerText = "Wait for Download";
    const data = sendEmployeeData;
    data.month =
      sendEmployeeData.start_date.split("-")[1] || new Date().getMonth() + 1;
    data.year =
      sendEmployeeData.start_date.split("-")[0] || new Date().getFullYear();
    console.log(data);

    axios({
      method: "post",
      url: `${
        import.meta.env.VITE_API_URL
      }/mhere/get-training-muster-card-by-variable`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    })
      .then((res) => {
        console.log(res.data.data);
        trainingmuster.current.disabled = false;
        trainingmuster.current.innerText = "Download Training Muster Roll";
        window.open(res.data.data, "_blank");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        trainingmuster.current.innerText = "Download Training Muster Roll";
        console.log(err);
        trainingmuster.current.disabled = false;
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
        setRegularizeFile(json);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  return (
    <div className="view-attendance-main">
      <div className="attendance-search-main">
        <div className="attendance-search-input-main">
          <SlInput
            label="Employee Code"
            onSlChange={(e) =>
              setSendEmployeeData({
                ...sendEmployeeData,
                employee_id: e.target.value,
              })
            }
          ></SlInput>
          <SlSelect
            className="add-emp-input"
            label="Select Category"
            onSlChange={(e) => {
              console.log(e.target.value.split("_").join(" "));
              setSendEmployeeData({
                ...sendEmployeeData,
                category: e.target.value.split("_").join(" "),
              });
            }}
          >
            {categoryList?.map((item, i) => {
              return (
                <SlOption
                  key={`${i}cat`}
                  value={item.category.split(" ").join("_")}
                >
                  {item.category}
                </SlOption>
              );
            })}
          </SlSelect>
          <SlSelect
            className="add-emp-input"
            label="Select Vendor Code"
            onSlChange={(e) => {
              setSendEmployeeData({
                ...sendEmployeeData,
                vendor: e.target.value.split("_").join(" "),
              });
            }}
          >
            {vendorList?.map((item, i) => {
              return (
                <SlOption
                  key={`${i}ven`}
                  value={item.vendor_code.split(" ").join("_")}
                >
                  {item.vendor_name} ( {item.vendor_code} )
                </SlOption>
              );
            })}
          </SlSelect>
          <SlSelect
            className="add-emp-input"
            label="Select Department"
            onSlChange={(e) => {
              setSendEmployeeData({
                ...sendEmployeeData,
                department: e.target.value.split("_").join(" "),
              });
            }}
          >
            {deptList?.map((item, i) => {
              return (
                <SlOption
                  key={`${i}dept`}
                  value={item.department?.split(" ")?.join("_")}
                >
                  {item.department}
                </SlOption>
              );
            })}
          </SlSelect>
          <SlSelect
            className="add-emp-input"
            label="Select Plant"
            onSlChange={(e) => {
              getDivision(e.target.value);
              setSendEmployeeData({
                ...sendEmployeeData,
                plant: e.target.value.split("_").join(" "),
              });
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
            className="add-emp-input"
            label="Select Division"
            onSlChange={(e) => {
              setSendEmployeeData({
                ...sendEmployeeData,
                division: e.target.value.split("_").join(" "),
              });
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
          <SlSelect
            className="add-emp-input"
            label="Select Gender"
            onSlChange={(e) => {
              setSendEmployeeData({
                ...sendEmployeeData,
                gender: e.target.value,
              });
            }}
          >
            <SlOption value="M">Male</SlOption>
            <SlOption value="F">Female</SlOption>
          </SlSelect>
          <SlInput
            type="date"
            label="Start Date"
            onSlChange={(e) => {
              addDays(e.target.value);
              setSendEmployeeData({
                ...sendEmployeeData,
                start_date: e.target.value,
              });
            }}
          ></SlInput>
          <SlInput
            type="date"
            label="End Date"
            max={searchMaxDate}
            onSlChange={(e) =>
              setSendEmployeeData({
                ...sendEmployeeData,
                end_date: e.target.value,
              })
            }
          ></SlInput>
          <SlButton
            variant="primary"
            onClick={() => {
              getAttendanceByEmployee();
            }}
          >
            Search
          </SlButton>
          <SlButton
            ref={card}
            onClick={() => {
              downloadCard();
            }}
          >
            Download Attendance Card
          </SlButton>
          <SlButton
            ref={muster}
            onClick={() => {
              downloadMusterRoll();
            }}
          >
            Download Muster Roll
          </SlButton>
          <SlButton
            ref={trainingmuster}
            onClick={() => {
              downloadTrainingMusterRoll();
            }}
          >
            Download Training Muster Roll
          </SlButton>
          <SlButton
            onClick={() => {
              setOpenRegularizeDailog(true);
            }}
          >
            Regularize Attendance
          </SlButton>
        </div>
        <div
          style={{ marginTop: "5vh", padding: "0px" }}
          className="table-ceam report-table roster-table "
        >
          <MUIDataTable
            title="Attendance Data"
            data={employeeData}
            columns={EmployeeColumn}
            options={options}
          ></MUIDataTable>
        </div>
      </div>
      <SlDialog
        label="Regulaize Attendance"
        open={openRegularizeDailog}
        onSlRequestClose={() => setOpenRegularizeDailog(false)}
      >
        <input
          type="file"
          onChange={(e) => {
            readUploadFile(e);
          }}
        ></input>
        <SlButton
          slot="footer"
          variant="success"
          style={{ marginRight: "20px" }}
          onClick={() => sendRegularizeData()}
        >
          Submit
        </SlButton>
        <SlButton
          slot="footer"
          variant="danger"
          onClick={() => setOpenRegularizeDailog(false)}
        >
          Close
        </SlButton>
      </SlDialog>
    </div>
  );
}

export default ViewAttendance;
