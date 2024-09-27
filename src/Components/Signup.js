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


  const handleAddUser = async () => {
    const data = {
      "name": name,
      "email": email,
      "password": password
    }

    try {
      const response = await axios.post(`${baseUrl}/auth/signup`, data);

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

          if (alert.msg === "User added successfully. Please Login!")
            navigate('/testGenerator/login')
        }}
        TransitionComponent={Slide}
        message={alert.msg}
      />
      <section>
        <div className="signin">
          <div className="content">
            <h2>Sign Up</h2>
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
