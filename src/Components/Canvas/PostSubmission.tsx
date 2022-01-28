import { Box, Button, Paper, TextField } from "@mui/material";
import { useState } from "react";
import "./Canvas.scss";

type PostSubmissionProps = {
    image: string
}

// post submission elements to store inside modal, takes an SVG string of the image as parameter
export default function PostSubmission(props: PostSubmissionProps) {
    const svg = props.image;

    // converting the image string to an ingestible format
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const image = document.createElement('img'); image.addEventListener('load', () => URL.revokeObjectURL(url), { once: true }); image.src = url;

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
                    onChange={(e) => setCaptionText(e.target.value)}
                />
                <Button variant="outlined" sx={{marginTop: "2%"}}>Submit</Button>
            </Box>
        </Paper>
    )
}