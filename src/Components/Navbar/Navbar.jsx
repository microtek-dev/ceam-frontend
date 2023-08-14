import React, { useState } from 'react';
import './Navbar.css';
import { SlButton, SlDialog, SlDivider, SlDropdown, SlIcon, SlMenu, SlMenuItem } from '@shoelace-style/shoelace/dist/react/index';
import logo from './time2.jpg';
import template from './assets/employee_upload_template.xlsx';
import { useNavigate } from 'react-router-dom';
import thirtyonedays from './templates/31daysTemplate.xlsx';
import thirtydays from './templates/30daysTemplate.xlsx';
import twentyeightdays from './templates/28daysTemplate.xlsx';
import twentyninedays from './templates/9daysTemplate.xlsx';
import twodaystemplate from './templates/2days_template.xlsx';
import regulartemplate from './templates/regularize_template.xlsx';
import axios from 'axios';
import * as xlsx from 'xlsx';
import { baseurl } from '../../api/apiConfig';
import { toast } from 'react-toastify';
function Navbar() {
	let navigate = useNavigate();
	const [selectMonth, setSelectMonth] = useState(false);
	const [downMonth, setDownMonth] = useState('2022-02');
	const [href, setHref] = useState();
	const [shiftList, setShiftList] = useState();
	const [OtList, setOtList] = useState();

	function downloadTemplate() {
		console.log(downMonth);
	}

	function getShiftType() {
		axios({
			method: 'get',
			url: `${baseurl.base_url}/mhere/get-shift-type`,
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((res) => {
				console.log(res);
				setShiftList(res.data.data);
			})
			.catch((err) => {
				console.log(err);
			});
		axios({
			method: 'get',
			url: `${baseurl.base_url}/mhere/get-ot-type`,
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((res) => {
				console.log(res);
				setOtList(res.data.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}

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
			alert('select correct');
		}
	};

	function downloadShiftType() {
		const wb = xlsx.utils.book_new();

		var data = {};

		axios({
			method: 'get',
			url: `${baseurl.base_url}/mhere/get-ot-type`,
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((res) => {
				data = res.data.data;
				axios({
					method: 'get',
					url: `${baseurl.base_url}/mhere/get-shift-type`,
					headers: {
						'Content-Type': 'application/json',
					},
				})
					.then((res) => {
						const ws = xlsx.utils.json_to_sheet(res.data.data);
						xlsx.utils.book_append_sheet(wb, ws, 'Shift Type');
						const ws1 = xlsx.utils.json_to_sheet(data);
						xlsx.utils.book_append_sheet(wb, ws1, 'Reward Type');
						xlsx.writeFile(wb, 'shift/ot type.xlsx');
					})
					.catch((err) => {
						console.log(err);
					});
			})
			.catch((err) => {
				console.log(err);
			});
	}
	function downloadDeviceMaster() {
		axios({
			method: 'get',
			url: `${baseurl.base_url}/mhere/get-device-master`,
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((res) => {
				const wb = xlsx.utils.book_new();
				const ws1 = xlsx.utils.json_to_sheet(res.data.data);
				xlsx.utils.book_append_sheet(wb, ws1, 'Device Master');
				xlsx.writeFile(wb, 'Device Master.xlsx');
			})
			.catch((err) => {
				toast.error('Error Downloding Device Master');
			});
	}

	return (
		<div className="navbar">
			<div className="navbar-main">
				<nav className="navbar-inner">
					<div className="navbar-logo">
						<img src={logo} className="navbar-logo" alt="" />
						<h2
							className="navbar-head"
							onClick={() => {
								navigate('/home');
							}}>
							CEAM
						</h2>
					</div>

					<div className="nav-items-main">
						<SlDropdown distance={5} className="nav-item">
							<SlButton className="nav-item-button" slot="trigger" caret>
								Download
							</SlButton>
							<SlMenu>
								<SlMenuItem
									onClick={() => {
										setSelectMonth(true);
										getShiftType();
									}}>
									Roster Template
								</SlMenuItem>
								<a href={template} download className="emp-temp-down-link">
									{' '}
									<SlMenuItem>Employee Template</SlMenuItem>
								</a>
								<a href={twodaystemplate} download className="emp-temp-down-link">
									{' '}
									<SlMenuItem>Two Days Roster Template</SlMenuItem>
								</a>
								<a href={regulartemplate} download className="emp-temp-down-link">
									{' '}
									<SlMenuItem>Regularize Template</SlMenuItem>
								</a>
								<SlMenuItem
									onClick={() => {
										downloadShiftType();
									}}>
									Shift/Reward Master
								</SlMenuItem>
								<SlMenuItem
									onClick={() => {
										downloadDeviceMaster();
									}}>
									Device Master
								</SlMenuItem>
							</SlMenu>
						</SlDropdown>
						<SlDropdown distance={5} className="nav-item">
							<SlButton className="nav-item-button" slot="trigger" caret>
								Manage
							</SlButton>
							<SlMenu>
								{/* <SlMenuItem onClick={()=>{
                     navigate("/plant-manage")
                }}>Manage Plant</SlMenuItem>
                <SlMenuItem onClick={()=>{
                     navigate("/approve-manage")
                }}>Manage Approver</SlMenuItem> */}
								<SlMenuItem
									onClick={() => {
										navigate('/employee-master');
									}}>
									Employee Management
								</SlMenuItem>
								{/* <SlMenuItem onClick={()=>{
                     navigate("/shift-master")
                }}>Shift/Reward Master</SlMenuItem> */}

								<SlMenuItem
									onClick={() => {
										navigate('/vendor-master');
									}}>
									Manage Vendor
								</SlMenuItem>
								{/*  <SlMenuItem onClick={()=>{
                     navigate("/dept-master")
                }}>Dept. Master</SlMenuItem> */}
							</SlMenu>
						</SlDropdown>

						<SlDropdown distance={5} className="nav-item">
							<SlButton className="nav-item-button" slot="trigger" caret>
								Services
							</SlButton>
							<SlMenu>
								<SlMenuItem
									onClick={() => {
										navigate('/');
									}}>
									Attendance Roster
								</SlMenuItem>
								<SlMenuItem
									onClick={() => {
										navigate('/ot-roster');
									}}>
									Reward Roster
								</SlMenuItem>
								{/*    <SlMenuItem onClick={()=>{
                     navigate("/plant-manage")
                }}>Manage Plant</SlMenuItem>
                <SlMenuItem onClick={()=>{
                     navigate("/approve-manage")
                }}>Manage Approver</SlMenuItem>
                <SlMenuItem onClick={()=>{
                     navigate("/employee-master")
                }}>Employee Management</SlMenuItem>
                <SlMenuItem onClick={()=>{
                     navigate("/shift-master")
                }}>Shift/OT Master</SlMenuItem> */}
								<SlMenuItem
									onClick={() => {
										navigate('/view-attendance');
									}}>
									View Attendance
								</SlMenuItem>
								{/*  <SlMenuItem onClick={()=>{
                      navigate("/vendor-master")
                  }}>Vendor Master</SlMenuItem> */}
								{/*  <SlMenuItem onClick={()=>{
                     navigate("/dept-master")
                }}>Dept. Master</SlMenuItem> */}
							</SlMenu>
						</SlDropdown>
						<SlDropdown distance={5} className="nav-item">
							<SlButton className="nav-item-button" slot="trigger" caret>
								Account
							</SlButton>
							<SlMenu>
								<SlMenuItem onclick={() => {}}>{localStorage.getItem('fullname')}</SlMenuItem>
								<SlMenuItem
									onclick={() => {
										localStorage.clear();
										navigate('/login');
									}}>
									LogOut
								</SlMenuItem>
							</SlMenu>
						</SlDropdown>
					</div>
				</nav>
			</div>
			<SlDialog label="Download Template" open={selectMonth} onSlRequestClose={() => setSelectMonth(false)}>
				<input
					onChange={(e) => {
						setDownMonth(e.target.value);
						console.log(e.target.value);
						let arr = e.target.value.split('-');
						console.log(arr);
						getDays(arr[0], arr[1]);
					}}
					className="month-picker-ceam-second"
					type="month"
					value={downMonth}
					name=""
					id=""
				/>
				<p style={{ marginTop: '20px' }}>
					Allowed Values for Shift :
					{shiftList?.map((item, i) => {
						return (
							<span id={`${i}shift`} style={{ fontWeight: 'bold' }}>
								{item.shift_character},{' '}
							</span>
						);
					})}
				</p>
				<p style={{ marginTop: '20px' }}>
					Allowed Values for Reward :
					{OtList?.map((item, i) => {
						return (
							<span id={`${i}shift`} style={{ fontWeight: 'bold' }}>
								{item.shift_character},{' '}
							</span>
						);
					})}
				</p>

				<SlButton
					style={{ marginRight: '20px' }}
					slot="footer"
					variant="success"
					onClick={() => {
						downloadTemplate();
					}}>
					<a style={{ textDecoration: 'none', color: 'white' }} href={href} download="Roster template">
						Download Roster
					</a>
				</SlButton>
				<SlButton slot="footer" variant="danger" onClick={() => setSelectMonth(false)}>
					Close
				</SlButton>
			</SlDialog>
		</div>
	);
}

export default Navbar;
