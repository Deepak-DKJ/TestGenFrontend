import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import { TestContext } from '../Context/TestContext';
import Alert from './Alert';
import { useNavigate } from 'react-router-dom'

import GoogleLoginButton from './GoogleLoginButton';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar'
import { Slide } from '@mui/material';
import { RingSpinner } from 'react-spinners-kit';

const Login = () => {
  const [loading, setLoading] = useState(false)
  const { baseUrl, setUserData } = useContext(TestContext)
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [alert, setAlert] = useState({
    "vis": false,
    "msg": ""
  })

  const handleLogin = async () => {
     if (!email || !password) {
    setAlert({
      "vis": true,
      "msg": "Email and password are required."
    });
    return; // Stop the function from proceeding
  }

  // Email format validation using a simple regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setAlert({
      "vis": true,
      "msg": "Please enter a valid email address."
    });
    return;
  }

    const data = {
      "email": email,
      "password": password
    }
    setLoading(true)

    try {
      const response = await axios.post(`${baseUrl}/auth/login`, data);

      localStorage.setItem('token', response.data.authToken)
      localStorage.setItem('userdata',  JSON.stringify(response.data.userData))
      // console.log(response.data.userData)
      // console.log(JSON.parse(localStorage.getItem('userdata')))
      setEmail("")
      setPassword("")
      setLoading(false)
      navigate('/testGenerator/mcqs/create')
    }
    catch (err) {
      setLoading(false)
      // console.log(err)
      setAlert({
        "vis": true,
        "msg": err.response.data.error
      })
      // console.log(err.response.data.error)
    }
  }

  return (
    <div>
      {loading && (
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
          <RingSpinner size={50} color="cyan" />

        </Box>
      )}
       <Snackbar
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert.vis}

        onClose={() => {
          setAlert({
            "vis": false,
            "msg": ""
          });
        }}
        TransitionComponent={Slide}
        message={alert.msg}
      />
    <section>
      
      <div className="signin">
        <h1 style={{ fontSize: "2.0em", color: "cyan", textAlign: "center", textTransform: "uppercase", marginBottom: "0px" }}>Sign In</h1>
          <Box
  sx={{
    textAlign: 'center',
    mb: 0,
    width: '300px', // Adjust this value to your design needs
    minHeight: '240px', // Adjust this value to match the image's aspect ratio
    // To ensure the Box itself is centered within its parent
    marginLeft: 'auto',
    marginRight: 'auto',
    // Flex utilities to center the image perfectly once loaded
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}
>
            <img src="/testgen.png" alt="TestGen.AI Logo" width="80%" />
          </Box>
          <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginBottom:"20px"}}>
            <GoogleLoginButton />
          </div>

        <div className="content">
          <div className="form">
            <div className="inputBox">
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" required />
              <i>Email</i>
            </div>
            <div className="inputBox">
              <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} required />
              <i>Password</i>
            </div>
            <div className="links">
              <p>Are you a new user?</p>
              <Link to="/testGenerator/signup">Signup</Link>
            </div>
            <div className="inputBox">
              <input type="submit" value="Login" onClick={handleLogin} />
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
};

export default Login;
