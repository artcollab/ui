import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Palette, PeopleAlt } from '@mui/icons-material';
import MoreIcon from '@mui/icons-material/MoreVert';
import './Header.scss'
import { Autocomplete, CircularProgress, Container, Divider, Grid, InputAdornment, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Popover, Switch, TextField, Typography } from '@mui/material';
import { getAccessToken, getUserAsObject, logOut } from '../../Util/handleResponse';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { user } from '../../Types/User';
import { sendHTTPRequest } from '../../Actions/SendHTTPRequest';
import { FriendRequest } from '../../Types/FriendRequest';
import LetterAvatar from '../LetterAvatar/LetterAvatar';
import { v1 } from 'uuid';

const at = getAccessToken();
const User = getUserAsObject();

// event function used to switch from light mode to dark mode
function toggleTheme() {
    var currentTheme = document.documentElement.getAttribute("data-theme");
    var targetTheme = "default";

    if (currentTheme === "default" || !currentTheme) {
        targetTheme = "dark";
    }

    // sets an attribute in the HTML root element which can be found in Header.scss
    document.documentElement.setAttribute('data-theme', targetTheme)
    localStorage.setItem('theme', targetTheme);
}

////// Search Bar styles sourced from MUI component library///// 
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

///////////////////////////////////////////////////////////////

export default function Header() {
    const navigate = useNavigate();
    document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') ?? "default")

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);

    const [searchValue, setSearchValue] = useState("");
    const [searchResults, setSearchResults] = useState<Array<user>>([]);

    function fetchSearch(value: string): void {
        sendHTTPRequest("GET", `/users/search/${value}`, undefined, JSON.parse(at)).then((responseData) => setSearchResults(responseData as unknown as Array<user>))
            .catch((err) => console.log(err));
    }

    const [anchorCanvas, setAnchorCanvas] = useState<null | HTMLElement>(null);
    const handleCanvasClose = () => {
        setAnchorCanvas(null);
    }
    const handleCanvasClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorCanvas(event.currentTarget);
    }
    const canvasOpen = Boolean(anchorCanvas);
    const [canvasRequests, setCanvasRequests] = useState<any>([]);


    const [anchorFriends, setAnchorFriends] = useState<null | HTMLElement>(null);
    const handleFriendsClose = () => {
        setAnchorFriends(null);
    }
    const handleFriendsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorFriends(event.currentTarget);
    }
    const friendsOpen = Boolean(anchorFriends);
    const exampleRequest: FriendRequest = {
        request_id: 'dawdwad',
        to_user: 'wadwad',
        from_user: 'James Beach',
        status: 'Pending'
    }
    const exampleRequest2: FriendRequest = {
        request_id: 'dawdwad',
        to_user: 'wadwad',
        from_user: 'Cade Brown',
        status: 'Pending'
    }
    const exampleRequest3: FriendRequest = {
        request_id: 'dawdwad',
        to_user: 'wadwad',
        from_user: 'Oli Radlett',
        status: 'Pending'
    }
    const [friendRequests, setFriendRequests] = useState<Array<FriendRequest>>([exampleRequest, exampleRequest2, exampleRequest3]);

    function handleRequestResponse(response: string, type: string, requestID: string) {
        sendHTTPRequest("POST", `/users/friends/request/${response}/${requestID}`, undefined, JSON.parse(at)).then((responseData) => {
            fetchAllRequests();
            console.log(type);
        }).catch((err) => console.log(err));
    }

    function fetchFriendRequests() {
        sendHTTPRequest("GET", `/users/friends/${User.username}/requests/to`, undefined, JSON.parse(at)).then((responseData) => {
            setFriendRequests(responseData as unknown as Array<FriendRequest>);
        }).catch((err) => console.log(err));
    }

    function fetchCanvasRequests() {
        sendHTTPRequest("GET", `TBA`, undefined, JSON.parse(at)).then((responseData) => {
            setCanvasRequests(responseData as unknown /* as Array<FriendRequest> */);
        }).catch((err) => console.log(err));
    }

    function fetchAllRequests() {
        if(at && User) {
            fetchFriendRequests();
            fetchCanvasRequests();
        }
    }

    useEffect(() => {
        fetchAllRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const renderCanvasRequests = (
        <Popover
            keepMounted
            anchorEl={anchorCanvas}
            open={canvasOpen}
            onClose={handleCanvasClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left"
            }}
        >
            <Container sx={{ maxWidth: "20rem", width: "20rem" }}>
                <Typography sx={{ p: 1 }}>Canvas Requests</Typography>
                <Divider />
                {canvasRequests.length === 0 ? (
                    <Typography sx={{ p: 1 }}> You have no active canvas requests</Typography>
                ) :
                    <></>
                }
            </Container>
        </Popover>
    );

    const renderFriendRequests = (
        <Popover
            keepMounted
            anchorEl={anchorFriends}
            open={friendsOpen}
            onClose={handleFriendsClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left"
            }}
        >
            <Container sx={{ width: "fit-content", backgroundColor: "#f9f9f9" }}>
                <Typography variant='subtitle1' sx={{ p: 1 }}>Friend Requests</Typography>
                {friendRequests.length === 0 ? (
                    <Typography sx={{ p: 1 }}> You have no active friend requests</Typography>
                ) :
                    <List >
                        <Divider />
                        {friendRequests.map((request) => {
                            return (
                                <div key={v1()}>
                                    <ListItem sx={{ color: "grey" }} alignItems='flex-start'>
                                        <Grid container>
                                            <Grid item xs={2} sx={{ margin: "auto" }}><ListItemAvatar sx={{ margin: "auto" }}><LetterAvatar firstName={request.from_user.split(' ')[0]} surname={request.from_user.split(' ')[1]} /></ListItemAvatar></Grid>
                                            <Grid item xs={4} sx={{ margin: "auto" }}><ListItemText>{request.from_user}</ListItemText></Grid>
                                            <Grid item xs={3} sx={{ margin: "auto" }}><ListItemButton onClick={() => handleRequestResponse("accept", "friends", request.request_id)} sx={{ backgroundColor: "#b7ffbb" }}>Accept</ListItemButton></Grid>
                                            <Grid item xs={3} sx={{ margin: "auto" }}><ListItemButton onClick={() => handleRequestResponse("cancel", "friends", request.request_id)}  sx={{ backgroundColor: "#ffbbc2" }}>Decline</ListItemButton></Grid>
                                        </Grid>
                                    </ListItem>
                                    <Divider />
                                </div>
                            )
                        })}
                    </List>
                }
            </Container>
        </Popover >
    );

    const menuId = 'primary-search-account-menu';

    // menu appears upon clicking the profile icon
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            id={menuId}
            keepMounted
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
            <MenuItem onClick={() => { logOut(); navigate("/home") }}>Log Out</MenuItem>
            <MenuItem>Toggle Theme <Switch onClick={toggleTheme} /></MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton
                    size="large"
                    edge="end"
                    onClick={() => { }}
                    color="inherit"
                >
                    <Badge badgeContent={1} color="error">
                        <Palette />
                    </Badge>
                </IconButton>
                <p>Canvas Requests</p>
            </MenuItem>
            <MenuItem>
                <IconButton
                    size="large"
                    color="inherit"
                >
                    <Badge badgeContent={17} color="error">
                        <PeopleAlt />
                    </Badge>
                </IconButton>
                <p>Friend Requests</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" color='inherit' className="DrawDojo__icons" data-testid="header-test">
                <Toolbar>
                    <input type="image" src="logo2.PNG" alt="DrawDojo Logo - Desktop" className='DrawDojo__logo' onClick={() => navigate("/home")} />
                    <input type="image" src="mobileIcon.PNG" alt="DrawDojo Logo - Mobile" className='DrawDojo__icon' onClick={() => navigate("/home")} />
                    {at &&
                        <Search style={{ marginLeft: "15%" }}>
                            <Autocomplete
                                id="combo-box-demo"
                                options={searchResults}
                                getOptionLabel={option => `${option.name} ${option.surname}`}
                                disableClearable
                                forcePopupIcon={false}
                                renderInput={params => {
                                    return (
                                        <TextField
                                            {...params}
                                            label="Search..."
                                            fullWidth
                                            sx={{ width: "15rem" }}
                                            size="small"
                                            value={searchValue}
                                            onChange={(e) => {
                                                setSearchValue(e.target.value);
                                                if (e.target.value.length > 3) fetchSearch(e.target.value)
                                            }
                                            }
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        {searchResults.length === 0 && searchValue !== "" ? <CircularProgress className="searchIcon" size="1.5rem" /> : <SearchIcon className="searchIcon" />}
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    );
                                }}
                            />
                        </Search>
                    }
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }} style={{ paddingRight: "25%" }}>
                        <IconButton
                            size="large"
                            edge="end"
                            onClick={handleCanvasClick}
                            color="inherit"
                            sx={{ paddingInlineEnd: "1rem" }}
                        >
                            <Badge badgeContent={canvasRequests.length} color="error">
                                <Palette />
                            </Badge>
                        </IconButton>
                        <IconButton
                            size="large"
                            edge="end"
                            color="inherit"
                            sx={{ paddingInlineEnd: "1rem" }}
                            onClick={handleFriendsClick}
                        >
                            <Badge badgeContent={friendRequests.length} color="error">
                                <PeopleAlt />
                            </Badge>
                        </IconButton>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                            sx={{ paddingInlineEnd: "1rem" }}
                        >
                            <AccountCircle />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderCanvasRequests}
            {renderFriendRequests}
            {renderMobileMenu}
            {renderMenu}
        </Box>
    );
}
