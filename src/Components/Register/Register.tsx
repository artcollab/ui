import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import './Register.scss';

function Register() {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const body = JSON.stringify(Object.fromEntries(data.entries())); // converting formdata to a JSON object that can be ingested by the db

        const url = "https://api.operce.net/auth/register"
        const req = new XMLHttpRequest();
        
        req.open("POST", url, true); // open async http post request
        req.setRequestHeader("Content-Type", "application/json");
        req.onreadystatechange = () => {
            if(req.readyState === 4 && req.status === 201) {
                console.log(JSON.parse(req.status.toString()));
            }
        };
        req.send(body);
    };

    const [emailValid, setEmailValid] = useState(true);

    const validateEmail = (e : React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;   // value inside email textField
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;  // regex pattern which matches the format of email addresses
    
        if(regex.test(value) || value === "") setEmailValid(true); // if the textField value matches the email regular expression, it is valid
        else setEmailValid(false);
        
    }

    const nameRegex = /^[A-Za-z-]*$/;   // regex pattern matches only alphabetical characters or hyphens (for hyphenated names) without spaces
    const [firstName, setFirstName] = useState("");
    const [surname, setSurname] = useState("");

    return (
        <Container className="registerContainer" component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar className='registerIcon' sx={{ m: 1 }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Register
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="name"
                                required
                                fullWidth
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                error={!nameRegex.test(firstName)}
                                helperText={nameRegex.test(firstName) ? "" : "Invalid Name"}
                                id="firstName"
                                label="First Name"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="surname"
                                autoComplete="family-name"
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                error={!nameRegex.test(surname)}
                                helperText={nameRegex.test(surname) ? "" : "Invalid Name"}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                error={!emailValid}
                                helperText={emailValid ? "" : "Invalid email"}
                                onChange={validateEmail}
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="username"
                                label="User Name"
                                name="username"
                                autoComplete="username"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        className="registerButton"
                    >
                        Register
                    </Button>
                    <Grid container justifyContent="center">
                        <Grid item>
                            <Link href="#">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}

export default Register;