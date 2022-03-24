import { Box, IconButton, InputBase, Paper } from "@mui/material";
import { chatBoxComment } from "../../Types/Comment";
import SendIcon from '@mui/icons-material/Send';
import { user } from "../../Types/User";
import { useState } from "react";
import { v1 } from "uuid"
import "./Canvas.scss"

type ChatBoxProps = {
    messageList: Array<chatBoxComment | string>,
    postMessage: any,
    user: user
}

// ChatBox displays a list of messages from a parameter, messages posted by the client are sent to the parent component using a callback function
export default function ChatBox({ messageList, postMessage, user }: ChatBoxProps) {
    const [messageValue, setMessageValue] = useState("");

    return (
        <Paper className={"chatBox"}>
            <Box className="messagesContainer">
                {messageList.map((message, id) => {
                    let received = ""
                    if (typeof message == "object") received = message.user.id === user.id ? "" : "messageReceived";
                    return (
                        <div key={v1()}>
                            {/* if the message is a comment type, display as comment, else it must be a status message */}
                            {typeof message == "object" ?
                                <div className="messageContainer" key={id}>
                                    {message.user.id !== user.id ?
                                        <div className="messageName">
                                            {message.user.username}
                                        </div>
                                        :
                                        ""
                                    }
                                    <div className={"messageContent " + received}>
                                        {message.text}
                                    </div>
                                </div>
                                :
                                <div className="statusContainer">{message}</div>
                            }
                        </div>
                    )
                })}
            </Box>
            <Paper>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Send A Message"
                    value={messageValue}
                    onChange={(e) => {setMessageValue(e.target.value)}}
                />
                <IconButton type="submit" sx={{ p: '10px' }} onClick={() => { postMessage(messageValue); setMessageValue("") }}>
                    <SendIcon />
                </IconButton>
            </Paper>
        </Paper>
    )
}