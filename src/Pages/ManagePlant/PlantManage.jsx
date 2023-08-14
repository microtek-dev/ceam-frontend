import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import './PlantManage.css'
import axios from "axios";
import { baseurl } from "../../api/apiConfig";
import {  toast } from 'react-toastify';

import { SlButton, SlDialog, SlIcon, SlInput, SlMenuItem, SlSelect, SlTag } from "@shoelace-style/shoelace/dist/react/index";
function PlantManage() {

   // const [col, setCol] = useState([])\
    const [createPlant, setCreatePlant] = useState({
        "plant":"",
        "division":"",
        "employee_id":localStorage.getItem("employee_id")
    })
    const [plantData, setPlantData] = useState([])
    const [openDelete, setOpenDelete] = useState(false)
    const [openUpdatePlant, setOpenUpdatePlant] = useState(false)
    const [addPlantDialog, setAddPlantDialog] = useState(false)
    const [openAddDivisionDialog, setOpenAddDivisionDialog] = useState(false)
    const [plantList, setPlantList] = useState()
    const [updateData, setUpdateData] = useState({
        "id":"",
        "plant":"",
        "division":"",
        "employee_id":localStorage.getItem("employee_id")
    })
    const [delData, setDelData] = useState({
        "id":"",
        "employee_id":localStorage.getItem("employee_id")
    })

    useEffect(()=>{
        getPlantData()
        getData()
    },[])
    
    const options = {
        tableBodyMaxHeight: '64vh',
        responsive: 'standard',
        selectableRowsHideCheckboxes: true,
        rowsPerPage:15
        //customToolbar: CustomToolbar ,
    }

    const col =[
        {
            name: "plant",
            label: "Plant",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "division",
            label: "Division",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "Edit",
            options: {
                filter: false,
                sort: false,
                empty: true,
                customBodyRenderLite: (dataIndex, rowIndex) => {
                    return (
                       <div className="edit-button-main">
                         <SlTag variant='primary' size="small" className="tag-row" onClick={e => { 
                            console.log(dataIndex);
                            console.log(plantData[dataIndex].plant);
                            setUpdateData({...updateData,id:plantData[dataIndex].id,plant:plantData[dataIndex].plant,division:plantData[dataIndex].division})
                            setOpenUpdatePlant(true)
                        }} style={{ zIndex: "20", cursor: "pointer" }}>
                            <SlIcon slot="suffix" name="arrow-counterclockwise"></SlIcon>
                            Update
                        </SlTag>
                        <SlTag variant='danger' size="small" className="tag-row" onClick={e => {
                            setDelData({...delData,id:plantData[dataIndex].id})
                            setOpenDelete(true)
                        }} style={{ zIndex: "20", cursor: "pointer" }}>
                            Delete
                        </SlTag>
                       </div>
                    );
                }
            }
        },
    ]

    function sendCreatePlant(){
        console.log(createPlant);
        axios({
            method: 'post',
            url: `${baseurl.base_url}/mhere/create-roster-location`,
            headers: {
              'Content-Type': 'application/json',
            },
            data:createPlant
          })
          .then((res)=>{
            console.log(res);
            toast.success(res.data.message);
            setCreatePlant({
                "plant":"",
                "division":"",
                "employee_id":localStorage.getItem("employee_id")
            })
            getPlantData()
          })
          .catch((err)=>{
            console.log(err);
            toast.error(err.response.data.message);
          })
    }


    function sendRosterLocationUpdate(){
        console.log(updateData);
        axios({
            method: 'post',
            url: `${baseurl.base_url}/mhere/update-roster-location`,
            headers: {
              'Content-Type': 'application/json',
            },
            data:updateData
          })
          .then((res)=>{
            console.log(res);
            toast.success(res.data.message);
                getPlantData()
           
          })
          .catch((err)=>{
            console.log(err);
            toast.error(err.response.data.message);
          })
    }
    function sendRosterLocationDelete(){
        console.log(delData);
        axios({
            method: 'post',
            url: `${baseurl.base_url}/mhere/delete-roster-location`,
            headers: {
              'Content-Type': 'application/json',
            },
            data:delData
          })
          .then((res)=>{
            console.log(res);
            
            toast.success(res.data.message);
                getPlantData()
          })
          .catch((err)=>{
            console.log(err);
            toast.error(err.response.data.message);
          })
    }

    function getData() {
        axios({
          method: 'get',
          url: `${baseurl.base_url}/mhere/get-plant`,
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((res)=>{
          console.log(res);
          setPlantList(res.data.data)
        })
        .catch((err)=>{
          console.log(err);
        })
 
      }

    function getPlantData() {
        axios({
          method: 'get',
          url: `${baseurl.base_url}/mhere/get-roster-location`,
          headers: {
            'Content-Type': 'application/json',
          }
        })
        .then((res)=>{
          console.log(res);
          setPlantData(res.data.data)

        })
        .catch((err)=>{
          console.log(err);
        })
        
      }

  return (
    <div className="plant-manage-main">
        <div className="plant-manage-buttons-main">
            <SlButton className="plant-add-button" variant="primary"  onClick={()=>{
                setAddPlantDialog(true)
            }}>Add Plant</SlButton>
            <SlButton className="plant-add-button" variant="primary"  onClick={()=>{
                setOpenAddDivisionDialog(true)
            }}>Add Division</SlButton>
        </div>
     <div className="plant-manage-table-main table-ceam">
     <MUIDataTable
        title="Manage Data"
        data={plantData}
        columns={col}
        options={options}
      ></MUIDataTable>
     </div>
    <SlDialog label="Update" open={openUpdatePlant} onSlRequestClose={() => setOpenUpdatePlant(false)}>
        <div className="update-plant-dialog-inputs">

            <SlInput label="Division Name" value={updateData.division} onSlChange={(e)=>{
                 setUpdateData({...updateData,division:e.target.value})
            }}></SlInput>
        </div>
        <SlButton style={{"marginRight":"20px"}} slot="footer" variant="success" outline onClick={() => {
            sendRosterLocationUpdate()
            setOpenUpdatePlant(false)}}>
            Update
        </SlButton>
        <SlButton slot="footer" outline variant="danger" onClick={() => setOpenUpdatePlant(false)}>
          Close
        </SlButton>
    </SlDialog>
    <SlDialog label="Confirm" open={openDelete} onSlRequestClose={() => setOpenDelete(false)}>
            Do you really want to make division unactive?
        <SlButton style={{"marginRight":"20px"}} slot="footer" variant="primary" outline onClick={() => {
            sendRosterLocationDelete()
            setOpenDelete(false)}}>
          Confirm
        </SlButton>
        <SlButton slot="footer" variant="danger" outline onClick={() => setOpenDelete(false)}>
          Cancel
        </SlButton>
    </SlDialog>
    <SlDialog label="Add Plant" open={addPlantDialog} onSlRequestClose={() => setAddPlantDialog(false)}>
            <div className="update-plant-dialog-inputs">
            <SlInput label="Plant Name" value={createPlant.plant} onSlChange={(e)=>{
                 setCreatePlant({...createPlant,plant:e.target.value})
            }}></SlInput>
             <SlInput label="Division Name" value={createPlant.division} onSlChange={(e)=>{
                 setCreatePlant({...createPlant,division:e.target.value})
            }}></SlInput>
            </div>
        <SlButton style={{"marginRight":"20px"}} slot="footer" variant="success" outline onClick={() => {
            sendCreatePlant()
            setAddPlantDialog(false)}}>
          Add Plant
        </SlButton>
        <SlButton slot="footer" variant="primary" onClick={() => setAddPlantDialog(false)}>
          Close
        </SlButton>
    </SlDialog>
    <SlDialog label="Add Division" open={openAddDivisionDialog} onSlRequestClose={() => setOpenAddDivisionDialog(false)}>
            <div>
            <SlSelect style={{"marginBottom":"15px"}} label="Select Plant" onSlChange={(e)=>{
                 setCreatePlant({...createPlant,plant:e.target.value})
                
        }}>
            {plantList?.map((item,i)=>{
            return(
              <SlMenuItem key={`${i}plant`} value={item.plant}>{item.plant}</SlMenuItem>

            )            
          })}
        </SlSelect> 
             <SlInput label="Division Name" value={createPlant.division} onSlChange={(e)=>{
                 setCreatePlant({...createPlant,division:e.target.value})
            }}></SlInput>
            </div>
        <SlButton style={{"marginRight":"20px"}} slot="footer" variant="success" outline onClick={() => {
            sendCreatePlant()
            setOpenAddDivisionDialog(false)}}>
          Add Plant
        </SlButton>
        <SlButton slot="footer" variant="primary" onClick={() => setOpenAddDivisionDialog(false)}>
          Close
        </SlButton>
    </SlDialog>

    </div>
  );
}

export default PlantManage;
