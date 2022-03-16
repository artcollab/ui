import { Box, Button, Paper, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendHTTPRequest } from "../../Actions/SendHTTPRequest";
import { getAccessToken, getUserAsObject } from "../../Util/handleResponse";
import "./Canvas.scss";


type PostSubmissionProps = {
    image: string,
    canvasSize: string
}

const user = getUserAsObject();
const at = getAccessToken();

// post submission elements to store inside modal, takes an SVG string of the image as parameter
export default function PostSubmission(props: PostSubmissionProps) {
    const navigate = useNavigate();
    const svg = props.image;
    const size = props.canvasSize;

    // converting the image string to an ingestible format
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const image = document.createElement('img'); image.addEventListener('load', () => {URL.revokeObjectURL(url)}, { once: true }); image.src = url;

    const [captionText, setCaptionText] = useState("");

    return (
        <Paper className="modalContainer">
            <img className="imagePreview" src={image.src} alt="Image_Preview" />
            <Box className="fieldContainer">
                <TextField
                    multiline
                    rows={6}
                    label="Image Caption"
                    placeholder="Enter a caption here"
                    value={captionText}
                    onChange={(e) => {setCaptionText(e.target.value)}}
                />
                <Button variant="outlined" onClick={() => {sendHTTPRequest("POST", "/posts", JSON.stringify({author: user, title: captionText, content: svg, canvasSize: size}), JSON.parse(at!)); navigate("/home")}} sx={{marginTop: "2%"}}>Submit</Button>
            </Box>
        </Paper>
    )
}
