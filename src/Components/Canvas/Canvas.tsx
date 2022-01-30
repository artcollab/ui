import React, { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import "./Canvas.scss";
import { Button, ButtonGroup, Grid, Input, Modal, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { ToolBarItem } from '../../Types/ToolbarItems';
import { hexToRgb } from '../../Util/HexToRGB';
import { io } from 'socket.io-client';
import { v1 } from 'uuid';
import { comment } from '../../Types/Comment';
import { user } from '../../Types/User';
import ChatBox from './ChatBox';
import PostSubmission from './PostSubmission';
import { FaMousePointer, FaSquareFull, FaCircle } from "react-icons/fa";
import { IoTriangle } from "react-icons/io5";
import { BsBrushFill } from "react-icons/bs";
import { getAccessToken, getUserAsObject } from '../../Util/handleResponse';

type canvasProps = {
    room: string
}

const tempUser: user = {
    id: '',
    username: '',
    email: '',
    name: '',
    surname: '',
    password: ''
};

const fetchedData = getUserAsObject();
const User: user = fetchedData ? fetchedData : tempUser;
const at = getAccessToken();

const socket = io('https://api.operce.net:8080', {
    query: { secret: at }
});     // connect to socket io server

function Canvas(props: canvasProps) {
    const [canvas, setCanvas] = useState<fabric.Canvas | undefined>(undefined);
    let room = props.room;

    // Brush attributes, colour, size and opacity
    const [colour, setColour] = useState("#000000");
    const [brushSize, setBrushSize] = useState(1);
    const [opacity, setOpacity] = useState(100);

    // Currently equipped drawing tool, types can be found in types/ToolBarItems.ts
    const [currentTool, setCurrentTool] = useState<ToolBarItem>("move");

    // Chat box elements to display
    const [messageList, setMessageList] = useState<Array<comment | string>>([]);

    // Modal settings
    const [open, setOpen] = useState(false);

    // To help prevent feedback loops, we store the last received object received through socket io
    const receivedObject = useRef<fabric.Object>();

    // Event function to switch between toolbar items, paint tool functionality must be declared seperately using canvas.isDrawingMode
    const ToggleTool = (e: React.MouseEvent<HTMLElement>, newTool: string) => {
        if (canvas) {
            if (currentTool === "paint") canvas.isDrawingMode = false;
            if (newTool === "paint" && !canvas.isDrawingMode) canvas.isDrawingMode = true;
            setCurrentTool(newTool as ToolBarItem);
        }
    }

    // upon sending posting a message to the chat box, the message list is updated and page is re-rendered
    const postMessage = (message: string) => {
        let newMessage: comment = {
            user: User,
            text: message
        }
        setMessageList([...messageList, newMessage]);
        // message sent to the server to be broadcasted to other users
        socket.emit("newMessage", newMessage);
    }

    // canvas initial state
    function initCanvas(): fabric.Canvas {
        return (
            new fabric.Canvas("canvas", {
                height: 600,
                width: 600,
                backgroundColor: 'white',
            })
        );
    }

    // When brush colour, size or opacity is changed, this hook block applies new attribute(s)
    useEffect(() => {
        if (canvas) {
            const rgb = hexToRgb(colour)!;

            // in order to access the opacity attribute, the colour must be converted from hex to rgb
            canvas.freeDrawingBrush.color = "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + opacity / 100 + ")";
            canvas.freeDrawingBrush.width = brushSize;
        }

    }, [colour, brushSize, opacity, canvas]);

    // Using an empty dependency list, this block only runs on page load. Therefore this is quite useful for initializing the canvas
    useEffect(() => {
        if (!canvas) {
            let username = User.username;

            setCanvas(initCanvas());
            socket.emit("joinRoom", { username, room });
        }
    }, [canvas, room]);

    // listens for new messages being sent, adds them to the message list and re-renders the page
    socket.on("addMessage", (message: comment) => {
        setMessageList([...messageList, message]);
    });

    // listens for new status messages, also added to the message list and page is re-rendered
    socket.on("addStatus", (message) => {
        setMessageList([...messageList, message]);
    })

    // For each change in the canvas, new changes are emitted to the socket server
    useEffect(() => {

        // Canvas event listener detects whenever an object is added to the page, if the object isn't a duplicate, we emit it.
        canvas?.on("object:added", (object) => {
            // This comparison allows us to know whether or not this object was created by this client or received by socket io
            let dupe = object.target === receivedObject.current;
            let id = v1();

            if (socket && !dupe && object.target) {
                let newObj = { id: id, obj: object.target };
                newObj.obj.set({ name: id });
                socket.emit('newObject', newObj);
            }
        })

        canvas?.on("object:modified", (object) => {
            // finding the same object in the object list in order to preserve the ID
            let newObject = canvas.getObjects().find((e) => e.name === object.target!.name);
            newObject?.set({ name: object.target!.name });
            if (newObject) socket.emit('newModification', { id: object.target!.name, obj: newObject });
        });

        canvas?.on("object:moving", (object) => {
            // finding the same object in the object list in order to preserve the ID
            let newObject = canvas.getObjects().find((e) => e.name === object.target!.name);
            newObject?.set({ name: object.target!.name });
            if (newObject) socket.emit('newModification', { id: object.target!.name, obj: newObject });
        });

        // listens for io events calling to clear the page, this happens after a client sends a request for the canvas to be cleared in the requestCanvasClear event
        socket.on("clearCanvas", () => {
            canvas?.clear();
        })

        // Restarting this listener helps prevent duplicate events being fired
        socket.off('addObject');
        socket.on('addObject', (object: { id: string, obj: fabric.Object }) => {
            const { id, obj } = object;
            let newObj: any;

            // When adding the object raw, the browser exhibits strange breaking behaviour, instead we add the data to a new object using the spread operator
            if (obj.type === "rect") {
                newObj = new fabric.Rect({
                    ...obj
                });
            }

            if (obj.type === "circle") {
                newObj = new fabric.Circle({
                    ...obj
                });
            }

            if (obj.type === "triangle") {
                newObj = new fabric.Triangle({
                    ...obj
                });
            }

            if (obj.type === "path") {
                newObj = new fabric.Path((obj as fabric.Path).path, { ...obj });
            }

            newObj.set({ name: id });
            receivedObject.current = newObj!;
            // Adding new object to canvas and rendering
            canvas?.add(newObj!);
            canvas?.renderAll();
        });

        // listens for object modifications being sent, updates the position of modified object on client side
        socket.on('modifyObject', (object) => {
            canvas?.getObjects().forEach((element) => {
                if (object.id === element.name) {
                    element.set({ ...object.obj })
                    element.setCoords();
                    canvas?.renderAll();
                    element.set({ name: object.id });
                }
            })

        });
    }, [canvas]);

    const addObject = (e: any) => {
        let object: fabric.Object;

        // Extracting mouse location to allow us to choose the position of the object
        let pointer = canvas?.getPointer(e);
        let mouseX = pointer!.x;
        let mouseY = pointer!.y;

        let defaultSize = 100;

        if (currentTool === "square") {
            object = new fabric.Rect({
                height: defaultSize,
                width: defaultSize,
                fill: colour,
                left: mouseX - (defaultSize / 2), // default origin point is in the top left corner of the object, this line resets it to center
                top: mouseY - (defaultSize / 2),
            });
        }

        else if (currentTool === "triangle") {
            object = new fabric.Triangle({
                width: defaultSize,
                height: defaultSize,
                fill: colour,
                left: mouseX - (defaultSize / 2),
                top: mouseY - (defaultSize / 2)
            })
        }
        else if (currentTool === "ellipse") {
            object = new fabric.Circle({
                radius: defaultSize / 2,
                fill: colour,
                left: mouseX - (defaultSize / 2),
                top: mouseY - (defaultSize / 2)
            })
        }

        // Adding new object to canvas and rendering
        canvas?.add(object!)
        canvas?.renderAll()

        // After addingfan object, tool is swapped back to the move tool, this prevents some ugly behaviour
        setCurrentTool("move");
    };

    return (
        <>
            <Grid container sx={{ marginTop: "10rem" }}>
                <Grid item className="brushToolContainer">
                    <ButtonGroup>
                        <Button type='button' name='clear' onClick={() => socket.emit('requestCanvasClear')}>Clear</Button>
                        <Button><Input type="color" className="colorInput" value={colour} onChange={(e) => setColour(e.target.value)} disableUnderline />Colour</Button>
                        <Button >
                            <Input
                                value={brushSize}
                                onChange={(e: any) => { setBrushSize(parseInt(e.target.value, 10) || 1) }}
                                size="small"
                                disableUnderline
                                inputProps={{
                                    step: 1,
                                    min: 1,
                                    max: 100,
                                    type: "number"
                                }}
                                sx={{ width: "3rem", marginRight: "0.5rem" }}
                            />
                            Brush Size
                        </Button>
                        <Button >
                            <Input
                                value={opacity}
                                onChange={(e: any) => { setOpacity(parseInt(e.target.value, 10) || 1) }}
                                size="small"
                                disableUnderline
                                inputProps={{
                                    step: 1,
                                    min: 0,
                                    max: 100,
                                    type: "number"
                                }}
                                sx={{ width: "3rem", marginRight: "0.5rem" }}
                            />
                            Opacity
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
            <Grid container spacing={2} className="gridContainer">
                <Grid item >
                    <ToggleButtonGroup exclusive value={currentTool} onChange={ToggleTool} orientation='vertical'>
                        <ToggleButton value="move">
                            <FaMousePointer />
                        </ToggleButton>
                        <ToggleButton value="paint">
                            <BsBrushFill />
                        </ToggleButton>
                        <ToggleButton value="square">
                            <FaSquareFull />
                        </ToggleButton>
                        <ToggleButton value="triangle">
                            <IoTriangle />
                        </ToggleButton>
                        <ToggleButton value="ellipse">
                            <FaCircle />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid item>
                    <Paper>
                        <div onClick={currentTool !== "paint" && currentTool !== "move" && currentTool ? addObject : () => { }} >
                            <canvas id="canvas" />
                        </div>
                    </Paper>
                </Grid>
                <Grid item className="chatContainer">
                    <ChatBox messageList={messageList} postMessage={(value: string) => postMessage(value)} user={User} />
                    <Button variant='outlined' className="submitButton" onClick={() => setOpen(true)}>Submit Post</Button>
                    {canvas && (
                        <Modal open={open} onClose={() => setOpen(false)}>
                            <PostSubmission image={canvas.toSVG().toString()} />
                        </Modal>
                    )}
                </Grid>
            </Grid>
        </>
    )
}


export default Canvas;