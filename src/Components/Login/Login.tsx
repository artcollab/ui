import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import './Login.scss';
import { useNavigate } from 'react-router-dom';
import { handleResponse } from '../../Util/handleResponse';

function Login() {
    const navigate = useNavigate();
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        setErrorText("");
        event.preventDefault();
        // extracting form data
        const data = new FormData(event.currentTarget);
        const body = JSON.stringify(Object.fromEntries(data.entries())); // converting formdata to a JSON object that can be ingested by the db

        const url = "http://localhost:8080/auth/login"
        const req = new XMLHttpRequest();
        
        req.open("POST", url, true); // open async http post request
        req.setRequestHeader("Content-Type", "application/json");
        req.onreadystatechange = () => {
            if(req.readyState === 4 && req.status === 200) {
                // on successful request, handle the response
                handleResponse(req.response);
                navigate("/home");
            }
            else {
                if(req.responseText) setErrorText(JSON.parse(req.responseText)['error']);
            }
        };
        req.send(body);
    };

    const [emailValid, setEmailValid] = useState(true);

    const validateEmail = (e : React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
        if(regex.test(value) || value === "") setEmailValid(true);
        else setEmailValid(false);
        
    }

    // submission error text
    const [errorText, setErrorText] = useState("");

    return (
        <Container className="loginContainer" component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar className="loginIcon" sx={{ m: 1 }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        error={!emailValid}
                        helperText={emailValid ? "" : "Invalid email"}
                        onChange={validateEmail}
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        placeholder="Email Address"
                        variant="filled"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        variant="filled"
                        helperText={errorText}
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        className="loginButton"
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/register" variant="body2">
                                Don't have an account? Sign Up
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}

export default Login;