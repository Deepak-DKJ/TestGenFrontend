import React, { useContext, useState } from "react";
import { Button, Box, Typography, Grid } from "@mui/material";
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
    sliderContainer: {
        width: "50%", // Adjust slider width
        margin: "10px auto", // Center the slider
    },
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "20px",
    },
    inputSection: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        padding: "20px",
        marginBottom: "10px",
    },
    inputHalf: {
        flex: 1,
        margin: "0 20px",
        backgroundColor: "#2E2E2E",
        padding: "20px",
        borderRadius: "10px",
    },
    textField: {
        backgroundColor: "#3E3E3E",
        borderRadius: "10px",
    },
    uploadBox: {
        padding: "20px",
        borderRadius: "10px",
        border: "1px solid #555",
        backgroundColor: "#2E2E2E",
    },
    sliderSection: {
        width: "100%",
        textAlign: "center",
        marginBottom: "10px",
    },

    button: {
        marginLeft: "20px",
        padding: "15px 25px",
        fontSize: "18px",
        fontWeight: "bold",
        backgroundColor: "#4caf50", // Green color for the "My Tests" button
        color: "#fff",
        borderRadius: "28px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    },
    myTestsButton: {
        padding: "15px 25px", // Add more padding to make it bigger
        fontSize: "18px", // Larger text
        fontWeight: "bold",
        backgroundColor: "#1976d2",
        color: "#fff",
        borderRadius: "28px", // Rounded corners
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    },
};
const NavBar = () => {

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
        setModal(md)
        setOpen(true)
    }

    const [rating, setRating] = React.useState(null);
    const [hover, setHover] = React.useState(-1);

    const userData = JSON.parse(localStorage.getItem("userdata"))
    let name = "NA"
    if(userData)
    name = userData.name.split(" ")
    let userName = ""
    if (name.length > 1) {
        userName += (name[0][0] + name[1][0])
    }
    else {
        userName = (name[0][0] + name[0][name[0].length - 1])
    }
    const navigate = useNavigate()
    const handleDurChange = (e) => {
        setDur(e.target.value)
    }
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

        handleCloseModal()
        setAlert({
            vis: true,
            msg: "Ratings & Feedbacks submitted successfully !",
        });
    }

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = (page) => {
        if (page === "Home")
            navigate('/testGenerator/')
        else if (page === "Create")
            navigate('/testGenerator/mcqs/create')
        else if (page === "Dashboard")
            navigate('/testGenerator/mcqs/mytests')
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const [profile, setProfile] = useState(null)

    const handleProfile = async (set) => {
        // console.log(set)
        if(set === "Sign out")
        {
            localStorage.removeItem('token');
            navigate("/testGenerator/login")
            return
        }
        if (set === "My Profile") {
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
            handleLaunchModal(set)
            return
        }
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
                <AppBar position="sticky" style={{ backgroundColor: "#282828" }}>
                    <Container maxWidth="xxl">
                        <Toolbar>
                            {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
                            <img
                                src="/onoo.png"
                                alt="Logo"
                                width="58"
                                height="44"
                                className="mx-1 d-inline-block align-text-top"
                            />
                            <Typography
                                variant="h6"
                                noWrap
                                component="a"
                                href="/testGenerator"
                                sx={{
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

                            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                                {pages.map((page) => (
                                    <Button
                                        key={page}
                                        onClick={() => handleCloseNavMenu(page)}
                                        sx={{ my: 2, color: "white", display: "block" }}
                                    >
                                        {page}
                                    </Button>
                                ))}
                            </Box>


                            <Button
                                sx={{ my: 2, color: "white", display: "block", marginRight: '10px' }}
                                onClick={() => handleLaunchModal("Ratings & Feedbacks")}
                            >
                                Feedbacks
                            </Button>

                            <Button
                                sx={{ my: 2, color: "white", display: "block", marginRight: '40px' }}
                                onClick={() => handleLaunchModal("Contact Us")}
                            >
                                Contact Us
                            </Button>

                            <Box sx={{ flexGrow: 0 }}>


                                <Tooltip title="User logged in">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        {/* <Button sx={{ my: 2, color: 'white', display: 'block', marginRight:'20px' }}>Ratings & Feedbacks</Button> */}
                                        <Avatar
                                            sx={{
                                                color: "black",
                                                backgroundColor: "cyan",
                                                width: 45,
                                                height: 45,
                                            }}
                                        >
                                            {userName.toUpperCase()}
                                        </Avatar>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{
                                        mt: "45px",
                                        "& .MuiPaper-root": {
                                            backgroundColor: "#333", // Dark background for the menu
                                            color: "white", // White text color
                                        },
                                    }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {settings.map((setting) => (
                                        <MenuItem
                                            key={setting}
                                            sx={{
                                                "&:hover": {
                                                    backgroundColor: "#444", // Darker background on hover
                                                },
                                                color: "white", // White text color
                                            }}
                                            onClick={() => handleProfile(setting)}
                                        >
                                            <Typography sx={{ textAlign: "center" }}>
                                                {setting === "My Profile" ? <AccountCircleIcon /> : <LogoutIcon />} {setting}
                                            </Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>

                <ThemeProvider theme={darkTheme}>
                    <Dialog
                        open={open}
                        onClose={handleCloseModal}
                        aria-labelledby="confirm-dialog-title"
                        aria-describedby="confirm-dialog-description"
                        TransitionComponent={Slide}
                    >
                        <DialogTitle className='text-center' id="confirm-dialog-title">
                            {modal}
                        </DialogTitle>
                        <DialogContent>
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
                                         {userData.email}
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
                                 
                                   <Box sx={{ marginTop: "20px", marginBottom:'5px', display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255, 255, 255, 0.3)", paddingBottom: "5px" }}>
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
                                            <Typography sx={{ color: "white", fontSize: "18px", fontWeight: "500" }}>Name :</Typography>
                                            <Typography sx={{ color: "lightgray", fontSize: "16px" }}>{userData.name}</Typography>
                                        </Box>
                                        <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255, 255, 255, 0.3)", paddingBottom: "5px" }}>
                                            <Typography sx={{ color: "white", fontSize: "18px", fontWeight: "500" }}>Email : </Typography>
                                            <Typography sx={{ color: "lightgray", fontSize: "16px", marginLeft: '10px' }}>{userData.email}</Typography>
                                        </Box>
                                        <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255, 255, 255, 0.3)", paddingBottom: "5px" }}>
                                            <Typography sx={{ color: "white", fontSize: "18px", fontWeight: "500" }}>Created On :</Typography>
                                            <Typography sx={{ color: "lightgray", fontSize: "16px" }}>{userData.created}</Typography>
                                        </Box>
                                        <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255, 255, 255, 0.3)", paddingBottom: "5px" }}>
                                            <Typography sx={{ color: "white", fontSize: "18px", fontWeight: "500" }}>Total Tests Generated :</Typography>
                                            <Typography sx={{ color: "lightgray", fontSize: "16px" }}>{profile.total}</Typography>
                                        </Box>
                                        <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255, 255, 255, 0.3)", paddingBottom: "5px" }}>
                                            <Typography sx={{ color: "white", fontSize: "18px", fontWeight: "500" }}>Tests Completed :</Typography>
                                            <Typography sx={{ color: "lightgray", fontSize: "16px" }}>{profile.total - profile.pending}</Typography>
                                        </Box>
                                        <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
                                            <Typography sx={{ color: "white", fontSize: "18px", fontWeight: "500" }}>Pending Tests :</Typography>
                                            <Typography sx={{ color: "lightgray", fontSize: "16px" }}>{profile.pending}</Typography>
                                        </Box>
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
