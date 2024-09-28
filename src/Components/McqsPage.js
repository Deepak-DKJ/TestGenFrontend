import React, { useContext, useEffect, useState } from "react";
import { TestContext } from "../Context/TestContext";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import FileUpload from "react-material-file-upload";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, Box, Typography, Grid } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";
import { Slide } from "@mui/material";
import axios from "axios";
import { CubeSpinner, SwapSpinner } from "react-spinners-kit";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";

import Alert from "@mui/material/Alert";


import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Select from "@mui/material/Select";
import NavBar from "./NavBar";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1d1d1d",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
    },
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #333",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        },
      },
    },
  },
});
const McqsPage = () => {
  const { inputData, baseUrl, setInputData, numOfQs, setNumOfQs } =
    useContext(TestContext);
  const navigate = useNavigate();
  const handleMyTests = () => {
    setInputData("");
    navigate("/testGenerator/mcqs/mytests");
  };
  const [aiMsg, setAiMsg] = useState("");
  const [file, setFile] = useState([]);
  const [maxRange, setMaxRange] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [read, setRead] = useState(false)
  const [genQsnsCount, setGenQsnsCount] = useState(0)
  const [alert, setAlert] = useState({
    vis: false,
    msg: "",
  });
  const [testTitle, setTestTitle] = useState("")
  const [openEditTest, setOpenEditTest] = useState(false);
  const handleOpenEditTest = () => {
    setOpenEditTest(true);
  };
  useEffect(() => {
    if(!localStorage.getItem('token'))
      navigate("/testGenerator/login")
  }, [])
  const [newTestId, setNewTestId] = useState("")

  const handleCloseEditTest = async () => {
    if (testTitle === "") {
      setAlert({
        vis: true,
        msg: "Please provide a title for the test!",
      });
      return
    }

    const data = {
      title: testTitle,
      qsCount: genQsnsCount,
      correctMarks: corAns,
      negMarks: wrgAns,
      duration: dur
    };
    let authToken = localStorage.getItem("token");
    // console.log(authToken);
    try {
      const response = await axios.put(`${baseUrl}/mcqs/updatetest/${newTestId}`, data, {
        headers: {
          Token: authToken, // Set the Authorization header with Bearer token
        },
      });
      const dat = response.data;
    }
    catch (err) {
      console.log("Error: ", err);
    }

    setOpenEditTest(false);
    handleMyTests();
  };

  const userData = JSON.parse(localStorage.getItem("userdata"))

  let name = "NA"
  if(userData)
    name =  userData.name

  const handleTextChange = (event) => {
    let str = event.target.value;
    str = str.trim();
    setInputData(str);
    // console.log(str.split('.'))
    let len = str.split(".").length;
    if (len > 10) {
      const rounded = Math.round(len / 10) * 5;
      setMaxRange(rounded);

      setNumOfQs(5 * Math.round(rounded / 5 / 2));
    }
  };

  const handleRangeChange = (event, value) => {
    setNumOfQs(value);
  };

  const handleGenMcqs = async () => {
    if (open === true) setOpen(false);
    if (inputData.length === 0) {
      setAlert({
        vis: true,
        msg: "Empty text. Please provide the input!",
      });
      return;
    }
    // generate MCQs logic
    try {
      setIsLoading(true);
      const data = {
        inp: inputData,
        qsns: numOfQs,
      };
      let authToken = localStorage.getItem("token");
      // console.log(authToken);
      const response = await axios.post(`${baseUrl}/mcqs/addtest`, data, {
        headers: {
          Token: authToken, // Set the Authorization header with Bearer token
          withCredentials: true,
          "Access-Control-Allow-Origin": "*", 
        },
      });
      const dat = response.data;
      setNewTestId(dat.test_id)
      const qsns = dat.qsns
      setGenQsnsCount(qsns)
      const halfCount = qsns / 2;
      // Find the nearest multiple of 5 using Math.round and adjust accordingly
      const testDuration = Math.round(halfCount / 5) * 5;
      setDur(testDuration)
      const btn = document.getElementById("savetest")
      if (btn)
        btn.click()
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log("Error: ", err);
      setIsLoading(false)
      setAiMsg(err.response.data.airesp);
      const btn = document.getElementById("infosnackbar");
      if (btn) btn.click();
    }
  };
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleReadFile = async () => {
    try {
      setRead(true)
      setIsLoading(true);
    //  console.log(file[0])
      let formData = new FormData();
      formData.append("pdfFile", file[0]);
      // console.log(formData)
      
      let authToken = localStorage.getItem("token");
      const response = await fetch(`${baseUrl}/mcqs/getfilecontent`, {
        method: 'POST',
        body: formData,
        headers: {
          'Token': authToken, // For custom headers like 'Token'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setInputData(data.data)
      // const dat = response.text();
      // console.log(data.data)
      setIsLoading(false);
      setRead(false)
    } catch (err) {
      setIsLoading(false);
      setRead(false)
      console.log("Error: ", err);
    }
  }
  const handlePaste = () => {
    navigator.clipboard.readText()
  .then(text => {
    setInputData(text)
  })
  .catch(err => {
    console.error('Failed to read clipboard contents: ', err);
  });
   
  }

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const handleTestTitleChange = (e) => {
    setTestTitle(e.target.value)
  }

  const [dur, setDur] = useState(30)
  const handleDurChange = (e) => {
    setDur(e.target.value)
  }

  const [corAns, setCorAns] = useState(4);
  const handleChangeCorAns = (event) => {
    setCorAns(event.target.value);
  };

  const [wrgAns, setWrgAns] = useState(1);
  const handleChangeWrgAns = (event) => {
    setWrgAns(event.target.value);
  };

  const styles = {
    sliderContainer: {
      width: "50%", // Adjust slider width
      margin: "10px auto", // Center the slider
    },
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      padding: "20px",
    },
    inputSection: {
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
      padding: "20px",
      marginBottom: "10px",
    },
    inputHalf: {
      flex: 1,
      margin: "0 20px",
      backgroundColor: "#2E2E2E",
      padding: "20px",
      borderRadius: "10px",
    },
    textField: {
      backgroundColor: "#3E3E3E",
      borderRadius: "10px",
    },
    uploadBox: {
      padding: "20px",
      borderRadius: "10px",
      border: "1px solid #555",
      backgroundColor: "#2E2E2E",
    },
    sliderSection: {
      width: "100%",
      textAlign: "center",
      marginBottom: "10px",
    },

    button: {
      marginLeft: "20px",
      padding: "15px 25px",
      fontSize: "18px",
      fontWeight: "bold",
      backgroundColor: "#4caf50", // Green color for the "My Tests" button
      color: "#fff",
      borderRadius: "28px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    myTestsButton: {
      padding: "15px 25px", // Add more padding to make it bigger
      fontSize: "18px", // Larger text
      fontWeight: "bold",
      backgroundColor: "#1976d2",
      color: "#fff",
      borderRadius: "28px", // Rounded corners
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
  };

  return (
    <>
      {isLoading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.7)", // Dark overlay with less opacity
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1300, // Ensure it overlays other elements
          }}
        >
          {read === true ? (
            <SwapSpinner size={50} color="cyan" />
          ) : (
             <CubeSpinner size={50} frontColor="cyan" />
          )}
         
        </Box>
      )}

      <Snackbar
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={alert.vis}
        onClose={() => {
          setAlert({
            vis: false,
            msg: "",
          });
        }}
        TransitionComponent={Slide}
        message={alert.msg}
      />
      <ThemeProvider theme={darkTheme}>
        <Button id="savetest" style={{ display: "none" }} variant="outlined" onClick={handleOpenEditTest}>
          Slide in alert dialog
        </Button>
        <Dialog
          maxWidth="xs"
          open={openEditTest}
          TransitionComponent={Transition}
          keepMounted
          // onClose={handleCloseEditTest}
          onClose={(event, reason) => {
            // Prevent dialog from closing when clicking outside
            if (reason !== "backdropClick") {
              handleCloseEditTest();
            }
          }}
          aria-describedby="alert-dialog-slide-description"
          // Customize the backdrop
          BackdropProps={{
            style: {
              backgroundColor: "rgba(0, 0, 0, 0.8)", // Darker backdrop
            },
          }}
        // aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>
            <Tooltip style={{ marginRight: "10px", marginBottom: '3px' }} title="Test Generated">
              <TaskAltIcon color='success' />
            </Tooltip>
            {`MCQs Generated : ${genQsnsCount}`}</DialogTitle>
          <DialogContent>
            <Box
              id="alert-dialog-slide-description"

            >
              <TextField
                style={{ marginTop: '6px' }}
                required
                fullWidth
                id="outlined-basic"
                label="Enter Test Title"
                value={testTitle}
                onChange={handleTestTitleChange}
                variant="outlined"
              />



              <TextField style={{ marginTop: '25px' }}
                fullWidth
                id="outlined-select-currency"
                select
                label="Marks for correct answer"
                value={corAns}
                onChange={handleChangeCorAns}
              // helperText="Please select your currency"
              >
                <MenuItem value={4}>Four</MenuItem>
                <MenuItem value={3}>Three</MenuItem>
                <MenuItem value={2}>Two</MenuItem>
              </TextField>


              <TextField style={{ marginTop: '25px' }}
                fullWidth
                id="outlined-select-currency"
                select
                label="Negative Marking" value={wrgAns}
                onChange={handleChangeWrgAns}
              // helperText="Please select your currency"
              >

                <MenuItem value={1}>One</MenuItem>
                <MenuItem value={2}>Two</MenuItem>
              </TextField>

              <TextField style={{ marginTop: '25px' }}
                fullWidth
                id="outlined-number"
                label="Test Duration (minutes)"
                type="number"
                value={dur}
                onChange={handleDurChange}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />

            </Box>
          </DialogContent>

          <DialogActions>
            <Button style={{ marginRight: '20px', marginBottom: '15px' }} variant="contained" color="success" onClick={handleCloseEditTest}>Save Test</Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>

      <Button
        id="infosnackbar"
        style={{ display: "none" }}
        onClick={handleClick}
      >
        Open Snackbar
      </Button>
      <Snackbar open={open} autoHideDuration={8000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="info"
          variant="filled"
          sx={{ width: "100%", color: "white" }}
        >
          AI's Response : {aiMsg}
        </Alert>
      </Snackbar>
      <>
        <NavBar />
      </>
      <Box sx={styles.container}>
        <Typography
          variant="h5"
          sx={{ marginBottom: "20px", color: "white" }}
        >
          Hello {name}, Welcome back !
        </Typography>

        {/* Input Section: Left (Text Input) and Right (File Upload) */}
        <Box sx={styles.inputSection}>
          {/* Left Half: TextField */}
          <Box sx={styles.inputHalf}>
            <Typography
              variant="h6"
              sx={{ color: "white", marginBottom: "10px" }}
            >
              Enter your text below & click on generate:
              <Button  sx={{ margin: "5px" }} variant="contained" size="small" color="primary" onClick={handlePaste}>
                Paste Text
              </Button>
              <Button sx={{ margin: "5px" }}  variant="contained" size="small" color="primary" onClick={() => setInputData("")}>
                Clear Text
              </Button>
            </Typography>
            <TextField
              id="outlined-multiline-static"
              label="Paste your text here!"
              multiline
              fullWidth
              rows={10}
              variant="outlined"
              value={inputData}
              onChange={handleTextChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: styles.textField.backgroundColor,
                  borderRadius: styles.textField.borderRadius,
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white",
                  },
                  "& textarea": {
                    color: "#ccc",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#ccc",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "white",
                },
              }}
            />
          </Box>

          {/* Right Half: File Upload */}
          <Box sx={styles.inputHalf}>
            <Typography
              variant="h6"
              sx={{ color: "white", marginBottom: "10px" }}
            >
              OR Upload a file:
            </Typography>
            <ThemeProvider theme={createTheme({ palette: { mode: "dark" } })}>
              <FileUpload
                value={file}
                onChange={setFile}
                sx={{
                  '& .MuiChip-icon': {
                    backgroundColor: '#2E2E2E',
                    color: 'red',
                  },
                  '& .MuiChip-deleteIcon': {
                    color: 'black',
                    '&:hover': {
                      color: 'black', // Keep the color black on hover
                    },
                  },
                }}
              />
               {/* <input type="file" onChange={handleFileChange} /> */}
             
              <Box sx={{textAlign:'center', marginTop:"10px"}}>
                {file && (file.length !== 0) && (
                  <Button variant="contained" color="primary" onClick={handleReadFile}>
                    Read Text
                  </Button>
                )}
              </Box>
            </ThemeProvider>
          </Box>
        </Box>

        {/* Slider Section */}
        <Box sx={styles.sliderSection}>
          <Typography variant="h6" sx={{ color: "white" }}>
            Please select the number of questions for the test :{" "}
            <span className="badge" style={{ backgroundColor: "green", border: '1px solid white' }}>{numOfQs}</span>
          </Typography>
          <Box sx={styles.sliderContainer}>
            <Slider
              aria-label="questions"
              value={numOfQs}
              valueLabelDisplay="auto"
              step={5}
              marks={true}
              min={5}
              color="white"
              max={maxRange}
              onChange={handleRangeChange}
            />
          </Box>
        </Box>

        {/* Button Section */}
        <Box sx={styles.buttonSection}>
          <Button
            color="success"
            style={styles.button}
            variant="contained"
            size="large"
            onClick={handleGenMcqs}
          >
            Generate Test
          </Button>
          <Button
            style={styles.myTestsButton}
            variant="contained"
            size="large"
            sx={{ marginLeft: "20px" }}
            onClick={handleMyTests}
          >
            My Tests
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default McqsPage;
