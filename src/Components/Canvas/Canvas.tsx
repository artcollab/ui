import React, { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import "./Canvas.scss";
import { Button, ButtonGroup, Grid, Input, Modal, Paper, ToggleButton, ToggleButtonGroup, IconButton, Zoom } from '@mui/material';
import { ToolBarItem } from '../../Types/ToolbarItems';
import { hexToRgb } from '../../Util/HexToRGB';
import { io } from 'socket.io-client';
import { v1 } from 'uuid';
import { chatBoxComment } from '../../Types/Comment';
import { user } from '../../Types/User';
import ChatBox from './ChatBox';
import PostSubmission from './PostSubmission';
import { FaMousePointer, FaSquareFull, FaCircle } from "react-icons/fa";
import { IoTriangle } from "react-icons/io5";
import { BsBrushFill } from "react-icons/bs";
import { getAccessToken, getUserAsObject } from '../../Util/handleResponse';
import { useLocation, useNavigate } from 'react-router-dom';
import { sizeMap } from '../../Util/canvasResolutions';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import Tooltip from '@mui/material/Tooltip';

const fetchedData = getUserAsObject();
const User: user = fetchedData;
const at = getAccessToken();

const socket = io('https://api.operce.net', {
    transportOptions: {
        polling: {
            extraHeaders: {
                'Authorization': `Bearer ${JSON.parse(at)}`,
            },
        },
    },
});

function Canvas() {
    const navigate = useNavigate();

    const [canvas, setCanvas] = useState<fabric.Canvas | undefined>(undefined);
    const { state } = useLocation();
    let { room, size, image } = state as unknown as { room: string, size: string, image: string } ?? "";
    const [admin, setAdmin] = useState(false);

    useEffect(() => {
        if(!state){
            navigate("/error");
        }
    }, [navigate, state])

    // Brush attributes, colour, size and opacity
    const [colour, setColour] = useState("#000000");
    const [brushSize, setBrushSize] = useState(1);
    const [opacity, setOpacity] = useState(100);

    // Currently equipped drawing tool, types can be found in types/ToolBarItems.ts
    const [currentTool, setCurrentTool] = useState<ToolBarItem>("move");

    // Chat box elements to display
    const [messageList, setMessageList] = useState<Array<chatBoxComment | string>>([]);

    // Modal settings
    const [open, setOpen] = useState(false);

    /* recommendation/tip system status */
    const [tips, setTips] = useState(false);

    /* recommendation/tip button style */
    const [tipStyle, setTipStyle] = useState("noTip");

    /* handles the Reccomendation/Tip system */
    function toggleTips() {

        /* sets the tip status to whatever the opposite of tips currently is */
        setTips(!tips)

        /* sets the tip button's style depending on its current status */
        setTipStyle(tipStyle === "tip" ? "noTip" : "tip")
    }

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
        let newMessage: chatBoxComment = {
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
                height: sizeMap.get(size)?.y,
                width: sizeMap.get(size)?.x,
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
        if (image) {
            fabric.loadSVGFromString(image, function (objects, options) {
                var obj = fabric.util.groupSVGElements(objects, options);
                canvas!.add(obj).centerObject(obj).renderAll();
                obj.setCoords();
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canvas, room, image]);

    // listens for new messages being sent, adds them to the message list and re-renders the page
    socket.on("addMessage", (message: chatBoxComment) => {
        setMessageList([...messageList, message]);
    });

    // listens for new status messages, also added to the message list and page is re-rendered
    socket.on("addStatus", (message: string) => {
        setMessageList([...messageList, message]);
    });

    // the listener below has a tendency to submit dupe requests which causes lag therefore each request is checked against the last before executing its block
    let lastInstance = '';
    // when the server requests the canvas from this user, the canvas is sent to the server
    socket.on('requestCanvas', ({ id, instance }) => {
        if (lastInstance !== instance) {
            const data = canvas?.toJSON();
            socket.emit('sendCanvas', ({ data, id }));
            socket.off('requestCanvas');
        }
        lastInstance = instance;
    });

    // after requesting the canvas of another user, it is loaded into the canvas
    socket.on('fillCanvas', (data) => {
        if (data && canvas?.getObjects().length === 0) {
            canvas?.loadFromJSON(JSON.stringify(data), () => canvas.renderAll());
            socket.off('fillCanvas');
        }
    });

    // For each change in the canvas, new changes are emitted to the socket server
    useEffect(() => {

        // Canvas event listener detects whenever an object is added to the page, if the object isn't a duplicate, we emit it.
        canvas?.on("object:added", (object: any) => {
            // This comparison allows us to know whether or not this object was created by this client or received by socket io
            let dupe = object.target === receivedObject.current;
            let id = v1();

            if (socket && !dupe && object.target) {
                let newObj = { id: id, obj: object.target };
                newObj.obj.set({ name: id });
                socket.emit('newObject', newObj);
            }
        })

        canvas?.on("object:modified", (object: any) => {
            // finding the same object in the object list in order to preserve the ID
            let newObject = canvas.getObjects().find((e) => e.name === object.target!.name);
            newObject?.set({ name: object.target!.name });
            if (newObject) socket.emit('newModification', { id: object.target!.name, obj: newObject });
        });

        canvas?.on("object:moving", (object: any) => {
            // finding the same object in the object list in order to preserve the ID
            let newObject = canvas.getObjects().find((e: any) => e.name === object.target!.name);
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
        socket.on('modifyObject', (object: any) => {
            canvas?.getObjects().forEach((element: any) => {
                if (object.id === element.name) {
                    element.set({ ...object.obj })
                    element.setCoords();
                    canvas?.renderAll();
                    element.set({ name: object.id });
                }
            })

        });

        socket.on('adminCheck', (admin: boolean) => { setAdmin(admin) });

    }, [canvas]);

    const addObject = (e: any) => {
        let object: fabric.Object;

        // Extracting mouse location to allow us to choose the position of the object
        let pointer = canvas?.getPointer(e);
        let mouseX = pointer ? pointer.x : 0;
        let mouseY = pointer ? pointer.y : 0;

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

                        <Tooltip followCursor disableHoverListener={!tips} TransitionComponent={Zoom} title="Get some space with the Clear Button!">
                            <Button type='button' name='clear' onClick={() => { socket.emit('requestCanvasClear') }}>Clear</Button>
                        </Tooltip>

                        <Tooltip followCursor disableHoverListener={!tips} TransitionComponent={Zoom} title="Taste the rainbow with the Color Selector!">
                            <Button><Input type="color" className="colorInput" value={colour} onChange={(e) => { setColour(e.target.value) }} disableUnderline />Colour</Button>
                        </Tooltip>

                        <Tooltip followCursor disableHoverListener={!tips} TransitionComponent={Zoom} title="Make your drawing larger than life with the Brush Size Editor!">
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
                        </Tooltip>

                        <Tooltip followCursor disableHoverListener={!tips} TransitionComponent={Zoom} title="Lighten up with the Opacity Editor!">
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
                        </Tooltip>
                    </ButtonGroup>
                </Grid>
            </Grid>
            <Grid container spacing={2} className="gridContainer">
                <Grid item>

                    <ToggleButtonGroup exclusive value={currentTool} onChange={ToggleTool} orientation='vertical'>
                        <Tooltip followCursor disableHoverListener={!tips} TransitionComponent={Zoom} title="Move & manipulate your drawings with the Cursor Tool!">
                            <ToggleButton value="move">
                                <FaMousePointer />
                            </ToggleButton>
                        </Tooltip>

                        <Tooltip followCursor disableHoverListener={!tips} TransitionComponent={Zoom} title="Draw to your heart's content with the Brush Tool!">
                            <ToggleButton value="paint">
                                <BsBrushFill />
                            </ToggleButton>
                        </Tooltip>

                        <Tooltip followCursor disableHoverListener={!tips} TransitionComponent={Zoom} title="Take square when creating shapes with the Square tool!">
                            <ToggleButton value="square">
                                <FaSquareFull />
                            </ToggleButton>
                        </Tooltip>

                        <Tooltip followCursor disableHoverListener={!tips} TransitionComponent={Zoom} title="Get straight to the point with the Triangle tool!">
                            <ToggleButton value="triangle">
                                <IoTriangle />
                            </ToggleButton>
                        </Tooltip>


                        <Tooltip followCursor disableHoverListener={!tips} TransitionComponent={Zoom} title="There's nothing pointless about the Circle Tool!">
                            <ToggleButton value="ellipse">
                                <FaCircle />
                            </ToggleButton>
                        </Tooltip>

                        {/* Outside of the normal button group although needed to be below it for neatness */}
                        <span style={{marginTop: 10 }}>
                            <Tooltip followCursor TransitionComponent={Zoom} title="Tip activation">
                                <IconButton className={tipStyle} onClick={() => {toggleTips()}}>
                                    <TipsAndUpdatesIcon />
                                </IconButton>
                            </Tooltip>
                        </span>

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
                    <ChatBox messageList={messageList} postMessage={(value: string) => { postMessage(value) }} user={User} />

                    {admin && <Button variant='outlined' className="submitButton" onClick={() => { setOpen(true) }}>Submit Post</Button>}

                    {canvas && (
                        <Modal open={open} onClose={() => { setOpen(false) }}>
                            <PostSubmission image={canvas.toSVG().toString()} canvasSize={size} />

                        </Modal>
                    )}
                </Grid>
            </Grid>
        </>
    )
}


export default Canvas;
