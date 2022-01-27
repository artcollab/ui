import { Box, IconButton, InputBase, Paper } from "@mui/material";
import { comment } from "../../Types/Comment";
import SendIcon from '@mui/icons-material/Send';
import { v1 } from "uuid";
import { user } from "../../Types/User";
import { useState } from "react";
import "./Canvas.scss"

type ChatBoxProps = {
    messageList: Array<comment | string>,
    postMessage: any,
    user: user
}

export default function ChatBox({ messageList, postMessage, user }: ChatBoxProps) {
    const [messageValue, setMessageValue] = useState("");

    return (
        <Paper className={"chatBox"}>
            <Box className="messagesContainer">
                {messageList.map((message) => {
                    let received = ""
                    if (typeof message == "object") received = message.user.id === user.id ? "" : "messageReceived";
                    return (
                        <>
                            {typeof message == "object" ?
                                <div className="messageContainer" key={v1()}>
                                    {message.user.id !== user.id ?
                                        <div className="messageName">
                                            {message.user.name}
                                        </div>
                                        :
                                        ""
                                    }
                                    <div className={"messageContent " + received}>
                                        {message.text}
                                    </div>
                                </div>
                                :
                                <div className="statusContainer" key={v1()}>{message}</div>
                            }
                        </>
                    )
                })}
            </Box>
            <Paper>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Send A Message"
                    value={messageValue}
                    onChange={(e) => setMessageValue(e.target.value)}
                />
                <IconButton type="submit" sx={{ p: '10px' }} onClick={() => { postMessage(messageValue); setMessageValue("") }}>
                    <SendIcon />
                </IconButton>
            </Paper>
        </Paper>
    )
}