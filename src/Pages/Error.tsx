import { Box } from "@mui/material";

export default function Error() {
    return (
        <Box sx={{marginTop: "10rem", marginRight: "auto", marginLeft: "auto", maxWidth: "50%", display: "flex", alignItems: "center", flexDirection: "column"}}>
            <img src="./404.png" alt="404_error" style={{height: "40%", width: "40%"}}/>
            <h1>The page you are looking for does not exist</h1>
        </Box>
    )
}
