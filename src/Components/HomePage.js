import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';

// Dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
const styles = {
  button: {
      backgroundColor: 'cyan',
      color: 'black',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '12px',
      fontSize: '1.5rem',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      marginTop: '20px',
  },
  buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '20px'
  }
};
// Typewriter effect tagline component
const tagline = "The only-AI based MCQs test generator tool you need !";
function TypewriterTagline() {
  const [displayed, setDisplayed] = React.useState("");
  const [show, setShow] = React.useState(true);
  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    let timeout;
    if (show && idx < tagline.length) {
      timeout = setTimeout(() => {
        setDisplayed(tagline.slice(0, idx + 1));
        setIdx(idx + 1);
      }, 40);
    } else if (show && idx === tagline.length) {
      timeout = setTimeout(() => setShow(false), 2000);
    } else if (!show && idx > 0) {
      timeout = setTimeout(() => {
        setDisplayed(tagline.slice(0, idx - 1));
        setIdx(idx - 1);
      }, 30);
    } else if (!show && idx === 0) {
      timeout = setTimeout(() => setShow(true), 500);
    }
    return () => clearTimeout(timeout);
  }, [idx, show]);

  return (
    <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', margin: '15px', minHeight: '32px' }}>
      {displayed}
      <span style={{ opacity: 0.7, fontWeight: "bold" }}>|</span>
    </Typography>
  );
}

const HomePage = () => {
  const navigate = useNavigate();
  const GotoMcqsPage = () => {
    navigate('/testGenerator/mcqs/create');
  };

  const steps = [
    { title: 'TestGen.AI', description: 'AI-powered MCQ test generator, helps you to generate & attempt customized tests from any text/file.' },
    { title: 'Upload File/Paste Text', description: 'A user can upload a document or directly paste text & generate their desired number of questions.' },
    { title: 'MCQs with Timer', description: 'Take the generated MCQ-based test in a timed environment along with negative marking.' },
    { title: 'Review & Analysis', description: 'Provides test review, analysis, and retake options, along with the scorecards in graphical format' }
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <Container>
        <Box sx={{ textAlign: 'center', mb: 0, minHeight: '50vh' }}>
          <img src="/testgen.png" alt="TestGen.AI Logo" width="400px" />
        </Box>

        <Grid container spacing={4}>
          {steps.map((step, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent style={{backgroundColor:"#3D3D3D"}}>
                  <Typography variant="h6" component="div" gutterBottom>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="#A8A8A8">
                    {step.description}
                  </Typography>
                </CardContent>
                {/* <CardActions>
                  <Button size="small" color="primary">Learn More</Button>
                </CardActions> */}
              </Card>
            </Grid>
          ))}
        </Grid>
          
        {/* Typewriter animated tagline */}
        <TypewriterTagline />
{/* // Typewriter effect tagline component */}
        <div style={styles.buttonContainer}>
          <button style={styles.button} onClick={GotoMcqsPage}>
                    Get Started
                </button>
                </div>
      </Container>
    </ThemeProvider>
  );
}

export default HomePage;
