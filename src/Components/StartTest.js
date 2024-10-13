
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
// import { TestContext } from '../Context/TestContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

import React, { useRef } from 'react';
import { TestContext } from '../Context/TestContext';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import FileUpload from 'react-material-file-upload';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
// import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
// import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import { useNavigate } from 'react-router-dom'
import { Slide, Divider, DialogActions, DialogContentText, DialogContent, DialogTitle, Dialog } from '@mui/material';
// import axios from 'axios'
// import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LinearProgress from '@mui/material/LinearProgress';


import { Box, Button, Typography, Grid, Card, CardContent, IconButton, Tooltip } from '@mui/material';
import NavBar from './NavBar';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const StartTest = () => {
    let { test_id } = useParams()
    const [test, setTest] = useState(null)
    const { baseUrl } = useContext(TestContext);
    const navigate = useNavigate()
    useEffect(() => {
        if(!localStorage.getItem('token'))
          navigate("/testGenerator/login")
      }, [])

    const [answeredList, setAnsweredList] = useState([])

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [reviewList, setReviewList] = useState([]);
    const [openStartTest, setOpenStartTest] = useState(false)
    const handleCloseStartTestDialog = () => {
        setOpenStartTest(false)
    }
    const handleOpenTestDialog = (dialog) => {
        if (dialog === "End")
            setDia(dialog)
        else if (dialog === "Submit")
            setDia(dialog)
        setOpenStartTest(true)
    }

    const handleOptionChange = (optionIndex) => {

        setAnsweredList(prevList => {
            if (!(prevList.includes(currentQuestionIndex))) {
                return [...prevList, currentQuestionIndex];
            }
            return prevList;
        });
        setTest(prevTest => {
            // Create a new copy of the questions array
            const updatedQuestions = [...prevTest.questions];

            // Update the response for the current question
            updatedQuestions[currentQuestionIndex] = {
                ...updatedQuestions[currentQuestionIndex],
                response: optionIndex
            };

            // Return the updated test object
            return {
                ...prevTest,
                questions: updatedQuestions
            };
        });
        // console.log(test.questions[currentQuestionIndex])
    };

    const handleNext = () => {
        let val = currentQuestionIndex
        setCurrentQuestionIndex(val + 1)
    }
    const handlePrevious = () => {
        let val = currentQuestionIndex
        setCurrentQuestionIndex(val - 1)
    }
    const handleNavigateButton = (qsNum) => {
        setCurrentQuestionIndex(qsNum)
    }
    const [alert, setAlert] = useState({
        vis: false,
        msg: "",
    });
    const handleClearResponse = () => {
        setTest(prevTest => {
            // Create a new copy of the questions array
            const updatedQuestions = [...prevTest.questions];

            // Clear the response for the current question by setting it to -1
            updatedQuestions[currentQuestionIndex] = {
                ...updatedQuestions[currentQuestionIndex],
                response: -1
            };

            // Return the updated test object
            return {
                ...prevTest,
                questions: updatedQuestions
            };
        });
    };

    const handleMarkforReview = () => {
        setReviewList(prevList => {
            if (prevList.includes(currentQuestionIndex)) {
                // Remove the idNumber if it's already in the review list
                return prevList.filter(item => item !== currentQuestionIndex);
            } else {
                // Add the idNumber to the review list
                return [...prevList, currentQuestionIndex];
            }
        });
    };

    const [dia, setDia] = useState("Submit")
    const handleSubmit = async () => {
        if (dia === "End") {
            navigate('/testGenerator/mcqs/mytests')
            return
        }
        // console.log(test)

        let correctCount = 0;
        let wrongCount = 0;

        for (const ind in test.questions) {
            const ans = test.questions[ind]["correct_answer"]
            const res = test.questions[ind]["response"]
            if (res === -1)
                continue
            if (ans === res)
                correctCount++;
            else wrongCount++;
        }

        let score = (test.crtAnswer * correctCount) - (test.negMarking * wrongCount);
        if(score < 0)
            score = 0
        const data = {
            "updatedQuestionsList": test.questions,
            "testScore": score,
            "correctQsns": correctCount,
            "wrongQsns": wrongCount
        }

        let authToken = localStorage.getItem("token");

        try {
            const response = await axios.put(`${baseUrl}/mcqs/updatetest/${test_id}`, data, {
                headers: {
                    Token: authToken, // Set the Authorization header with Bearer token
                },
            });
            const dat = response.data;
            // console.log(dat)
        }
        catch (err) {
            console.log("Error: ", err);
        }
        handleCloseStartTestDialog();
        navigate("/testGenerator/mcqs/mytests")
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                let authToken = localStorage.getItem('token');

                const response = await axios.get(
                    `${baseUrl}/mcqs/gettest/${test_id}`,
                    {
                        headers: {
                            Token: authToken,
                        },
                    }
                );
                setTest(response.data.testDetails)
                if (response.data.testDetails.score === -1000)
                    setAlert({
                        vis: true,
                        msg: "The test has started. All the best!",
                    });
                // console.log(response.data.testDetails)
            }
            catch (error) {
                console.error('Error deleting test:', error);
            }
        }

        fetchData();
    }, [test_id])

    const handleOn = () => {

    }

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
            background: {
                default: '#121212',
                paper: '#1d1d1d',
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

    return (
        <>
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
                    message={alert.msg}
                    sx={{
                        marginBottom: '70px',
                    }}
                />
                <ThemeProvider theme={darkTheme}>
                    <Dialog
                        open={openStartTest}
                        onClose={handleCloseStartTestDialog}
                        aria-labelledby="confirm-dialog-title"
                        aria-describedby="confirm-dialog-description"
                    >
                        <DialogTitle id="confirm-dialog-title">{dia} Test</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="confirm-dialog-description">
                                {dia === "Submit" && "Do you want to submit the responses & end test?"}
                                {dia === "End" && "Do you want to end the test? Your progress will be reset"}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseStartTestDialog} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit} color={dia === "Submit" ? "success" : "secondary"} autoFocus>
                                Yes
                            </Button>
                        </DialogActions>
                    </Dialog>
                </ThemeProvider>
               <NavBar PAGE="started"/>
            </>
            {test && (
                <div className='main'>
                    <div className="container mt-4">
                        <div className="row">
                            <div className="col-md-9" style={{ marginTop: "0px" }}>

                                <h4 style={{ textAlign: 'center' }}>MCQs Test : {test.testTitle}</h4>
                                <div className="card p-4 border-light text-light" style={{ borderRadius: '22px', backgroundColor: '#2E2E2E', marginTop: '20px' }}>
                                    {/* Outer Card for Question and Options */}
                                    {test && (
                                        <div>
                                            {/* Question Header */}
                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <h5 className="mb-4">
                                                        Question {currentQuestionIndex + 1} out of {(test.questions).length}

                                                    </h5>
                                                </div>
                                                <div>
                                                    {reviewList.includes(currentQuestionIndex) && (
                                                        <span style={{ marginLeft: '20px', fontSize: '18px' }}>
                                                            <span className="badge text-bg-secondary"><strong>Flagged for review</strong></span>
                                                        </span>
                                                    )}
                                                    {test.score !== -1000 && (
                                                        <span style={{ fontSize: '20px' }}>
                                                            <span className={`badge text-bg-${test.questions[currentQuestionIndex]["response"] === test.questions[currentQuestionIndex]["correct_answer"] ? "success" : test.questions[currentQuestionIndex]["response"] === -1 ? "secondary" : "danger"}`}><strong>{(test.questions[currentQuestionIndex]["response"] === test.questions[currentQuestionIndex]["correct_answer"]) ? "You answer is correct!" : (test.questions[currentQuestionIndex]["response"] === -1 ? "Unanswered Question!" : "Your answer is wrong!")}</strong></span>
                                                        </span>
                                                    )}
                                                    <span style={{ marginLeft: '20px', fontSize: '15px' }}>
                                                        Correct Answer <span className="rounded-pill badge text-bg-success"><strong>+{test.crtAnswer}</strong></span>
                                                    </span>
                                                    <span style={{ marginLeft: '15px', fonsstSize: '15px' }}>
                                                        Negative Marking <span className="rounded-pill badge text-bg-danger"><strong>-{test.negMarking}</strong></span>
                                                    </span>
                                                </div>
                                            </div>

                                            <Divider
                                                sx={{
                                                    marginY: 3,
                                                    marginTop: '0px',
                                                    borderColor: 'white', // Adjust color for better visibility (white with some transparency for dark theme)
                                                    borderWidth: '1.5px', // Increase thickness
                                                    borderStyle: 'solid', // Solid line style; you can also try 'dashed' or 'dotted' for a different effect
                                                }}
                                            />


                                            <h5 id={currentQuestionIndex} className="">{test.questions[currentQuestionIndex]["question"]}</h5>

                                            {/* Options Layout */}
                                            <div className="row">
                                                {Object.values(test.questions[currentQuestionIndex]["options"]).map((option, index) => (
                                                    <div className="col-6 d-flex align-items-stretch" key={index} style={{ padding: "10px" }}>
                                                        <div
                                                            className="form-check option-card p-3 w-100"
                                                            onClick={() => handleOptionChange(index + 1)}
                                                            style={{
                                                                transition: '0.4s',
                                                                border:
                                                                    test.questions[currentQuestionIndex]["response"] === index + 1
                                                                        ? '2px solid black'
                                                                        : '2px solid transparent',
                                                                // backgroundColor:
                                                                //     test.questions[currentQuestionIndex]["response"] === index + 1
                                                                //         ? 'cyan'
                                                                //         : '#2E2E2E',
                                                                backgroundColor:
                                                                    test.score === -1000
                                                                        ? (test.questions[currentQuestionIndex]["response"] === index + 1
                                                                            ? 'cyan'
                                                                            : '#2E2E2E')
                                                                        : (
                                                                            test.questions[currentQuestionIndex]["response"] === test.questions[currentQuestionIndex]["correct_answer"]
                                                                                ? (test.questions[currentQuestionIndex]["correct_answer"] === index + 1 ? 'cyan' : '#2E2E2E')
                                                                                : (
                                                                                    test.questions[currentQuestionIndex]["response"] === index + 1
                                                                                        ? 'cyan'
                                                                                        : (
                                                                                            test.questions[currentQuestionIndex]["correct_answer"] === index + 1
                                                                                                ? 'green'
                                                                                                : '#2E2E2E'
                                                                                        )
                                                                                )
                                                                        ),
                                                                borderRadius: '20px',
                                                                cursor: 'pointer',
                                                                height: '100%',
                                                                pointerEvents: test.score !== -1000 && 'none'
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                if (test.questions[currentQuestionIndex]["response"] !== index + 1) {
                                                                    e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.5)';
                                                                    e.currentTarget.style.backgroundColor = '#3E3E3E';
                                                                }
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                if (test.questions[currentQuestionIndex]["response"] !== index + 1) {
                                                                    e.currentTarget.style.border = '2px solid transparent';
                                                                    e.currentTarget.style.backgroundColor = '#2E2E2E';
                                                                }
                                                            }}
                                                        >
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name={`question-${currentQuestionIndex}`}
                                                                id={`option-${option}`}
                                                                checked={test.questions[currentQuestionIndex]["response"] === index + 1}
                                                                style={{ display: 'none' }}
                                                                readOnly={test.score !== -1000}
                                                                onChange={handleOn}
                                                            />
                                                            <label
                                                                className="form-check-label w-100 h-100 d-flex align-items-center justify-content-center"
                                                                htmlFor={`option-${option}`}
                                                                style={{
                                                                    padding: '10px',
                                                                    borderRadius: '8px',
                                                                    transition: '0.3s',
                                                                    cursor: 'pointer',
                                                                    color: test.questions[currentQuestionIndex]["response"] === index + 1 ? 'black' : 'white',
                                                                }}
                                                            >
                                                                {option}
                                                            </label>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                    )}
                                </div>


                                <div className="card mx-auto" style={{ maxWidth: test.score === -1000 ? "75%" : "25%", backgroundColor: '#2E2E2E', padding: "13px", borderRadius: "20px", marginTop: '40px' }}>

                                    <div className="d-flex justify-content-between">
                                        <div
                                            style={{ display: test.score !== -1000 ? "none" : "block" }}>
                                            <button
                                                className="btn btn-outline-light mx-2"
                                                onClick={handleClearResponse}
                                                style={{ borderRadius: '12px' }}
                                                disabled={(test.questions[currentQuestionIndex].response) === -1}
                                            >
                                                Clear Response
                                            </button>

                                            <button
                                                className="btn btn-outline-light mx-2"
                                                onClick={handleMarkforReview}
                                                style={{ borderRadius: '12px' }}
                                            >
                                                Mark/Unmark for Review
                                            </button>
                                        </div>

                                        <div>
                                            <button
                                                className="btn btn-secondary mx-2"
                                                onClick={handlePrevious}
                                                style={{ borderRadius: '12px' }}
                                                disabled={currentQuestionIndex === 0}
                                            >
                                                Previous
                                            </button>
                                            <button
                                                className="btn btn-secondary mx-2"
                                                onClick={handleNext}
                                                style={{ borderRadius: '12px' }}
                                                disabled={currentQuestionIndex === (test.questions).length - 1}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* Right part */}
                            <div className="col-md-3" style={{ marginTop: '2px' }}>


                                <Grid item xs={4}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', marginTop: '0px' }}>
                                        {/* Timer */}
                                        <CountdownCircleTimer
                                            isPlaying
                                            duration={test.score !== -1000 ? (0) : (test.testDuration * 60)}
                                            colors={['cyan', 'red']}
                                            colorsTime={[120, 0]}
                                            size={160}
                                            strokeWidth={9}
                                            trailStrokeWidth={9}
                                            // strokeLinecap={"butt"}
                                            onComplete={() => {
                                                handleSubmit(); // Call handleSubmitTest when timer ends
                                                return { shouldRepeat: false }; // Do not repeat the timer
                                            }}
                                        >
                                            {({ remainingTime }) => {
                                                if (remainingTime === 120) {
                                                    setAlert({
                                                        vis: true,
                                                        msg: "Please hurry up! Only 2 minutes left.",
                                                    });
                                                }
                                                return (<>
                                                    <Typography variant="caption" style={{ marginTop: '0px', color: '#B0B0B0', textAlign: 'center' }}>
                                                        Time Left
                                                        <Typography variant="h6" style={{ color: "white" }}>
                                                            {Math.floor(remainingTime / 60)}:{remainingTime % 60 < 10 ? `0${remainingTime % 60}` : remainingTime % 60}
                                                        </Typography>
                                                        mins : secs
                                                    </Typography>
                                                </>)
                                            }
                                            }
                                        </CountdownCircleTimer>
                                    </Box>
                                </Grid>


                                {/* Question List Card */}
                                <div className="card border-light p-3" style={{ borderRadius: '22px', backgroundColor: '#2E2E2E', marginTop: "30px", color: 'white' }}>
                                    <h5 className="mb-1 text-center">Question Palette</h5>

                                    <Divider
                                        sx={{
                                            marginY: 1,
                                            marginTop: '6px',
                                            borderColor: 'white', // Adjust color for better visibility (white with some transparency for dark theme)
                                            borderWidth: '1.5px', // Increase thickness
                                            borderStyle: 'solid', // Solid line style; you can also try 'dashed' or 'dotted' for a different effect
                                        }}
                                    />

                                    <div className="d-flex flex-wrap">
                                        {test && (test.questions).map((_, idx) => (
                                            <div className="position-relative m-1" key={idx}>
                                                <button
                                                    type="button"
                                                    className={`btn ${test.score === -1000
                                                            ? (test.questions[idx].response > 0 ? "btn-success" : "btn-secondary")
                                                            : (
                                                                test.questions[idx].response !== -1
                                                                    ? (test.questions[idx].response === test.questions[idx].correct_answer ? "btn-success" : "btn-danger")
                                                                    : "btn-secondary"
                                                            )
                                                        } btn-circle`}
                                                    onClick={() => handleNavigateButton(idx)}
                                                    style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        position: 'relative',
                                                        margin: "3px"
                                                    }}
                                                >
                                                    {idx + 1}
                                                </button>
                                                {/* Conditionally render badge if question is flagged */}
                                                {reviewList.includes(idx) && (
                                                    <span style={{ padding: "2px", marginTop: "6px", background: "transparent" }} className="position-absolute top-0 start-100 translate-middle p-1 bg-light rounded-circle">
                                                        <span>🚩</span>
                                                        <span className="visually-hidden">Flagged question</span>
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className='row'>
                            <div className="col-md-9">

                                {/* <div className="card mx-auto" style={{ maxWidth: "75%", backgroundColor: '#2E2E2E', padding: "13px", borderRadius: "20px", marginTop: '0px' }}>
                                 
                                    <div className="d-flex justify-content-between">

                                        <div>
                                            <button
                                                className="btn btn-outline-light mx-2"
                                                onClick={handleClearResponse}
                                                style={{ borderRadius: '12px' }}
                                                disabled={(test.questions[currentQuestionIndex].response) === -1}
                                            >
                                                Clear Response
                                            </button>

                                            <button
                                                className="btn btn-outline-light mx-2"
                                                onClick={handleMarkforReview}
                                                style={{ borderRadius: '12px' }}
                                            >
                                                Mark/Unmark for Review
                                            </button>
                                        </div>

                                        <div>
                                            <button
                                                className="btn btn-secondary mx-2"
                                                onClick={handlePrevious}
                                                style={{ borderRadius: '12px' }}
                                                disabled={currentQuestionIndex === 0}
                                            >
                                                Previous
                                            </button>
                                            <button
                                                className="btn btn-secondary mx-2"
                                                onClick={handleNext}
                                                style={{ borderRadius: '12px' }}
                                                disabled={currentQuestionIndex === (test.questions).length - 1}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>

                    <nav className="navbar navbar-expand-lg fixed-bottom bg-dark" data-bs-theme="dark">
                        <div className="container">

                            {test.score !== -1000 && (
                                <span style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                                    <div className="position-relative m-1">
                                        <button
                                            type="button"
                                            className="btn btn-info btn-circle mx-2"
                                            onClick={() => handleNavigateButton(1)}
                                            disabled
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                position: 'relative',
                                                margin: "3px",
                                                marginBottom: '6px'
                                            }}
                                        >
                                            <strong>{test.score}</strong>
                                        </button>
                                    </div>
                                    <h5>Score (out of {test.total})</h5>
                                </span>
                            )}
                            <span style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                                <div className="position-relative m-1">
                                    <button
                                        type="button"
                                        className="btn btn-light btn-circle mx-2"
                                        onClick={() => handleNavigateButton(1)}
                                        disabled
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative',
                                            margin: "3px",
                                            marginBottom: '6px'
                                        }}
                                    >
                                        <strong>{test.questions.length}</strong>
                                    </button>
                                </div>
                                <h5> Total Questions</h5>
                            </span>
                            <span style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                                <div className="position-relative m-1">
                                    <button
                                        type="button"
                                        className="btn btn-success btn-circle mx-2"
                                        onClick={() => handleNavigateButton(1)}
                                        disabled
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative',
                                            margin: "3px",
                                            marginBottom: '6px'
                                        }}
                                    >
                                        {test.score === -1000 ? answeredList.length : test.correct}
                                    </button>
                                </div>
                                <h5>{test.score === -1000 ? "Answered" : "Correct Responses"}</h5>
                            </span>

                            <span style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                                <div className="position-relative m-1">
                                    <button
                                        type="button"
                                        className={`btn btn-${test.score === -1000 ? "secondary" : "danger"} btn-circle mx-2`}
                                        disabled
                                        onClick={() => handleNavigateButton(1)}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative',
                                            margin: "3px",
                                            marginBottom: '6px'
                                        }}
                                    >
                                        {test.score === -1000 ? reviewList.length : test.wrong}
                                    </button>
                                    {test.score === -1000 && (
                                        <span style={{ padding: "2px", marginTop: "7px", background: "transparent" }} className="position-absolute top-0 start-100 translate-middle p-1 bg-light rounded-circle">
                                            <span>🚩</span>
                                            <span className="visually-hidden">Flagged question</span>
                                        </span>
                                    )}
                                </div>
                                <h5> {test.score === -1000 ? "Marked for review" : "Wrong Answers"}</h5>

                            </span>

                            <span style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                                <div className="position-relative m-1">
                                    <button
                                        type="button"
                                        className="btn btn-secondary btn-circle mx-2"
                                        onClick={() => handleNavigateButton(1)}
                                        disabled
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative',
                                            margin: "3px",
                                            marginBottom: '6px'
                                        }}
                                    >
                                        {test.score === -1000 ? (test.questions.length - answeredList.length) : (test.questions.length - test.correct - test.wrong)}
                                    </button>
                                </div>
                                <h5> Unanswered</h5>
                            </span>
                            <span style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                                <div className="w-50 d-flex justify-content-center">


                                    <button
                                        className="btn btn-outline-danger btn-lg"
                                        onClick={() => handleOpenTestDialog("End")}
                                        // disabled={currentQuestionIndex === (test.questions).length - 1}
                                        id="end"
                                        style={{ display: test.score !== -1000 ? "none" : "block" }}
                                    >
                                        End Test
                                    </button>
                                </div>
                                <div className="w-50 d-flex justify-content-center">
                                    <button
                                        className="btn btn-info btn-lg"
                                        onClick={() => handleOpenTestDialog("Submit")}
                                        // disabled={currentQuestionIndex === (test.questions).length - 1}
                                        id="submit"
                                        style={{ display: test.score !== -1000 ? "none" : "block" }}
                                    >
                                        Submit Test
                                    </button>
                                </div>
                            </span>
                        </div>
                    </nav>
                </div>
            )}
        </>
    )
}

export default StartTest
