import "./ShiftMaster.css";
import {
  SlButton,
  SlDialog,
  SlInput,
  SlMenuItem,
  SlTag,
  SlSelect,
} from "@shoelace-style/shoelace/dist/react/index";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { baseurl } from "../../api/apiConfig";
import { toast } from "react-toastify";

function ShiftMaster() {
  const [openDelShift, setOpenDelShift] = useState(false);
  const [delShiftId, setDelShiftId] = useState("");
  const [shiftMasterData, setShiftMasterData] = useState();
  const [newShiftMasterData, setNewShiftMasterData] = useState({
    shift_title: "",
    shift_character: "",
    shift_description: "",
    shift_type: "",
    ot_max_hours: "",
    shift_min_intime: "",
    shift_min_outtime: "",
    shift_max_intime: "",
    shift_max_outtime: "",
    shift_total_hours: "",
    employee_id: localStorage.getItem("employee_id"),
  });

  const shiftType = useRef("");

  const [openAddShift, setOpenAddShift] = useState(false);

  useEffect(() => {
    getShiftMaster();
  }, []);

  const column = [
    {
      name: "shift_title",
      label: "Shift Title",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "shift_character",
      label: "Shift Character",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "shift_type",
      label: "Shift Type",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "shift_total_hours",
      label: "Shift Total Hours",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "ot_max_hours",
      label: "Reward Max Hours",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "shift_min_intime",
      label: "Shift Min Intime",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "shift_max_intime",
      label: "Shift Max Intime",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "shift_min_outtime",
      label: "Shift Min Out Time",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "shift_max_outtime",
      label: "Shift Max OuT Time",
      options: {
        filter: true,
        sort: false,
      },
    },

    {
      name: "delete",
      label: "Delete",
      options: {
        filter: true,
        sort: false,
        customBodyRenderLite: (dataIndex, rowIndex) => {
          return (
            <div className="">
              <SlTag
                variant="warning"
                size="small"
                className="tag-row"
                onClick={(e) => {
                  setOpenDelShift(true);
                  // console.log(shiftMasterData[dataIndex].shift_id);
                  setDelShiftId(shiftMasterData[dataIndex].shift_id);
                }}
              >
                Delete
              </SlTag>
            </div>
          );
        },
      },
    },
  ];
  const options = {
    tableBodyMaxHeight: "64vh",
    responsive: "standard",
    selectableRowsHideCheckboxes: true,
    sort: false,
    customBodyRender: () => {},
    rowsPerPage: 15,

    //customToolbar: CustomToolbar ,
  };

  function getShiftMaster() {
    axios({
      method: "get",
      url: `${import.meta.env.VITE_API_URL}/mhere/get-ceam-shift-master`,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log(res.data.data);
        setShiftMasterData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function sendNewShiftMaster() {
    console.log(newShiftMasterData);
    if (
      newShiftMasterData.shift_min_intime > newShiftMasterData.shift_max_intime
    ) {
      toast.error("Min time cannot be more than max time");
      return;
    }
    axios({
      method: "post",
      url: `${import.meta.env.VITE_API_URL}/mhere/upload-ceam-shift-master`,
      headers: {
        "Content-Type": "application/json",
      },
      data: newShiftMasterData,
    })
      .then((res) => {
        console.log(res);
        setOpenAddShift(false);
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      });
  }

  function delShift() {
    const data = {
      shift_id: delShiftId,
      employee_id: localStorage.getItem("employee_id"),
    };
    axios({
      method: "post",
      url: `${import.meta.env.VITE_API_URL}/mhere/delete-ceam-shift-master`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    })
      .then((res) => {
        console.log(res.data.message);
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      });
  }

  return (
    <div className="shift-master-main">
      <div className="employee-master-buttons-main">
        <SlButton
          className="plant-add-button"
          variant="primary"
          onClick={() => setOpenAddShift(true)}
        >
          Add Shift Master
        </SlButton>
      </div>
      <div style={{ marginTop: "5vh" }} className="table-ceam">
        <MUIDataTable
          title="Shift Master Data"
          data={shiftMasterData}
          columns={column}
          options={options}
        ></MUIDataTable>
      </div>
      <SlDialog
        label="Add Shift Master"
        open={openAddShift}
        onSlRequestClose={() => setOpenAddShift(false)}
      >
        <div className="new-shift-master-input-main">
          <SlInput
            label="Shift Title"
            onSlChange={(e) => {
              setNewShiftMasterData({
                ...newShiftMasterData,
                shift_title: e.target.value,
              });
            }}
          />
          <SlInput
            label="Shift Character"
            onSlChange={(e) => {
              setNewShiftMasterData({
                ...newShiftMasterData,
                shift_character: e.target.value.toUpperCase(),
              });
            }}
          />
          <SlInput
            label="Shift Description"
            onSlChange={(e) => {
              setNewShiftMasterData({
                ...newShiftMasterData,
                shift_description: e.target.value,
              });
            }}
          />
          <SlSelect
            label="Shift Type"
            onSlChange={(e) => {
              setNewShiftMasterData({
                ...newShiftMasterData,
                shift_type: e.target.value,
              });
              shiftType.current = e.target.value;
            }}
          >
            <SlMenuItem value="shift">Shift</SlMenuItem>
            <SlMenuItem value="ot">Reward</SlMenuItem>
          </SlSelect>
          {shiftType.current == "ot" ? (
            <div>
              <SlInput
                label="Reward Max Hours"
                onSlChange={(e) => {
                  setNewShiftMasterData({
                    ...newShiftMasterData,
                    ot_max_hours: e.target.value,
                  });
                }}
              />
            </div>
          ) : (
            ""
          )}
          {shiftType.current == "shift" ? (
            <div className="new-shift-master-input-main">
              <SlInput
                label="Shift Total Hours"
                onSlChange={(e) => {
                  setNewShiftMasterData({
                    ...newShiftMasterData,
                    shift_total_hours: e.target.value,
                  });
                }}
              />

              <SlInput
                type="time"
                label="Shift Min InTime"
                onSlChange={(e) => {
                  setNewShiftMasterData({
                    ...newShiftMasterData,
                    shift_min_intime: e.target.value,
                  });
                }}
              />
              <SlInput
                type="time"
                label="Shift Max InTime"
                onSlChange={(e) => {
                  setNewShiftMasterData({
                    ...newShiftMasterData,
                    shift_max_intime: e.target.value,
                  });
                }}
              />
              <SlInput
                type="time"
                label="Shift Min OutTime"
                onSlChange={(e) => {
                  setNewShiftMasterData({
                    ...newShiftMasterData,
                    shift_min_outtime: e.target.value,
                  });
                }}
              />
              <SlInput
                type="time"
                label="Shift Max OutTime"
                onSlChange={(e) => {
                  setNewShiftMasterData({
                    ...newShiftMasterData,
                    shift_max_outtime: e.target.value,
                  });
                }}
              />
            </div>
          ) : (
            ""
          )}
        </div>

        <SlButton
          style={{ marginRight: "20px" }}
          slot="footer"
          variant="success"
          outline
          onClick={() => {
            sendNewShiftMaster();
          }}
        >
          Add Shift
        </SlButton>
        <SlButton
          slot="footer"
          variant="primary"
          onClick={() => setOpenAddShift(false)}
        >
          Close
        </SlButton>
      </SlDialog>
      <SlDialog
        label="Dialog"
        open={openDelShift}
        onSlRequestClose={() => setOpenDelShift(false)}
      >
        You really want to delete this Shift?
        <SlButton
          style={{ marginRight: "20px" }}
          slot="footer"
          variant="danger"
          onClick={() => {
            delShift();
            setOpenDelShift(false);
          }}
        >
          Delete
        </SlButton>
        <SlButton
          slot="footer"
          variant="primary"
          onClick={() => setOpenDelShift(false)}
        >
          Close
        </SlButton>
      </SlDialog>
    </div>
  );
}

export default ShiftMaster;
