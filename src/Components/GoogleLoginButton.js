import React, { useContext, useState } from 'react';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TestContext } from '../Context/TestContext';
import { Box, Slide, Snackbar, Button } from '@mui/material';
import { RingSpinner } from 'react-spinners-kit';
import GoogleIcon from '@mui/icons-material/Google';

const GoogleLoginButton = () => {
    const { baseUrl } = useContext(TestContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [alert, setAlert] = useState({
        vis: false,
        msg: '',
    });
     const handleGoogleLogin = async (response) => {
        console.log("Inside google login")
        setLoading(true);
        try {
            // Send the Google token to the backend
            const { data } = await axios.post(`${baseUrl}/auth/google/callback`, {
                token: response.credential, // Google token
            });

            // Store the JWT token and user data in localStorage
            localStorage.setItem('token', data.authToken);
            localStorage.setItem('userdata', JSON.stringify(data.userData));

            // Reset loading state and navigate to the dashboard
            setLoading(false);
            
            // console.log("Navigating with replace:", replace);
            navigate('/testGenerator/mcqs/create', { replace: true });
        } catch (err) {
            setLoading(false);
            setAlert({
                vis: true,
                msg: "Google login failed!",
            });
            // console.error("Google login error:", err);
        }
    };
    return (
        <div>
            {loading && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1300,
                    }}
                >
                    <RingSpinner size={50} color="cyan" />
                </Box>
            )}
            <Snackbar
                autoHideDuration={2000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={alert.vis}
                onClose={() => {
                    setAlert({
                        vis: false,
                        msg: '',
                    });
                }}
                TransitionComponent={Slide}
                message={alert.msg}
            />
            <Box>
                <Box>
            <GoogleLogin
                theme='filled_outline'
                width={"260px"}
                onSuccess={handleGoogleLogin}
                onError={() => setError('Google login failed')}
            />
      </Box>
            </Box>
            {error && <p>{error}</p>}
        </div>
    );
};

export default GoogleLoginButton;