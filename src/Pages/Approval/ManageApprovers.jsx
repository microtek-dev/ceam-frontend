import { SlButton, SlDialog, SlInput, SlMenuItem, SlSelect, SlTag } from '@shoelace-style/shoelace/dist/react/index';
import axios from 'axios';
import MUIDataTable from 'mui-datatables';
import React, { useState } from 'react'
import { useEffect } from 'react'
import { baseurl } from '../../api/apiConfig';
import './ManageApprovers.css'
import {  toast } from 'react-toastify';

function ManageApprovers() {

    const [plantList, setPlantList] = useState()
    const [divisionList, setDivisionList] = useState([])
    const [openAddNew, setOpenAddNew] = useState(false)
    const [rosterApprovers, setRosterApprovers] = useState()
    const [openDelete, setOpenDelete] = useState(false)
    const [openUpdateApprover, setOpenUpdateApprover] = useState(false);
    const [newApproverData, setNewApproverData] = useState({
        "approver_employee_id":"",
        "plant":"",
        "division":"",
        "level_1_approver":"",
        "level_2_approver":"",
        "approval_type":"",
        "employee_id":localStorage.getItem("employee_id")
    })
    const [delData, setDelData] = useState({
        "matrix_id":"",
        "employee_id":localStorage.getItem("employee_id")
    })
    const [updateData, setUpdateData] = useState({
        "matrix_id":"",
        "approver_employee_id":"",
        "plant":"",
        "division":"",
        "level_1_approver":false,
        "level_2_approver":false,
        "approval_type":"",
        "employee_id":localStorage.getItem("employee_id")
    })
    useEffect(()=>{
        getRosterApprovers()
        getData()
    },[])



    const options = {
        tableBodyMaxHeight: '64vh',
        responsive: 'standard',
        selectableRowsHideCheckboxes: true,
        //customToolbar: CustomToolbar ,
    }
    

    const col =[
        {
            name: "employee_id",
            label: "Employee ID",
            options: {
                filter: true,
                sort: true,
            }
        },
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
            name: "approval_type",
            label: "Approval Type",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "level_1_approver",
            label: "Level 1",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "level_2_approver",
            label: "Level 2",
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
                           setOpenUpdateApprover(true);
                           // console.log(dataIndex);
                            //console.log(plantData[dataIndex].plant);
                            setUpdateData({...updateData,matrix_id:rosterApprovers[dataIndex].matrix_id,plant:rosterApprovers[dataIndex].plant,division:rosterApprovers[dataIndex].division,approver_employee_id:rosterApprovers[dataIndex].employee_id, level_1_approver: rosterApprovers[dataIndex].level_1_approver? true:false, level_2_approver:rosterApprovers[dataIndex].level_2_approver? true:false, approval_type:rosterApprovers[dataIndex].approval_type})
                            setOpenUpdateApprover(true);
                        }} style={{ zIndex: "20", cursor: "pointer" }}>
                            
                            Update
                        </SlTag>
                        <SlTag variant='danger' size="small" className="tag-row" onClick={e => {
                            setDelData({...delData,matrix_id:rosterApprovers[dataIndex].matrix_id})
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

    function getRosterApprovers(){
        axios({
            method: 'get',
            url: `${baseurl.base_url}/mhere/get-roster-approval`,
            headers: {
                'Content-Type': 'application/json',
              },
          })
        .then(function (response) {
            console.log(response.data.data);
            setRosterApprovers(response.data.data)

        })
        .catch(function (error) {
            console.log(error);
        });

    }

    function addNewApprover(){
        console.log(newApproverData);
        axios({
            method: 'post',
            url: `${baseurl.base_url}/mhere/create-roster-approval`,
            headers: {
              'Content-Type': 'application/json',
            },
            data:newApproverData
          })
          .then((res)=>{
            console.log(res);
            setNewApproverData({
                "approver_employee_id":"",
                "plant":"",
                "division":"",
                "level_1_approver":"",
                "level_2_approver":"",
                "approval_type":"",
                "employee_id":localStorage.getItem("employee_id")
            })
            toast.success(res.data.message);
                getRosterApprovers()
          })
          .catch((err)=>{
            console.log(err);
            toast.error(err.response.data.message);
          })
    }

    function deleteApprover() {
        console.log(delData);
        axios({
            method: 'post',
            url: `${baseurl.base_url}/mhere/delete-roster-approval`,
            headers: {
              'Content-Type': 'application/json',
            },
            data:delData
          })
          .then((res)=>{
            console.log(res);
            toast.success(res.data.message);
                getRosterApprovers()
          
          })
          .catch((err)=>{
            console.log(err);
            toast.error(err.response.data.message);
          })
    }
    function sendRosterApproverUpdate() {
        console.log(updateData);
        axios({
            method: 'post',
            url: `${baseurl.base_url}/mhere/update-roster-approval`,
            headers: {
              'Content-Type': 'application/json',
            },
            data:updateData
          })
          .then((res)=>{
            console.log(res);
            toast.success(res.data.message);
                getRosterApprovers()
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
    function getDivision(item) {
        const data = {
          plant:item
        }
        axios({
          method: 'post',
          url: `${baseurl.base_url}/mhere/get-division`,
          headers: {
            'Content-Type': 'application/json',
          },
          data
        })
        .then((res)=>{
          console.log(res);
          setDivisionList(res.data.data)
        })
        .catch((err)=>{
          console.log(err);
        })
        
    }

    return (


    <div className='manage-approvers-main'>
         <div className="plant-manage-buttons-main">
            <SlButton className="plant-add-button" variant="primary" onClick={()=>{  
                setOpenAddNew(true) 
            }}>Add New Approver</SlButton> 
        </div>
    <div className="plant-manage-table-main table-ceam">
    <MUIDataTable
        title="Manage Data"
        data={rosterApprovers}
        columns={col}
        options={options}
    ></MUIDataTable>
    </div>
    <SlDialog label="Confirm" open={openDelete} onSlRequestClose={() => setOpenDelete(false)}>
            Do you really want to make division unactive?
        <SlButton style={{"marginRight":"20px"}} slot="footer" variant="primary" outline onClick={() => {
            deleteApprover();
            setOpenDelete(false)}}>
          Confirm
        </SlButton>
        <SlButton slot="footer" variant="danger" outline onClick={() => setOpenDelete(false)}>
          Cancel
        </SlButton>
    </SlDialog>
    <SlDialog label="Update" open={openUpdateApprover} onSlRequestClose={() => setOpenUpdateApprover(false)}>
        <div className="">
        <SlSelect style={{"marginBottom":"15px"}} value={updateData.plant} label="Select Plant" onSlChange={(e)=>{
            setUpdateData({...updateData,plant:e.target.value})
              
              // setCreatePlant({...createPlant,plant:e.target.value})
                getDivision(e.target.value)
        }}>
            {plantList?.map((item,i)=>{
            return(
              <SlMenuItem key={`${i}plant`} value={item.plant}>{item.plant}</SlMenuItem>

            )            
          })}
        </SlSelect> 
        <SlSelect  style={{"marginBottom":"15px"}} value={updateData.division} label="Division" onSlChange={(e)=>{
            setUpdateData({...updateData,division:e.target.value})
        //   setDivision(e.target.value)
        }}>
            {divisionList?.map((item,i)=>{
            return(
              <SlMenuItem key={`${i}divisionu`} value={item.division}>{item.division}</SlMenuItem>

            )            
          })}
        </SlSelect>
        <SlSelect  style={{"marginBottom":"15px"}} value={updateData.level_1_approver}  label="Select Level 1" onSlChange={(e)=>{
            setUpdateData({...updateData,level_1_approver:e.target.value})

        }}>
            <SlMenuItem value={true}>True</SlMenuItem>
            <SlMenuItem value={false}>False</SlMenuItem>
        </SlSelect>
        <SlSelect label="Select Level 2" value={updateData.level_2_approver} onSlChange={(e)=>{
            setUpdateData({...updateData,level_2_approver:e.target.value})

        }}>
            <SlMenuItem value={true}>True</SlMenuItem>
            <SlMenuItem value={false}>False</SlMenuItem>
        </SlSelect>
        </div>
        <SlButton style={{"marginRight":"20px"}} slot="footer" variant="success" outline onClick={() => {
            sendRosterApproverUpdate()
            setOpenUpdateApprover(false)}}>
            Update
        </SlButton>
        <SlButton slot="footer" outline variant="danger" onClick={() => setOpenUpdateApprover(false)}>
          Close
        </SlButton>
    </SlDialog>
    <SlDialog label="Add New" open={openAddNew} onSlRequestClose={() => setOpenAddNew(false)}>
        <div>
        <SlInput  style={{"marginBottom":"15px"}} label="Employee ID" value={newApproverData.approver_employee_id} onSlBlur={(e)=>{
            setNewApproverData({...newApproverData,approver_employee_id:e.target.value})

        }} />
        <SlSelect style={{"marginBottom":"15px"}} value={newApproverData.plant} label="Select Plant" onSlChange={(e)=>{
            setNewApproverData({...newApproverData,plant:e.target.value})
              
              // setCreatePlant({...createPlant,plant:e.target.value})
                getDivision(e.target.value)
        }}>
            {plantList?.map((item,i)=>{
            return(
              <SlMenuItem key={`${i}plant`} value={item.plant}>{item.plant}</SlMenuItem>

            )            
          })}
        </SlSelect> 
        <SlSelect  style={{"marginBottom":"15px"}} value={newApproverData.division} label="Division" onSlChange={(e)=>{
            setNewApproverData({...newApproverData,division:e.target.value})
        //   setDivision(e.target.value)
        }}>
            {divisionList?.map((item,i)=>{
            return(
              <SlMenuItem key={`${i}divisionu`} value={item.division}>{item.division}</SlMenuItem>

            )            
          })}
        </SlSelect>
        <SlSelect  style={{"marginBottom":"15px"}} value={newApproverData.approval_type}  label="Select Approval Type" onSlChange={(e)=>{
            setNewApproverData({...newApproverData,approval_type:e.target.value})

        }}>
            <SlMenuItem value="ot">Reward</SlMenuItem>
            <SlMenuItem value="roster">Roster</SlMenuItem>
        </SlSelect>
        <SlSelect  style={{"marginBottom":"15px"}} value={newApproverData.level_1_approver}  label="Select Level 1" onSlChange={(e)=>{
            setNewApproverData({...newApproverData,level_1_approver:e.target.value})

        }}>
            <SlMenuItem value={true}>True</SlMenuItem>
            <SlMenuItem value={false}>False</SlMenuItem>
        </SlSelect>
        <SlSelect label="Select Level 2" value={newApproverData.level_2_approver} onSlChange={(e)=>{
            setNewApproverData({...newApproverData,level_2_approver:e.target.value})

        }}>
            <SlMenuItem value={true}>True</SlMenuItem>
            <SlMenuItem value={false}>False</SlMenuItem>
        </SlSelect>
        </div>
        <SlButton style={{"marginRight":"20px"}} slot="footer" variant="success" outline onClick={() => {
            addNewApprover()
            setOpenAddNew(false)}}>
          Create
        </SlButton>
        <SlButton slot="footer" variant="primary" onClick={() => setOpenAddNew(false)}>
          Close
        </SlButton>
      </SlDialog>
    </div>
  )
}

export default ManageApprovers