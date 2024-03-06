import {
  SlButton,
  SlDialog,
  SlInput,
  SlOption,
  SlSelect,
  SlTag,
} from "@shoelace-style/shoelace/dist/react/index";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { baseurl } from "../../api/apiConfig";
import "./VendorMaster.css";

function VendorMaster() {
  /* Dialog States */
  const [openAddEmp, setOpenAddEmp] = useState(false);

  const [deleteVendorData, setDeleteVendorData] = useState({
    ceam_master_id: "",
    deleted_by: localStorage.getItem("employee_id"),
  });
  const [plantList, setPlantList] = useState();
  const [vendorList, setVendorList] = useState();
  const [sendVendor, setSendVendor] = useState({
    vendor_name: "",
    vendor_code: "",
    plant_name: "",
    uploaded_by: localStorage.getItem("employee_id"),
  });

  useEffect(() => {
    getVendorlist();
    getPlantData();
  }, []);

  const options = {
    tableBodyMaxHeight: "64vh",
    responsive: "standard",
    selectableRowsHideCheckboxes: true,
    sort: false,
    rowsPerPage: 15,
  };

  const column = [
    {
      name: "vendor_code",
      label: "Vendor Code",
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
      name: "plant_name",
      label: "Plant Name",
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
            <div style={{ cursor: "not-allowed" }}>
              <SlTag
                style={{ pointerEvents: "none", cursor: "not-allowed" }}
                variant="warning"
                size="small"
                className="tag-row"
                onClick={(e) => {
                  // setOpenDelShift(true)
                  // console.log(shiftMasterData[dataIndex].shift_id);
                  //sendVendorData(vendorList[dataIndex].ceam_master_id)
                  deleteVendor(vendorList[dataIndex].ceam_master_id);
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

  function getVendorlist() {
    axios({
      method: "get",
      url: `${import.meta.env.VITE_API_URL}/mhere/get-ceam-vendor-master`,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        //  console.log(res);
        setVendorList(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function sendVendorData() {
    console.log(sendVendor);
    axios({
      method: "post",
      url: `${import.meta.env.VITE_API_URL}/mhere/upload-ceam-vendor-master`,
      headers: {
        "Content-Type": "application/json",
      },
      data: sendVendor,
    })
      .then((res) => {
        //   console.log(res);
        setOpenAddEmp(false);

        setSendVendor({
          vendor_name: "",
          vendor_code: "",
          plant_name: "",
          uploaded_by: localStorage.getItem("employee_id"),
        });
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.data.message);
      });
  }

  function deleteVendor(id) {
    const data = {
      ceam_master_id: id,
      deleted_by: localStorage.getItem("employee_id"),
    };

    axios({
      method: "post",
      url: `${import.meta.env.VITE_API_URL}/mhere/delete-ceam-vendor-master`,
      headers: {
        "Content-Type": "application/json",
      },
      data: deleteVendorData,
    })
      .then((res) => {
        toast.success(res.data.message);
        console.log(res);
      })
      .catch((err) => {
        toast.error(err.data.message);
        console.log(err);
      });
  }
  function getPlantData() {
    axios({
      method: "get",
      url: `${import.meta.env.VITE_API_URL}/mhere/get-plant`,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        //console.log(res);
        setPlantList(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="vendor-master-main">
      <div className="employee-master-buttons-main">
        <div
          className="ceam-main-buttons"
          style={{ display: "flex", gap: "25px", flexWrap: "wrap" }}
        >
          <SlButton
            className="plant-add-button"
            variant="primary"
            onClick={() => {
              setOpenAddEmp(true);
            }}
          >
            Add Single Vendor
          </SlButton>
        </div>
      </div>
      <div className="table-ceam">
        <MUIDataTable
          title="Vendor Data"
          data={vendorList}
          columns={column}
          options={options}
        ></MUIDataTable>
      </div>
      <SlDialog
        label="Add Employee"
        open={openAddEmp}
        onSlRequestClose={() => setOpenAddEmp(false)}
      >
        <div className="add-vendor-inputs-main">
          <SlInput
            className="add-vendor-input"
            placeholder="eg : VENDOR001"
            label="Vendor Code"
            onSlChange={(e) => {
              setSendVendor({ ...sendVendor, vendor_code: e.target.value });
            }}
          />
          <SlInput
            className="add-vendor-input"
            placeholder="eg : Balaji"
            label="Vendor Name"
            onSlChange={(e) => {
              setSendVendor({ ...sendVendor, vendor_name: e.target.value });
            }}
          />
          <SlSelect
            label="Plant Name"
            onSlChange={(e) => {
              setSendVendor({
                ...sendVendor,
                plant_name: e.target.value.split("_").join(" "),
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
        </div>
        <div className="add-emp-buttons-main">
          <SlButton
            slot="footer"
            variant="success"
            outline
            onClick={() => {
              sendVendorData();
              setOpenAddEmp(false);
            }}
          >
            Add Vendor
          </SlButton>
          <SlButton
            slot="footer"
            variant="danger"
            outline
            onClick={() => setOpenAddEmp(false)}
          >
            Close
          </SlButton>
        </div>
      </SlDialog>
    </div>
  );
}

export default VendorMaster;
