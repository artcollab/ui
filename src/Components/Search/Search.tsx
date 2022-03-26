import { Card, Divider, Grid, Link, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { v1 } from "uuid";
import { sendHTTPRequest } from "../../Actions/SendHTTPRequest";
import { user } from "../../Types/User";
import { getAccessToken } from "../../Util/handleResponse";
import LetterAvatar from "../LetterAvatar/LetterAvatar";

const at = getAccessToken();

function Search() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { query } = state as unknown as { query: string } ?? "";

    useEffect(() => {
        if (!state || !query) {
            navigate("/error");
        }
    }, [navigate, query, state]);

    const [results, setResults] = useState<Array<user> | undefined>(undefined);
    useEffect(() => {
        sendHTTPRequest("GET", `/users/search/${query}`, undefined, JSON.parse(at!))
            .then((responseData) => {
                setResults(JSON.parse(responseData as unknown as string) as Array<user>);
            })
            .catch((err) => { console.log(err) });
    }, [query]);

    return (
        <>
            {results && (
                <Card variant="outlined" sx={{ width: "30%", marginTop: "10rem", marginLeft: "auto", marginRight: "auto" }}>
                    <Typography variant='subtitle1' sx={{ p: 1 }}>Search Results</Typography>
                    {results.length === 0 ? (
                        <Typography sx={{ p: 1 }}> No users found</Typography>
                    ) :
                        <List >
                            <Divider />
                            {results.map((user) => {
                                return (
                                    <div key={v1()}>
                                        <ListItem sx={{ color: "grey" }} alignItems='flex-start'>
                                            <Grid container>
                                                <Grid item xs={3} sx={{ margin: "auto" }}>
                                                    <Link href={`/profile/${user.id}`}>
                                                        <ListItemAvatar sx={{ margin: "auto" }}>
                                                            <LetterAvatar firstName={user.name} surname={user.surname} />
                                                        </ListItemAvatar>
                                                    </Link>
                                                </Grid>
                                                <Grid item xs={9} sx={{ margin: "auto" }}>
                                                    <Link href={`/profile/${user.id}`}>
                                                        <ListItemText>
                                                            {user.name} {user.surname}
                                                        </ListItemText>
                                                    </Link>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                        <Divider />
                                    </div>
                                )
                            })}
                        </List>
                    }
                </Card>
            )}
        </>
    );
}

export default Search;