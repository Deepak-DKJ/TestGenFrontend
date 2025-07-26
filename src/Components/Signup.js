import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import { TestContext } from '../Context/TestContext';
import Alert from './Alert';
import { useNavigate } from 'react-router-dom'

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { Slide } from '@mui/material';
import { RingSpinner } from 'react-spinners-kit';

const Signup = () => {
  const navigate = useNavigate()
  const { baseUrl } = useContext(TestContext)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [alert, setAlert] = useState({
    "vis": false,
    "msg": ""
  })

  const [loading, setLoading] = useState(false)

  const handleAddUser = async () => {
      if (!email || !password || !name) {
    setAlert({
      "vis": true,
      "msg": "Name, Email and password are required."
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
      "name": name,
      "email": email,
      "password": password
    }
    setLoading(true)
    try {
      const response = await axios.post(`${baseUrl}/auth/signup`, data);
      
    setLoading(false)
      // localStorage.setItem('token', response.data.authToken)
      // navigate('/')
      setEmail("")
      setName("")
      setPassword("")
      setAlert({
        "vis": true,
        "msg": "User added successfully. Please Login!"
      })
      // console.log(response.data.authToken)
    }
    catch (err) {
      console.log(err)
      setAlert({
        "vis": true,
        "msg": err.response.data.error
      })
      // console.log(err.response.data.error)
    }
    
    setLoading(false)
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
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert.vis}

        onClose={() => {
          setAlert({
            "vis": false,
            "msg": ""
          });

          if (alert.msg === "User added successfully. Please Login!")
            navigate('/testGenerator/login')
        }}
        TransitionComponent={Slide}
        message={alert.msg}
      />
      <section>
        <div className="signin">
           <h1 style={{ fontSize: "2.0em", color: "cyan", textAlign: "center", textTransform: "uppercase", marginBottom: "0px" }}>Sign Up</h1>
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
          <div className="content">
            <div className="form">
              <div className="inputBox">
                <input value={name} type="text" onChange={(e) => setName(e.target.value)} required />
                <i>Name</i>
              </div>
              <div className="inputBox">
                <input value={email} type="text" onChange={(e) => setEmail(e.target.value)} required />
                <i>Email</i>
              </div>
              <div className="inputBox">
                <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} required />
                <i>Password</i>
              </div>
              <div className="links">
                <p>Already a user?</p>
                <Link to="/testGenerator/login">Login</Link>
              </div>
              <div className="inputBox">
                <input type="submit" value="Create User" onClick={handleAddUser} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Signup
