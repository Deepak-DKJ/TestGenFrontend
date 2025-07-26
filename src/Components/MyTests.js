import React, { useContext, useEffect, useRef, useState } from 'react';
import { TestContext } from '../Context/TestContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Button, Box, Typography, Grid, Alert } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import { useNavigate } from 'react-router-dom'
import { Slide } from '@mui/material';
import axios from 'axios'
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LinearProgress from '@mui/material/LinearProgress';

import { PieChart } from '@mui/x-charts/PieChart';


import {
    Badge, Card, CardContent, CardActions, Divider, DialogActions, DialogContentText, DialogContent, DialogTitle, Dialog
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import NavBar from './NavBar';


const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#121212',
            paper: '#2E2E2E',
        },
        text: {
            primary: '#ffffff',
            secondary: '#b0b0b0',
        },
        primary: {
            main: '#90caf9',
        },
        secondary: {
            main: '#f48fb1',
        },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    border: '1px solid #333',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                },
            },
        },
    },
});
function capitalizeFirstLetter(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const MyTests = () => {

    const [testData, setTestData] = useState([])
    const { baseUrl } = useContext(TestContext);
    const navigate = useNavigate()
    useEffect(() => {
        if (!localStorage.getItem('token'))
            navigate("/testGenerator/login")
        const fetch_data = async () => {
            setShowProgress(true)
            try {
                // console.log("READY")
                let authToken = localStorage.getItem('token')
                // console.log(authToken)
                const response = await axios.get(`${baseUrl}/mcqs/getalltests`, {
                    headers: {
                        Token: authToken, // Set the Authorization header with Bearer token
                    },
                });
                const dat = response.data
                setTestData(dat)
                // setShowProgress(false)
            }
            catch (err) {
                console.log(err)
                // setShowProgress(false)
            }
        }

        fetch_data();
    }, [])

    const handleTestDelete = async () => {
        if (!selectedTestId) return;

        // Close the dialog
        handleCloseDialog();

        setShowProgress(true)
        setTestData((prevTests) => prevTests.filter((test) => test.testId !== selectedTestId));
        try {
            let authToken = localStorage.getItem('token');
            const response = await axios.delete(
                `${baseUrl}/mcqs/deletetest/${selectedTestId}`,
                {
                    headers: {
                        Token: authToken,
                    },
                }
            );

            setSelectedTestId(null);

            if (response.status === 200) {
                // console.log('Test deleted successfully on the server');
                setAlert({
                    "vis": true,
                    "msg": "Test deleted successfully !"
                })
            } else {
                console.error('Failed to delete test from the server');
                setAlert({
                    "vis": true,
                    "msg": "Failed to delete test !"
                })

            }
            setShowProgress(false)
        } catch (error) {
            console.error('Error deleting test:', error);

            // Revert state update if the API call fails
            setTestData((prevTests) => [...prevTests, testData.find((test) => test.testId === selectedTestId)]);
            setShowProgress(false)
        }
    }

    const [selectedTestId, setSelectedTestId] = useState(null);
    const [open, setOpen] = useState(false);
    const [openStartTest, setOpenStartTest] = useState(false)
    const [openScoreCard, setOpenScoreCard] = useState(false)
    const handleOpenScoreCard = (id) => {
        setOpenScoreCard(true);
    };
    const handleCloseScoreCard = () => {
        setOpenScoreCard(false)
    }
    // Open confirmation dialog and set selected test ID
    const handleOpenDialog = (id) => {
        setSelectedTestId(id);
        setOpen(true);
    };
    const handleOpenTestDialog = (id) => {
        setSelectedTestId(id);
        setOpenStartTest(true)
    }
    const handleCloseStartTestDialog = () => {
        setOpenStartTest(false)
    }
    const [showProgress, setShowProgress] = useState(false)

    // Close the dialog
    const handleCloseDialog = () => {
        setOpen(false);
        setSelectedTestId(null);
    };
    const handleLauchTest = () => {
        handleCloseStartTestDialog();

        window.open(`/testGenerator/mcqs/mytests/${selectedTestId}`, '_blank');
    }


    const [alert, setAlert] = useState({
        "vis": false,
        "msg": ""
    })
    const [curTest, setCurTest] = useState(null)
    const handleReport = (test) => {
        // console.log(test)
        setCurTest(test)

        handleOpenScoreCard()
    }

    return (
        <>
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
            >
                <Alert
                    severity="info"
                    variant="filled"
                    sx={{
                        width: "100%",
                        color: "#fff",
                        bgcolor: "#222",
                        border: "1px solid #333",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                        fontWeight: 500,
                    }}
                >
                    {alert.msg}
                </Alert>
            </Snackbar>

            <>
                <NavBar PAGE={"Dashboard"} />
            </>

            {testData.length === 0 ? (
                <>
                    {(showProgress) ? (
                        <Box sx={{ width: '100%', marginTop: "20px" }}>
                            <LinearProgress />
                        </Box>
                    ) : (
                        <Box sx={{ width: '100%', textAlign: 'center', marginTop: "30px" }}>
                            <h4>No saved tests found !</h4>
                        </Box>

                    )}
                </>
            ) : (<ThemeProvider theme={darkTheme}>

                <Box sx={{ padding: '20px', marginTop: "10px" }}>
                    <Grid container spacing={3} justifyContent={"center"}>
                        {testData.map((test, index) => (
                            <Grid
                                item
                                xs={12}
                                sm={5}
                                md={4}
                                lg={4.5}
                                sx={{
                                    // marginLeft: index % 2 === 0 ? '10%' : '5%', // Add left padding for left-side cards
                                    // marginRight: index % 2 !== 0 ? '10%' : '0', // Add right padding for right-side cards
                                    marginBottom: '10px', // Space between rows
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                                key={index}
                            >
                                <Card
                                    variant="outlined"
                                    sx={{ height: '100%', borderRadius: "10px", display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                                >
                                    <CardContent>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: { xs: 'column', sm: 'row' },
                                                justifyContent: 'space-between',
                                                alignItems: { xs: 'stretch', sm: 'center' },
                                                bgcolor: '#2E2E2E', // background for dark mode
                                                padding: 0,
                                                // gap:1
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                                                {test.score.split("/")[0] === "NA" ? (
                                                    <Tooltip title="Status: Incomplete">
                                                        <AccessTimeIcon sx={{ color: "orange" }} />
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip title="Status: Completed">
                                                        <TaskAltIcon sx={{ color: "#1FBC0E" }} />
                                                    </Tooltip>
                                                )}
                                                <Typography
                                                    variant="h6"
                                                    noWrap // Prevents text from wrapping
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        color: 'text.primary',
                                                        // These styles ensure long text is handled gracefully
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    {capitalizeFirstLetter(test.title)}
                                                </Typography>
                                            </Box>

                                            {/* Right side: Badges and Delete Icon */}
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    // On mobile, space out the badges and icon. On desktop, group them.
                                                    justifyContent: { xs: 'space-between', sm: 'flex-end' },
                                                    gap: 1,
                                                }}
                                            >
                                                {/* Group the badges together */}
                                               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
    <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', color: '#ccc', fontSize:"14px" }}>
        Correct&nbsp;
        <Tooltip title="Marks for correct answer">
            <span className="badge" style={{ fontSize: "14px", backgroundColor: "", color: '#4CAF50', padding: '0px 0px', borderRadius: '12px' }}>{`+${test.correctAnswerPoints}`}</span>
        </Tooltip>
    </Typography>
    <Typography cvariant='body2' sx={{ display: 'flex', alignItems: 'center', color: '#ccc' , fontSize:"14px"}}>
        Wrong&nbsp;
        <Tooltip title="Negative marking for wrong answer">
            <span className="badge" style={{ fontSize: "14px", backgroundColor: "", color: '#F44336', padding: '0px 0px', borderRadius: '12px' }}>{`-${test.negativeMarking}`}</span>
        </Tooltip>
    </Typography>
</Box>

                                                <Tooltip title="Delete this test">
                                                    <IconButton
                                                        aria-label="delete"
                                                        onClick={() => handleOpenDialog(test.testId)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </Box>


                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 0 }}>
                                            <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', color: "text.secondary" }}>
                                                Total Questions&nbsp; <strong style={{ color: "white" }}>{test.totalQuestions}</strong>
                                            </Typography>
                                            <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', color: "text.secondary" }}>
                                                Test Duration&nbsp; <strong style={{ color: "white" }}>{test.testDuration} mins</strong>
                                            </Typography>
                                            <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', color: "text.secondary" }}>
                                                Score&nbsp; <strong style={{ color: "white" }}>{test.score}</strong>
                                            </Typography>
                                        </Box>
                                        <Divider
                                            sx={{
                                                marginY: 2,
                                                borderColor: 'white', // Adjust color for better visibility (white with some transparency for dark theme)
                                                borderWidth: '1.5px', // Increase thickness
                                                borderStyle: 'solid', // Solid line style; you can also try 'dashed' or 'dotted' for a different effect
                                            }}
                                        />
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            {test.description}
                                        </Typography>

                                    </CardContent>
                                    <CardActions sx={{ justifyContent: 'space-between', padding: '16px', marginBottom: '7px' }}>
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                            Created On: <strong style={{ color: "white" }}>{test.createdOn}</strong>
                                        </Typography>
                                        <Box>
                                            {test.score.split("/")[0] !== "NA" && (
                                                <Button variant="contained" onClick={() => handleReport(test)} color="primary" sx={{ marginRight: 2 }}>
                                                    Score Card
                                                </Button>
                                            )}
                                            <Button variant="contained" color="primary" onClick={() => { if (test.score.split("/")[0] !== "NA") window.open(`/testGenerator/mcqs/mytests/${test.testId}`, '_blank'); else handleOpenTestDialog(test.testId) }}>
                                                {test.score.split("/")[0] === "NA" ? "Start Test" : "Review Test"}
                                            </Button>
                                        </Box>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Dialog
                        open={open}
                        onClose={handleCloseDialog}
                        aria-labelledby="confirm-dialog-title"
                        aria-describedby="confirm-dialog-description"

                        TransitionComponent={Slide}
                    >
                        <DialogTitle id="confirm-dialog-title">Delete Test</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="confirm-dialog-description">
                                Are you sure you want to delete this test? This action cannot be undone.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleTestDelete} color="secondary" autoFocus>
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        open={openStartTest}
                        onClose={handleCloseStartTestDialog}
                        aria-labelledby="confirm-dialog-title"
                        aria-describedby="confirm-dialog-description"

                        TransitionComponent={Slide}
                    >
                        <DialogTitle id="confirm-dialog-title">Launch Test</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="confirm-dialog-description">
                                Do you want to start this test now?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseStartTestDialog} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleLauchTest} color="success" autoFocus>
                                Yes
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {curTest && (
                        <Dialog
                            open={openScoreCard}
                            onClose={handleCloseScoreCard}
                            aria-labelledby="confirm-dialog-title"
                            aria-describedby="confirm-dialog-description"
                            TransitionComponent={Slide}
                        >
                            <DialogTitle className='text-center' id="confirm-dialog-title">
                                Report Summary - {curTest && curTest.title}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="confirm-dialog-description">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>

                                        <div style={{ flex: 6, display: 'flex', justifyContent: 'center', position: 'relative' }}>
                                            <PieChart
                                                series={[{
                                                    innerRadius: "80%", // Creates the gap for the text
                                                    data: [
                                                        { id: 0, value: (curTest.scorecard.selfscore / curTest.scorecard.totalscore) * 100, color: 'cyan' },
                                                        { id: 2, value: 100 - (curTest.scorecard.selfscore / curTest.scorecard.totalscore) * 100, color: 'grey' },
                                                    ],
                                                }]}
                                                width={260}
                                                height={260}
                                            />

                                            {/* Centered Text */}
                                            <div style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-120%, -52%)',  // Centers the text inside the PieChart
                                                textAlign: 'center',
                                                color: 'white',
                                            }}>
                                                <Typography variant="h6" component="div" style={{ color: 'white' }}>
                                                    {`${((curTest.scorecard.selfscore / curTest.scorecard.totalscore) * 100).toFixed(1)}%`}
                                                </Typography>
                                                <Typography variant="caption" component="div" style={{ color: 'grey' }}>
                                                    Total Score
                                                </Typography>
                                            </div>
                                        </div>

                                        {/* Legend */}
                                        <div style={{ flex: 4 }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <div style={{ width: '16px', height: '16px', backgroundColor: 'cyan', marginRight: '10px' }}></div>
                                                    <Typography variant="subtitle2" sx={{ fontSize: '1rem', color: "text.secondary" }}>
                                                        Marks Scored: <strong style={{ color: "white" }}>{curTest.scorecard.selfscore}</strong>
                                                    </Typography>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <div style={{ width: '16px', height: '16px', backgroundColor: 'grey', marginRight: '10px' }}></div>
                                                    <Typography variant="subtitle2" sx={{ fontSize: '1rem', color: "text.secondary" }}>
                                                        Total Marks: <strong style={{ color: "white" }}>{curTest.scorecard.totalscore}</strong>
                                                    </Typography>
                                                </div>
                                            </Box>
                                        </div>
                                    </div>

                                    {/* Below section */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        {/* Left: Pie chart */}
                                        <div style={{ flex: 1.5, display: 'flex', justifyContent: 'center', marginLeft: '20px' }}>
                                            <PieChart
                                                series={[{
                                                    innerRadius: "0%",
                                                    arcLabel: (item) => `${((item.value / (curTest.totalQuestions)) * 100).toFixed(1)}%`,
                                                    arcLabelMinAngle: 15,
                                                    arcLabelRadius: '60%',

                                                    data: [
                                                        { id: 0, value: curTest.scorecard.correct, color: 'green' },
                                                        { id: 1, value: curTest.scorecard.wrong, color: 'red' },
                                                        { id: 2, value: (curTest.totalQuestions - curTest.scorecard.correct - curTest.scorecard.wrong), color: 'grey' },
                                                    ],
                                                }]}
                                                width={260}
                                                height={260}
                                            />
                                        </div>

                                        {/* Right: Legend for the Pie chart */}
                                        <div style={{ flex: 2, marginRight: '30px' }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <div style={{ width: '16px', height: '16px', backgroundColor: 'green', marginRight: '10px' }}></div>
                                                    <Typography variant="subtitle2" sx={{ fontSize: '1rem', color: "text.secondary" }}>
                                                        Correct Answers: <strong style={{ color: "white" }}>{curTest.scorecard.correct}</strong>
                                                    </Typography>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <div style={{ width: '16px', height: '16px', backgroundColor: 'red', marginRight: '10px' }}></div>
                                                    <Typography variant="subtitle2" sx={{ fontSize: '1rem', color: "text.secondary" }}>
                                                        Wrong Answers: <strong style={{ color: "white" }}>{curTest.scorecard.wrong}</strong>
                                                    </Typography>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <div style={{ width: '16px', height: '16px', backgroundColor: 'grey', marginRight: '10px' }}></div>
                                                    <Typography variant="subtitle2" sx={{ fontSize: '1rem', color: "text.secondary" }}>
                                                        Unanswered: <strong style={{ color: "white" }}>{curTest.totalQuestions - curTest.scorecard.correct - curTest.scorecard.wrong}</strong>
                                                    </Typography>
                                                </div>
                                            </Box>
                                        </div>
                                    </div>



                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseScoreCard} color="secondary" autoFocus>
                                    Close
                                </Button>
                            </DialogActions>
                        </Dialog>
                    )}


                </Box>
            </ThemeProvider>)}

        </>
    )
}

export default MyTests
