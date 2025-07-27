import React, { useContext, useState } from "react";
import { Button, Box, Typography, Grid, useMediaQuery } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Link, useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import {
    Badge, Card, CardContent, CardActions, Divider, DialogActions, DialogContentText, DialogContent, DialogTitle, Dialog
} from '@mui/material';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { Slide } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';

import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import GitHubIcon from '@mui/icons-material/GitHub';
import axios from "axios";
import { TestContext } from "../Context/TestContext";

import Snackbar from "@mui/material/Snackbar";
import { useTheme } from "@emotion/react";
const StyledRating = styled(Rating)(({ theme }) => ({
    // '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
    //     color: theme.palette.action.disabled,
    // },
    '& .MuiRating-icon': {
        margin: '0 3px', // Adjust spacing between icons

    },
    '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
        color: theme.palette.action.disabled,
    },
}));
const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);
const customIcons = {
    1: {
        icon: <SentimentVeryDissatisfiedIcon fontSize="large" color="error" />,
        label: 'Very Dissatisfied',
    },
    2: {
        icon: <SentimentDissatisfiedIcon fontSize="large" color="error" />,
        label: 'Dissatisfied',
    },
    3: {
        icon: <SentimentSatisfiedIcon fontSize="large" color="warning" />,
        label: 'Neutral',
    },
    4: {
        icon: <SentimentSatisfiedAltIcon fontSize="large" color="success" />,
        label: 'Satisfied',
    },
    5: {
        icon: <SentimentVerySatisfiedIcon fontSize="large" color="success" />,
        label: 'Very Satisfied',
    },
};
function IconContainer(props) {
    const { value, ...other } = props;
    return <span {...other} title={customIcons[value].label}>{customIcons[value].icon}</span>;
}

IconContainer.propTypes = {
    value: PropTypes.number.isRequired,
};
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
const styles = {
    textField: {
        backgroundColor: "#3E3E3E",
        borderRadius: "10px",
    },
};
const NavBar = ({ PAGE, REVIEW }) => {
    const theme = useTheme(); 
const fullScreen = useMediaQuery(theme.breakpoints.down('sm')); 

    const pages = ["Home", "Create", "Dashboard"];
    const settings = ["My Profile", "Sign out"];
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [dur, setDur] = useState(30)

    const [feedBack, setFeedBack] = useState("")
    const handleFeedbackChange = (event) => {
        let str = event.target.value;
        str = str.trim();
        setFeedBack(str);
    };

    const [modal, setModal] = useState(null)
    const [open, setOpen] = useState(false)
    const handleCloseModal = () => {
        setOpen(false)
    }

    const handleLaunchModal = (md) => {
          handleCloseNavMenu()
        setModal(md)
        setOpen(true)
    }
     const handleProfileAction = async (setting) => {
        handleCloseUserMenu();
        if (setting === "Sign out") {
            if (PAGE === "started" && !REVIEW) {
            if (!window.confirm("Do you want to exit the test? All progress will be lost!")) {
                return;
            }
        }
            localStorage.removeItem('token');
            navigate("/testGenerator/login");
        }
        if (setting === "My Profile") {
            handleLaunchModal(setting)
            try {
                // console.log("READY")
                let authToken = localStorage.getItem('token')
                // console.log(authToken)
                const response = await axios.get(`${baseUrl}/mcqs/getprofile`, {
                    headers: {
                        Token: authToken,
                    },
                });
                const dat = response.data
                setProfile(dat)
                // setShowProgress(false)
            }
            catch (err) {
                console.log(err)
                // setShowProgress(false)
            }
        }
    };


    const [rating, setRating] = React.useState(null);
    const [hover, setHover] = React.useState(-1);

    const userData = JSON.parse(localStorage.getItem("userdata"))
    let name = "NA"
    if (userData)
        name = userData.name.split(" ")
    let userName = ""
    if (name.length > 1) {
        userName += (name[0][0] + name[1][0])
    }
    else {
        userName = (name[0][0] + name[0][name[0].length - 1])
    }
    const navigate = useNavigate()
    const [alert, setAlert] = useState({
        vis: false,
        msg: "",
    });
    const { baseUrl } = useContext(TestContext);
    const handleSubmitFeedback = async () => {
        const data = {
            "rating": rating,
            "feedback": feedBack
        };
        handleCloseModal()
        setAlert({
            vis: true,
            msg: "Ratings & Feedbacks submitted successfully !",
        });
        let authToken = localStorage.getItem("token");
        // console.log(authToken);
        try {
            const response = await axios.put(`${baseUrl}/mcqs/feedbacks/`, data, {
                headers: {
                    Token: authToken, // Set the Authorization header with Bearer token
                },
            });
            const dat = response.data;
            // console.log(response.data)
        }
        catch (err) {
            console.log("Error: ", err);
        }
    }

    const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);

      const handleCloseNavMenu = () => setAnchorElNav(null);

      const handleNavMenuClick = (page) => {
        if (PAGE === "started" && !REVIEW) {
            if (!window.confirm("Do you want to exit the test? All progress will be lost!")) {
                return;
            }
        }
        // Simplified navigation
        const path = {
            "Home": '/testGenerator/',
            "Create": '/testGenerator/mcqs/create',
            "Dashboard": '/testGenerator/mcqs/mytests'
        }[page];

        if (path) navigate(path);
        handleCloseNavMenu();
    };
     const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);

   const handleCloseUserMenu = () => setAnchorElUser(null);
    const [profile, setProfile] = useState(null)

    const handleImageClick = () => {
        if (PAGE === "started" && !REVIEW) {
            if (!window.confirm("Do you want to exit the test? All progress will be lost!")) {
                return;
            }
        }
        navigate('/testGenerator/');
    }


    return (
        <div>
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
            <>
                <AppBar position="fixed" style={{ backgroundColor: "#282828" }}>
                    <Container maxWidth="xxl" sx={{margin:"-5px"}}>
                        <Toolbar>
                             <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 2 }}>
                            {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
                            <Tooltip  title="Test Gen AI">
                                <img
                                onClick={handleImageClick}
                                src="/testgen2.png"
                                alt="Logo"
                                style={{ cursor: "pointer" }}
                                width="48"
                                height="35"
                                className="mx-1 d-inline-block align-text-top"
                            />
                            </Tooltip>
                            <Typography
                                variant="h6"
                                noWrap
                                component="a"
                                onClick={handleImageClick}
                                // href="/testGenerator"
                                sx={{
                                    cursor:'pointer',
                                    mr: 8,
                                    display: { xs: "none", md: "flex" },
                                    fontFamily: "monospace",
                                    fontWeight: 700,
                                    letterSpacing: ".1rem",
                                    color: "inherit",
                                    textDecoration: "none",
                                    marginLeft: "13px",
                                }}
                            >
                                Testgen.ai
                            </Typography>
</Box>
                                  {/* ====== MOBILE VIEW ====== */}
                            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                            <IconButton size="small" aria-label="navigation menu" aria-controls="menu-appbar-mobile" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
                                <MenuIcon />
                            </IconButton>
                            <Menu id="menu-appbar-mobile" anchorEl={anchorElNav} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'left' }} open={Boolean(anchorElNav)} onClose={handleCloseNavMenu}>
                                {pages.map((page) => (
                                    <MenuItem key={page} onClick={() => handleNavMenuClick(page)}><Typography textAlign="center">{page}</Typography></MenuItem>
                                ))}
                                <Divider />
                                <MenuItem onClick={() => handleLaunchModal("Ratings & Feedbacks")}><Typography textAlign="center">Feedbacks</Typography></MenuItem>
                                <MenuItem onClick={() => handleLaunchModal("Contact Us")}><Typography textAlign="center">Contact Us</Typography></MenuItem>
                            </Menu>
                        </Box>
                        
                        <Box sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1, justifyContent: 'center' }}>
                           {/* <img onClick={() => navigate('/testGenerator/')} src="/onoo.png" alt="Logo" style={{ cursor: "pointer", width: 40, height: 32 }}/> */}
                            <Typography variant="h6" noWrap component="a" href="/testGenerator" sx={{ ml:1, fontFamily: 'monospace', fontWeight: 700, color: 'inherit', textDecoration: 'none' }}>
                               Testgen.ai
                            </Typography>
                        </Box>

                        {/* --- Mobile Logo --- */}
                        {/* <Typography variant="h5" noWrap component="a" href="/testGenerator" sx={{ mr: 2, display: { xs: 'flex', md: 'none' }, flexGrow: 1, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.1rem', color: 'inherit', textDecoration: 'none' }}>
                           Testgen.ai
                        </Typography> */}

                            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                                {pages.map((page) => (
                                    <Button
                                        key={page}
                                        onClick={() => handleNavMenuClick(page)}
                                        sx={{
                                            my: 2,
                                            color: PAGE === page ? "white" : "#ccc",
                                            display: "block",
                                            fontWeight: PAGE === page ? 700 : 400,
                                            // borderBottom: PAGE === page ? "2px solid white" : "none"
                                        }}
                                    >
                                        {page}
                                    </Button>
                                ))}
                            </Box>

                            <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                            <Button sx={{ my: 2, color: "white", display: "block", mr: 1 }} onClick={() => handleLaunchModal("Ratings & Feedbacks")}>
                                Feedbacks
                            </Button>
                            <Button sx={{ my: 2, color: "white", display: "block", mr: 3 }} onClick={() => handleLaunchModal("Contact Us")}>
                                Contact Us
                            </Button>
                        </Box>

                               {/* ====== UNIVERSAL USER MENU ====== */}
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="User Options">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar sx={{ bgcolor: "cyan", color: "black", width: 35, height: 35, fontSize:"1rem" }}>{userName.toUpperCase()}</Avatar>
                                </IconButton>
                            </Tooltip>
                            <Menu sx={{ mt: '45px' }} id="menu-appbar-user" anchorEl={anchorElUser} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}>
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={() => handleProfileAction(setting)}>
                                        <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
                <Offset />

                <ThemeProvider theme={darkTheme}>
                    <Dialog
                    fullScreen={fullScreen}
                        open={open}
                        onClose={handleCloseModal}
                        aria-labelledby="confirm-dialog-title"
                        aria-describedby="confirm-dialog-description"
                        TransitionComponent={Slide}
                    >
                        <DialogTitle style={{ color: 'cyan', fontSize: '21px' }} className='text-center' id="confirm-dialog-title">
                            {modal}
                        </DialogTitle>
                        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
                            <DialogContentText id="confirm-dialog-description">
                                {modal === "Ratings & Feedbacks" && (
                                    <div>
                                        <Box sx={{ minWidth: '350px' }}>
                                            <StarIcon fontSize="medium" /> Rate us
                                            <br />
                                            <Box style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                                                <StyledRating
                                                    name="highlight-selected-only"
                                                    IconContainerComponent={IconContainer}
                                                    getLabelText={(value) => customIcons[value].label}
                                                    highlightSelectedOnly
                                                    sx={{ marginTop: '10px' }}
                                                    onChange={(event, newValue) => {
                                                        setRating(newValue);
                                                    }}
                                                    onChangeActive={(event, newHover) => {
                                                        setHover(newHover);
                                                        // console.log(customIcons[newHover])
                                                    }}
                                                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                                />
                                                {(hover !== -1) ? (
                                                    <span style={{ marginTop: '10px' }}>{customIcons[hover]["label"]}</span>
                                                ) : (<>
                                                    {rating && (<span style={{ marginTop: '7px' }}>{customIcons[rating]["label"]}</span>)}
                                                </>)}
                                            </Box>
                                        </Box>
                                        <Box sx={{ marginTop: '20px' }}>
                                            <ChatBubbleIcon fontSize="medium" /> Feedbacks

                                            <TextField
                                                id="outlined-multiline-static"
                                                label="Please enter your feedback here . . ."
                                                multiline
                                                fullWidth
                                                rows={7}

                                                variant="outlined"
                                                onChange={handleFeedbackChange}
                                                sx={{
                                                    marginTop: '15px',
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
                                    </div>
                                )}

                                {modal === "Contact Us" && (
                                    <Box
                                        sx={{
                                            padding: "20px",
                                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                                            borderRadius: "10px",
                                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                                            maxWidth: "400px",
                                            margin: "0 auto",
                                            textAlign: "left"
                                        }}
                                    >
                                        <Box sx={{ marginTop: "10px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255, 255, 255, 0.3)", paddingBottom: "5px" }}>
                                            <Typography sx={{ color: "white", fontSize: "18px", fontWeight: "500" }}><WhatsAppIcon color="success" /> WhatsApp :</Typography>
                                            <Typography sx={{ color: "lightgray", fontSize: "16px" }}>
                                                <Link
                                                    className="link-light mx-2"
                                                    to="https://api.whatsapp.com/send?phone=918863924419&text=Hi%20Deepak%2C%0ALet%27s%20talk%20about%20Testgen%20application"
                                                    target="_blank"
                                                    style={{ textDecoration: 'none' }}
                                                    onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                                    onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                                >
                                                    +91-8863924419
                                                </Link>
                                            </Typography>
                                        </Box>

                                        <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255, 255, 255, 0.3)", paddingBottom: "5px" }}>
                                            <Typography sx={{ color: "white", fontSize: "18px", fontWeight: "500" }}><EmailIcon color="warning" /> Email : </Typography>
                                            <Typography sx={{ color: "lightgray", fontSize: "16px", marginLeft: '40px' }}>
                                                <Link
                                                    className="link-light mx-2"
                                                    to="#"
                                                    style={{ textDecoration: 'none' }} // Replace # with actual email link
                                                    onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                                    onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                                >
                                                    deepakjha1104@gmail.com
                                                </Link>
                                            </Typography>
                                        </Box>

                                        <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255, 255, 255, 0.3)", paddingBottom: "5px" }}>
                                            <Typography sx={{ color: "white", fontSize: "18px", fontWeight: "500" }}><LinkedInIcon color="info" /> LinkedIn :</Typography>
                                            <Typography sx={{ color: "lightgray", fontSize: "16px" }}>
                                                <Link
                                                    className="link-light mx-2"
                                                    to="https://www.linkedin.com/in/deepak-kumar-jha-4ab8951bb/"
                                                    target="_blank"
                                                    style={{ textDecoration: 'none' }}
                                                    onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                                    onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                                >
                                                    Linkedin.com/deepakjha
                                                </Link>
                                            </Typography>
                                        </Box>

                                        <Box sx={{ marginTop: "20px", marginBottom: '5px', display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255, 255, 255, 0.3)", paddingBottom: "5px" }}>
                                            <Typography sx={{ color: "white", fontSize: "18px", fontWeight: "500" }}><GitHubIcon color="action" /> Github :</Typography>
                                            <Typography sx={{ color: "lightgray", fontSize: "16px" }}>
                                                <Link
                                                    className="link-light mx-2"
                                                    to="https://github.com/Deepak-DKJ"
                                                    target="_blank"
                                                    style={{ textDecoration: 'none' }}
                                                    onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                                    onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                                >
                                                    Github.com/deepakjha
                                                </Link>
                                            </Typography>
                                        </Box>
                                    </Box>

                                )}

                                {/* {modal === "Contact Us" && (
                                    <div>
                                        <Box sx={{ marginTop: "10px" }}>
                                            <WhatsAppIcon color="success" /> +91-8863924419
                                        </Box>
                                        <Box sx={{ marginTop: "20px" }}>
                                            <EmailIcon color="warning" /> deepakjha1104@gmail.com
                                        </Box>
                                        <Box sx={{ marginTop: "20px" }}>
                                            <LinkedInIcon color="info" /><Link className="link-light mx-2" to="https://www.linkedin.com/in/deepak-kumar-jha-4ab8951bb/" target="_blank">Linkedin.com/deepakjha</Link>
                                        </Box>
                                        <Box sx={{ marginTop: "20px" }}>
                                            <GitHubIcon color="action" /><Link className="link-light mx-2" to="https://github.com/Deepak-DKJ" target="_blank">Github.com/deepakjha</Link>
                                        </Box>
                                    </div>
                                )}
 */}

                                {modal === "My Profile" && (
                                    <Box
                                        sx={{
                                            padding: "20px",
                                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                                            borderRadius: "10px",
                                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                                            maxWidth: "400px",
                                            margin: "0 auto",
                                            textAlign: "left"
                                        }}
                                    >
                                        <Box sx={{ marginTop: "10px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255, 255, 255, 0.3)", paddingBottom: "5px" }}>
                                            <Typography sx={{ color: "lightgray", fontSize: "18px", fontWeight: "500" }}>Name :</Typography>
                                            <Typography sx={{ color: "white", fontSize: "16px" }}>{userData.name}</Typography>
                                        </Box>
                                        <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255, 255, 255, 0.3)", paddingBottom: "5px" }}>
                                            <Typography sx={{ color: "lightgray", fontSize: "18px", fontWeight: "500" }}>Email : </Typography>
                                            <Typography sx={{ color: "white", fontSize: "16px", marginLeft: '10px' }}>{userData.email}</Typography>
                                        </Box>
                                        <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255, 255, 255, 0.3)", paddingBottom: "5px" }}>
                                            <Typography sx={{ color: "lightgray", fontSize: "18px", fontWeight: "500" }}>Created On :</Typography>
                                            <Typography sx={{ color: "white", fontSize: "16px" }}>{userData.created}</Typography>
                                        </Box>
                                        {profile && (
                                            <>
                                                <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255, 255, 255, 0.3)", paddingBottom: "5px" }}>
                                                    <Typography sx={{ color: "lightgray", fontSize: "18px", fontWeight: "500" }}>Total Tests Generated :</Typography>
                                                    <Typography sx={{ color: "white", fontSize: "16px" }}>{profile.total}</Typography>
                                                </Box>
                                                <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255, 255, 255, 0.3)", paddingBottom: "5px" }}>
                                                    <Typography sx={{ color: "lightgray", fontSize: "18px", fontWeight: "500" }}>Tests Completed :</Typography>
                                                    <Typography sx={{ color: "white", fontSize: "16px" }}>{profile.total - profile.pending}</Typography>
                                                </Box>
                                                <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
                                                    <Typography sx={{ color: "lightgray", fontSize: "18px", fontWeight: "500" }}>Pending Tests :</Typography>
                                                    <Typography sx={{ color: "white", fontSize: "16px" }}>{profile.pending}</Typography>
                                                </Box>
                                            </>
                                        )}
                                    </Box>
                                )}



                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseModal} color="secondary" autoFocus>
                                Close
                            </Button>
                            {modal === "Ratings & Feedbacks" && (
                                <Button onClick={handleSubmitFeedback} color="success" autoFocus>
                                    Submit
                                </Button>
                            )}
                        </DialogActions>
                    </Dialog>
                </ThemeProvider>
            </>

        </div>
    )
}

export default NavBar
