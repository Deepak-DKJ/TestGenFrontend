import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import { TestContext } from '../Context/TestContext';
import Alert from './Alert';
import { useNavigate } from 'react-router-dom'

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar'
import { Slide } from '@mui/material';

const Login = () => {
  const { baseUrl, setUserData } = useContext(TestContext)
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [alert, setAlert] = useState({
    "vis": false,
    "msg": ""
  })

  const handleLogin = async () => {
    const data = {
      "email": email,
      "password": password
    }

    try {
      const response = await axios.post(`${baseUrl}/auth/login`, data);

      localStorage.setItem('token', response.data.authToken)
      localStorage.setItem('userdata',  JSON.stringify(response.data.userData))
      // console.log(response.data.userData)
      // console.log(JSON.parse(localStorage.getItem('userdata')))
      setEmail("")
      setPassword("")
      navigate('/testGenerator/mcqs/create')
    }
    catch (err) {
      // console.log(err)
      setAlert({
        "vis": true,
        "msg": err.response.data.error
      })
      console.log(err.response.data.error)
    }
  }

  return (
    <div>
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
        <div className="content">
          <h2>Sign In</h2>
          <div className="form">
            <div className="inputBox">
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" required />
              <i>Name or Email</i>
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
