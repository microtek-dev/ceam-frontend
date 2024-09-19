import {
  Backdrop,
  Box,
  Button,
  Fade,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import "./index.css";
import { SlInput } from "@shoelace-style/shoelace";
import axios from "axios";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { colors } from "@mui/material";
import { blacklistHeaders, modalStyle } from "../../utils/constants";
import Typography from "@mui/material/Typography";
import { TextareaAutosize } from "@mui/material";
import { useHref } from "react-router-dom";
const BlacklistEmployee = () => {
  const fetchAadharData = async (aadharCardNumber) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/mhere/get-employee-by-aadhar`,
      { aadhar_card_number: aadharCardNumber }
    );
    return response.data;
  };
  const [verifyAadhar, setVerifyAadhar] = useState("");
  const [verifyAadharData, setVerifyAadharData] = useState(null);
  const [reason, setReason] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { mutate, isLoading, data, error } = useMutation({
    mutationFn: fetchAadharData,
    onSuccess: (data) => {
      setVerifyAadharData(data?.data);
      console.log(data);
      toast.success(data?.message);
    },
    onError: (error) => {
      console.error(error);
      toast.error(error?.response?.data?.message);
    },
  });
  const verifyAadharHandler = () => {
    mutate(verifyAadhar);
  };
  // console.log(verifyAadharData);
  const rows = [
    verifyAadharData?.employee_id,
    verifyAadharData?.employee_name,
    verifyAadharData?.vendor_code,
    verifyAadharData?.vendor_name,
    verifyAadharData?.gender == "M" ? "Male" : "Female",
    verifyAadharData?.base_location,
    verifyAadharData?.mobile_number,
    verifyAadharData?.DOL,
    verifyAadharData?.blacklistEmployee == 1 ? "Yes" : "No",
    verifyAadharData?.reason,
  ];
  const downloadBlacklistBulk = async () => {
    try {
      const response = await axios({
        url: `${
          import.meta.env.VITE_API_URL
        }/mhere/download-blacklisted-employees`, // Replace with your API URL
        method: "GET",
        responseType: "blob", // Important: Set the response type to 'blob'
      });
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create a URL for the Blob and open it in a new tab
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");

      // Clean up the URL object
      window.URL.revokeObjectURL(url);

      toast.success("Downloaded Successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const blacklistEMployeeHandler = async () => {
    try {
      const data = await axios.post(
        `${import.meta.env.VITE_API_URL}/mhere/making-blacklist-employee`,
        {
          reason,
          employee_id: verifyAadharData?.employee_id,
          blacklisted_by: localStorage.getItem("employee_id"),
        }
      );
      setReason("");
      handleClose();
      setVerifyAadharData("");
      toast.success(data.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="main">
      <div className="blacklist-main">
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            gap: "10px",
            marginBottom: "10px",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", gap: "10px" }}>
            <TextField
              id="standard-multiline-flexible"
              placeholder="Enter Aadhar number"
              label="Verify Employee Status"
              onChange={(e) => setVerifyAadhar(e.target.value)}
              value={verifyAadhar}
              maxRows={4}
              variant="standard"
            />

            {verifyAadharData ? (
              <Button
                variant="contained"
                onClick={() => {
                  setVerifyAadharData(null);
                  setVerifyAadhar("");
                }}
                sx={{ marginTop: "1rem" }}
                color="error"
              >
                Clear
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={verifyAadharHandler}
                sx={{ marginTop: "1rem" }}
                disabled={isLoading || verifyAadhar.length === 0}
              >
                {isLoading ? "Verifying..." : "Verify Aadhar"}
              </Button>
            )}
          </Box>
          {error && <p>Error: {error.message}</p>}
          <Button variant="contained" onClick={downloadBlacklistBulk}>
            Download Blacklisted Employees Report
          </Button>
        </Box>
      </div>
      {/* <pre>
        {verifyAadharData && (
          <pre>{JSON.stringify(verifyAadharData, null, 2)}</pre>
        )}
      </pre> */}
      {verifyAadharData && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {blacklistHeaders?.map((header) => (
                  <TableCell key={header}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {rows?.map((row, i) => (
                  <TableCell
                    style={{ maxWidth: 150 }}
                    component="th"
                    scope="row"
                    key={i}
                  >
                    {row}
                  </TableCell>
                ))}
                <TableCell>
                  <Button
                    variant="contained"
                    // color="error"
                    sx={{ borderRadius: "100px", marginTop: "0.5rem" }}
                    disabled={
                      verifyAadharData?.blacklistEmployee == 1 ? true : false
                    }
                    onClick={handleOpen}
                  >
                    Ok
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={modalStyle}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Enter Details
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginTop: "1rem",
              }}
            >
              <TextField
                label="Done By"
                value={localStorage.getItem("employee_id")}
                disabled
              />
              <TextField
                label="Employee id"
                value={verifyAadharData?.employee_id}
                disabled
              />
              <TextField
                label="Enter Reason"
                value={reason}
                placeholder="Reason should be more than 5 characters"
                onChange={(e) => setReason(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={blacklistEMployeeHandler}
                sx={{ borderRadius: "100px", marginTop: "0.5rem" }}
                disabled={reason?.length > 5 ? false : true}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default BlacklistEmployee;
