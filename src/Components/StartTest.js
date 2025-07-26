import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TestContext } from '../Context/TestContext'; // Assuming context is in this path
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import {
  Box, Button, Typography, Grid, Card, CardContent,
  AppBar, Toolbar, Snackbar, Slide, Divider, Dialog,
  DialogActions, DialogContent, DialogContentText,
  DialogTitle, Chip, CssBaseline, Badge, Container,
  Avatar,
  useMediaQuery
} from '@mui/material';
import NavBar from './NavBar'; // Assuming NavBar is in this path
import { useTheme } from '@emotion/react';
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // Timer Icon
import { styled } from '@mui/material/styles';

// Custom scrollbar styling
const customScrollbarStyles = {
  '*::-webkit-scrollbar': { width: '8px' },
  '*::-webkit-scrollbar-track': { background: '#2E2E2E', borderRadius: '4px' },
  '*::-webkit-scrollbar-thumb': { background: '#555', borderRadius: '4px' },
  '*::-webkit-scrollbar-thumb:hover': { background: '#666' }
};
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: 'orange',
    color: 'orange',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      border: '1px solid currentcolor',
      content: '""',
    },
  },
}));


const StartTest = () => {
  const { test_id } = useParams();
  const { baseUrl } = useContext(TestContext);
  const navigate = useNavigate();

  // --- Component State ---
  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredList, setAnsweredList] = useState([]);
  const [reviewList, setReviewList] = useState([]);
  const [openStartTest, setOpenStartTest] = useState(false);
  const [dia, setDia] = useState("Submit");

  const [timeLeft, setTimeLeft] = useState(0);
  const timerContainerRef = useRef(null);
  const [timerSize, setTimerSize] = useState(160);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  function capitalizeFirstLetter(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  // --- Handlers ---
  const handleOptionChange = (optionIndex) => {
    setAnsweredList(prev => prev.includes(currentQuestionIndex) ? prev : [...prev, currentQuestionIndex]);
    setTest(prev => {
      const newQuestions = [...prev.questions];
      newQuestions[currentQuestionIndex] = { ...newQuestions[currentQuestionIndex], response: optionIndex };
      return { ...prev, questions: newQuestions };
    });
  };

  const handleClearResponse = () => {
    setAnsweredList(prev => prev.filter(item => item !== currentQuestionIndex));
    setTest(prev => {
      const newQuestions = [...prev.questions];
      newQuestions[currentQuestionIndex] = { ...newQuestions[currentQuestionIndex], response: -1 };
      return { ...prev, questions: newQuestions };
    });
  };
  const [alert, setAlert] = useState({
        vis: false,
        msg: "",
    });

  const handleMarkforReview = () => {
    setReviewList(prev => prev.includes(currentQuestionIndex)
      ? prev.filter(item => item !== currentQuestionIndex)
      : [...prev, currentQuestionIndex]
    );
  };

  const handleNext = () => setCurrentQuestionIndex(val => Math.min(test.questions.length - 1, val + 1));
  const handlePrevious = () => setCurrentQuestionIndex(val => Math.max(0, val - 1));
  const handleNavigateButton = (qsNum) => setCurrentQuestionIndex(qsNum);
  const handleOpenTestDialog = (dialog) => { setDia(dialog); setOpenStartTest(true); };
  const handleCloseStartTestDialog = () => setOpenStartTest(false);

  const handleSubmit = async () => {
    if(test.score !== -1000)
      return;
    handleCloseStartTestDialog();
    if (dia === "End") {
      navigate('/testGenerator/mcqs/mytests');
      return;
    }

    let correctCount = 0, wrongCount = 0;
    test.questions.forEach(q => {
      if (q.response !== -1) {
        if (q.correct_answer === q.response) correctCount++;
        else wrongCount++;
      }
    });

    const score = Math.max(0, (test.crtAnswer * correctCount) - (test.negMarking * wrongCount));
    const data = { updatedQuestionsList: test.questions, testScore: score, correctQsns: correctCount, wrongQsns: wrongCount };

    try { await axios.put(`${baseUrl}/mcqs/updatetest/${test_id}`, data, { headers: { Token: localStorage.getItem("token") } }); }
    catch (err) { console.error("Error updating test: ", err); }
    navigate("/testGenerator/mcqs/mytests");
  };

  // --- Effects ---
  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      if (entries[0]) setTimerSize(entries[0].contentRect.width * 0.9); // Adjust multiplier for padding
    });
    const currentRef = timerContainerRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate("/testGenerator/login");
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/mcqs/gettest/${test_id}`, { headers: { Token: localStorage.getItem('token') } });
        setTest(data.testDetails);
                if (data.testDetails.score === -1000)
                    setAlert({
                        vis: true,
                        msg: "The test has started. All the best!",
                    });
      } catch (error) { console.error('Error fetching test:', error); }
    };
    fetchData();
  }, [test_id, baseUrl, navigate]);

  // --- Theme ---
  const darkTheme = createTheme({
    palette: {
      mode: 'dark', background: { default: '#121212', paper: '#1d1d1d' }, text: { primary: '#ffffff', secondary: '#b0b0b0' },
      primary: { main: '#90caf9' }, secondary: { main: '#f48fb1' }, success: { main: '#66bb6a' },
      error: { main: '#f44336' }, warning: { main: '#ffa726' }, info: { main: '#29b6f6' }
    },
    components: { MuiCard: { styleOverrides: { root: { border: '1px solid #333', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' } } } },
  });

  if (!test) {
    return (
      <ThemeProvider theme={darkTheme}><CssBaseline /><Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Typography>Loading Test...</Typography></Box></ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <style>{`${Object.entries(customScrollbarStyles).map(([key, value]) => `${key} { ${Object.entries(value).map(([prop, val]) => `${prop}: ${val};`).join(' ')} }`).join(' ')}`}</style>

      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}>
        <NavBar PAGE="started" REVIEW={test.score !== -1000} />
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

        <Dialog open={openStartTest} onClose={handleCloseStartTestDialog} PaperProps={{ sx: { borderRadius: 3 } }}>
          <DialogTitle variant="h5">{dia} Test</DialogTitle>
          <DialogContent><DialogContentText>{dia === "Submit" ? "Do you want to submit the responses & end the test?" : "Do you want to end the test? Your progress will be reset."}</DialogContentText></DialogContent>
          <DialogActions sx={{ p: 2 }}><Button onClick={handleCloseStartTestDialog} color="primary">Cancel</Button><Button onClick={handleSubmit} color={dia === "Submit" ? "success" : "secondary"} autoFocus>Yes</Button></DialogActions>
        </Dialog>

        <Container maxWidth="xl" sx={{ flexGrow: 1, padding:"0px 16px 16px 16px", display: 'flex', flexDirection: 'column', overflowY: isMobile?'auto':'hidden' }}>
          <Typography variant="h5" component="h1" align="center" sx={{ mb: 0.8, flexShrink: 0 }}>MCQs Test : {capitalizeFirstLetter(test.testTitle)}</Typography>

          {/* {isMobile && (
            <Chip
              icon={<AccessTimeIcon />}
              label={`Time Left: ${Math.floor(test.testDuration / 60)}:${String(test.testDuration % 60).padStart(2, '0')}`}
              variant="outlined"
              sx={{ mb: 1, p: 1, fontSize: '1rem', alignSelf: 'center', borderColor: 'info.main', color: 'info.main' }}
            />
          )} */}

          {/* CORRECTED GRID PROPORTIONS HERE */}
          <Grid container spacing={4} sx={{ flexGrow: 1, height: '100%' }}>

            {/* --- Left Column (75% width) --- */}
            <Grid item xs={12} md={9} sx={{ height: '100%', overflow:isMobile ? 'visible' : 'hidden', display: 'flex' }}>
              <Card sx={{ borderRadius: 4, p: 2.5, display: 'flex', flexDirection: 'column', backgroundColor: '#2E2E2E', width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                  <Typography variant="h6">Question {currentQuestionIndex + 1} of {test.questions.length}</Typography>
                  
                  {reviewList.includes(currentQuestionIndex) && (
                                                        <span style={{ marginLeft: '20px', fontSize: '18px' }}>
                                                            <span className="badge text-bg-secondary"><strong>Flagged for review</strong></span>
                                                        </span>
                                                    )}
                                                    {test.score !== -1000 && (
                                                        <span style={{ fontSize: '20px' }}>
                                                            <span className={`badge text-bg-${test.questions[currentQuestionIndex]["response"] === test.questions[currentQuestionIndex]["correct_answer"] ? "success" : test.questions[currentQuestionIndex]["response"] === -1 ? "secondary" : "danger"}`}><strong>{(test.questions[currentQuestionIndex]["response"] === test.questions[currentQuestionIndex]["correct_answer"]) ? "Your answer is correct !" : (test.questions[currentQuestionIndex]["response"] === -1 ? "Unanswered Question !" : "Your answer is wrong !")}</strong></span>
                                                        </span>
                                                    )}
                  
                  <Box sx={{display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>Correct<Chip label={`+${test.crtAnswer}`} color="success" size="small" sx={{mr: 2}} />Wrong<Chip label={`-${test.negMarking}`} color="error" size="small"  sx={{mr: 2}}/></Box>
                </Box>
                <hr sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
                <CardContent sx={{ flexGrow: 1, p: 0, overflowY: 'auto' }}>
                  <Typography variant="h6" sx={{ mb: 4 }}>{test.questions[currentQuestionIndex]["question"]}</Typography>
                 <Grid container spacing={2}>
    {Object.values(test.questions[currentQuestionIndex].options).map((option, index) => {
        const isSelected = test.questions[currentQuestionIndex].response === index + 1;
        const isCorrect = test.questions[currentQuestionIndex].correct_answer === index + 1;
        const inReviewMode = test.score !== -1000;

        // --- Determine Button Styles ---
        let backgroundColor = 'transparent';
        let color = 'text.primary'; // Default text color
        let borderColor = 'rgba(255, 255, 255, 0.3)';
        let hoverStyles = {
            backgroundColor: 'rgba(144, 202, 249, 0.08)',
            borderColor: 'primary.main'
        };

        if (inReviewMode) {
            // In review mode, show correct and user's answers
            if (isCorrect) {
                backgroundColor = 'green';
                color = 'white'; // White text for green background
                borderColor = 'green';
            }
            if (isSelected) {
                // User's selection (cyan) overrides the correct answer (green) if they match
                backgroundColor = 'cyan';
                color = 'black'; // Black text for cyan background
                borderColor = 'cyan';
            }
            // Disable hover effects in review mode
            hoverStyles = {
                backgroundColor: backgroundColor,
                borderColor: borderColor
            };
        } else if (isSelected) {
            // While attempting the test, just highlight the selected option
            backgroundColor = 'cyan';
            color = 'black';
            borderColor = 'cyan';
            // Keep the selected style on hover
            hoverStyles = {
                backgroundColor: 'cyan',
                borderColor: 'cyan'
            };
        }

        return (
            <Grid item xs={12} sm={6} key={index} sx={{ display: 'flex' }}>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleOptionChange(index + 1)}
                    sx={{
                        justifyContent: 'center',
                        textAlign: 'center',
                        p: 2,
                        borderRadius: 3,
                        textTransform: 'none',
                        height: '100%',
                        // Apply dynamic styles
                        backgroundColor: backgroundColor,
                        color: color,
                        borderColor: borderColor,
                        // Disable clicks/hovers in review mode without changing appearance
                        pointerEvents: inReviewMode ? 'none' : 'auto',
                        // Apply hover styles
                        '&:hover': hoverStyles
                    }}
                >
                    {option}
                </Button>
            </Grid>
        );
    })}
</Grid>
                </CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, flexShrink: 0 }}>
                  <Box>
                    {test.score === -1000 && (
                      <>
                      <Button variant="outlined" onClick={handleClearResponse} disabled={test.questions[currentQuestionIndex].response === -1} sx={{ mr: 1, borderRadius: 2 }}>Clear Response</Button><Button variant="outlined" color={reviewList.includes(currentQuestionIndex) ? "warning" : "primary"} onClick={handleMarkforReview} sx={{ borderRadius: 2 }}>{reviewList.includes(currentQuestionIndex) ? 'Unmark' : 'Mark for Review'}</Button>
                      </>
                    )}
                  </Box>
                  <Box><Button onClick={handlePrevious} disabled={currentQuestionIndex === 0} sx={{ mr: 1, borderRadius: 2 }}>Previous</Button><Button variant="contained" onClick={handleNext} disabled={currentQuestionIndex === test.questions.length - 1} sx={{ borderRadius: 2 }}>Next</Button></Box>
                </Box>
              </Card>
            </Grid>

            {/* --- Right Column (25% width) --- */}
            <Grid item xs={12} md={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Card ref={timerContainerRef} sx={{ p: 2, borderRadius: 4, display: test.score === -1000 ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', backgroundColor: '#2E2E2E', flexShrink: 0 }}>
                <CountdownCircleTimer isPlaying duration={test.testDuration * 60} colors={['#00FFFF', '#F7B801', '#A30000']} colorsTime={[test.testDuration * 30, test.testDuration * 12, 0]} size={timerSize} strokeWidth={9} onComplete={handleSubmit}>
                  {({ remainingTime }) => (<Box sx={{ textAlign: 'center', color: 'text.secondary' }}><Typography variant="caption">Time Left</Typography><Typography variant="h4" component="div" sx={{ color: 'text.primary', lineHeight: 1.2 }}>{Math.floor(remainingTime / 60)}:{String(remainingTime % 60).padStart(2, '0')}</Typography><Typography variant="caption">mins:secs</Typography></Box>)}
                </CountdownCircleTimer>
              </Card>
              <Card sx={{ p: 1.5, borderRadius: 4, flexGrow: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#2E2E2E', overflow: 'hidden' }}>
                <Typography variant="h6" align="center" sx={{ marginBottom: "-10px" }} >Question Palette</Typography>
                <hr sx={{ margin: '0.5rem 0', borderColor: 'rgba(255, 255, 255, 0.2)' }} />
                <Box sx={{
  flexGrow: 1,
  overflowY: 'auto',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(45px, 1fr))',
  gap: 1.5,
  alignContent: 'flex-start'
}}>
  {test.questions.map((q, idx) => {
    const inReviewMode = test.score !== -1000;
    
    // Determine button styles based on test mode (attempt vs. review)
    let buttonVariant = 'outlined';
    let buttonColor = 'inherit';

    if (inReviewMode) {
      // --- Review Mode Logic ---
      const wasAttempted = q.response !== -1; // Assuming -1 means unattempted
      if (wasAttempted) {
        const wasCorrect = q.response === q.correct_answer;
        buttonVariant = 'contained';
        buttonColor = wasCorrect ? 'success' : 'error';
      }
      // For unattempted questions, the default 'outlined' and 'inherit' are used.
    } else {
      // --- Attempt Mode Logic ---
      const isAnswered = q.response > 0;
      if (isAnswered) {
        buttonVariant = 'contained';
        buttonColor = 'success';
      }
      // For unanswered questions, the default 'outlined' and 'inherit' are used.
    }

    return (
      <StyledBadge
      key={idx}
        overlap="circular"
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        variant="dot"
        invisible={!reviewList.includes(idx)}
      >
        <Button
          variant={buttonVariant}
          color={buttonColor}
          onClick={() => handleNavigateButton(idx)}
          sx={{
            minWidth: '40px',
            height: '40px',
            p: 0,
            borderRadius: '50%',
            fontWeight: 'bold',
            // Highlight the current question
            border: currentQuestionIndex === idx ? '2px solid' : '1px solid',
            borderColor: currentQuestionIndex === idx ? 'white' : 'rgba(255, 255, 255, 0.23)'
          }}
        >
          {idx + 1}
        </Button>
      </StyledBadge>
    );
  })}
</Box>
              </Card>
            </Grid>
          </Grid>
        </Container>

        <AppBar position="relative" sx={{ background: '#1d1d1d', borderTop: '1px solid #333', minHeight:'60px' }}>
          <Toolbar sx={{
            flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on extra-small screens, row on small and up
            justifyContent: 'space-between',
            alignItems: 'center',
            py: { xs: 1.2, sm: 1.5 }, // Add more vertical padding on extra-small screens
            gap: 0 // Add gap between stacked items
          }}>
            {/* Information Chips */}
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, // 2 columns on mobile, 4 on desktop
              gap: isMobile? 0.5 : 5,
              width: { xs: '100%', md: 'auto' }, // Take full width on mobile
              justifyContent: 'center'
            }}>
              <Chip
    avatar={
        <Avatar sx={{ bgcolor: '#424242', color: 'white !important' }}>
            {test.questions.length}
        </Avatar>
    }
    label="Total Questions"
    sx={{ p: 2, fontSize: '0.875rem', bgcolor: 'transparent', border: '1px solid #424242', borderRadius: '16px' }}
/>
<Chip
    avatar={
        <Avatar sx={{ bgcolor: 'success.dark', color: 'white !important' }}>
            {test.score === -1000 ? answeredList.length : test.correct}
        </Avatar>
    }
    label={test.score === -1000 ? "Answered Questions" : "Correct Responses"}
    color="success"
    variant="outlined"
    sx={{ p: 2, fontSize: '0.875rem', borderRadius: '16px' }}
/>
<Chip
    avatar={
        <Avatar sx={{ bgcolor: 'warning.dark', color: 'white !important' }}>
            {test.score === -1000 ? reviewList.length : test.wrong}
        </Avatar>
    }
    label={test.score === -1000 ? "Marked For Review" : "Wrong Answers"}
    color="warning"
    variant="outlined"
    sx={{ p: 2, fontSize: '0.875rem', borderRadius: '16px' }}
/>
<Chip
    avatar={
        <Avatar sx={{ bgcolor: '#424242', color: 'white !important' }}>
            {test.score === -1000 ? test.questions.length - answeredList.length : test.questions.length - test.correct - test.wrong}
        </Avatar>
    }
    label="Unanswered Qsns"
    sx={{ p: 2, fontSize: '0.875rem', bgcolor: 'transparent', border: '1px solid #424242', borderRadius: '16px' }}
/></Box>

            {/* Action Buttons */}
            <Box sx={{
              display: test.score === -1000 ? 'flex': 'none',
              flexDirection: { xs: 'row', sm: 'row' }, // Always a row, but could be 'column' on xs if needed
              gap: isMobile? 1: 2.5,
              width: { xs: '100%', sm: 'auto' }, // Full width on mobile to use justify-content
              justifyContent: 'center', // Center buttons on mobile
              mt: { xs: 1, sm: 0 } // Add margin top on mobile
            }}>
              <Button variant="outlined" color="error" size="medium" onClick={() => handleOpenTestDialog("End")} sx={{ borderRadius: 2 }}>End Test</Button>
              <Button variant="contained" color="info" size="medium" onClick={() => handleOpenTestDialog("Submit")} sx={{ borderRadius: 2 }}>Submit Test</Button>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
}

export default StartTest;