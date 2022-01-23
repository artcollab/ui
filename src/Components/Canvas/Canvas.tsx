import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import "./Canvas.scss";
import { Button, ButtonGroup, Divider, Input, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { ToolBarItem } from '../../Types/ToolbarItems';
import MouseIcon from '@mui/icons-material/Mouse';
import BrushIcon from '@mui/icons-material/Brush';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import CircleIcon from '@mui/icons-material/Circle';
import { hexToRgb } from '../../Util/HexToRGB';
import { io } from 'socket.io-client';
import { v1 } from 'uuid';

let objects: Array<{ id: string, obj: fabric.Object }> = [];
const socket = io('http://localhost:8080');     // connect to socket io server

function Canvas() {
    const [canvas, setCanvas] = useState<fabric.Canvas | undefined>(undefined);

    // Brush attributes, colour, size and opacity
    const [colour, setColour] = useState("#000000");
    const [brushSize, setBrushSize] = useState(1);
    const [opacity, setOpacity] = useState(100);

    // Currently equipped drawing tool, types can be found in types/ToolBarItems.ts
    const [currentTool, setCurrentTool] = useState<ToolBarItem>("move");

    // To help prevent feedback loops, we store the last received object received through socket io
    let receivedObj: fabric.Object;

    // Event function to switch between toolbar items, paint tool functionality must be declared seperately using canvas.isDrawingMode
    const ToggleTool = (e: React.MouseEvent<HTMLElement>, newTool: string) => {
        if (canvas) {
            if (currentTool === "paint") canvas.isDrawingMode = false;
            if (newTool === "paint" && !canvas.isDrawingMode) canvas.isDrawingMode = true;
            setCurrentTool(newTool as ToolBarItem);
        }
    }

    // canvas initial state
    function initCanvas(): fabric.Canvas {
        return (
            new fabric.Canvas("canvas", {
                height: 400,
                width: 700,
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

    }, [colour, brushSize, opacity]);

    // Using an empty dependency list, this block only runs on page load. Therefore this is quite useful for initializing the canvas
    useEffect(() => {
        if (!canvas) {
            setCanvas(initCanvas());
        }
    }, []);

    // For each change in the canvas, new changes are emitted to the socket server
    useEffect(() => {

        // Canvas event listener detects whenever an object is added to the page, if the object isn't a duplicate, we emit it.
        canvas?.on("object:added", (object) => {
            // This comparison allows us to know whether or not this object was created by this client or received by socket io
            let dupe = object.target == receivedObj;

            if (socket && !dupe && object.target) {
                let newObj = { id: v1(), obj: object.target };
                objects.push(newObj);
                socket.emit('newObject', newObj);
            }
        })

        canvas?.on("object:modified", (object) => {
            // finding the same object in the object list in order to preserve the ID
            let newObject = objects.find((e) => e.obj === object.target);
            let index = objects.indexOf(newObject!);
            if (newObject) socket.emit('newModification', newObject);
            objects.splice(index, 1, {id:newObject!.id, obj: object.target!})
        })

        // Restarting this listener helps prevent duplicate events being fired
        socket.off('addObject');
        socket.on('addObject', (obj) => {
            let newObj: any;
            objects.push(obj);

            // When adding the object raw, the browser exhibits strange breaking behaviour, instead we add the data to a new object using the spread operator
            if (obj.obj.type === "rect") {
                newObj = new fabric.Rect({
                    ...obj.obj
                });
            }

            if (obj.obj.type === "circle") {
                newObj = new fabric.Circle({
                    ...obj.obj
                });
            }

            if (obj.obj.type === "triangle") {
                newObj = new fabric.Triangle({
                    ...obj.obj
                });
            }

            if (obj.obj.type === "path") {
                newObj = new fabric.Path((obj.obj as fabric.Path).path, { ...obj.obj });
            }

            receivedObj = newObj!;
            // Adding new object to canvas and rendering
            canvas?.add(newObj!);
            canvas?.renderAll();
        });

        socket.on('modifyObject', (object) => {
            // finding the object on the next client using ID
            let storedObj = objects.find((e) => e.id === object.id);
            let index = objects.indexOf(storedObj!);

            canvas?.getObjects().forEach((element) => {
                // due to some differences in objects stored in an array and objects present on the canvas, this dirty solution to matching objects is used instead
                if ((storedObj?.obj.top == element.top) && (storedObj?.obj.left == element.left)) {
                    element.set({ ...object.obj })
                    element.setCoords();
                    canvas?.renderAll();
                    // updating the array of objects
                    objects.splice(index, 1, {id:storedObj!.id, obj: object.obj})
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
            <Paper className="toolBarContainer">
                <ToggleButtonGroup exclusive value={currentTool} onChange={ToggleTool}>
                    <ToggleButton value="move"><MouseIcon /></ToggleButton>
                    <ToggleButton value="paint"><BrushIcon /></ToggleButton>
                    <ToggleButton value="square"><CropSquareIcon /></ToggleButton>
                    <ToggleButton value="triangle"><ChangeHistoryIcon /></ToggleButton>
                    <ToggleButton value="ellipse"><CircleIcon /></ToggleButton>
                </ToggleButtonGroup>
                <Divider flexItem orientation="vertical" />
                <ButtonGroup>
                    <Button type='button' name='clear' onClick={() => canvas?.clear()}>Clear</Button>
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
            </Paper>
            <Paper className='squareContainer'>
                <div onClick={currentTool !== "paint" && currentTool !== "move" && currentTool ? addObject : () => { }} >
                    <canvas id="canvas" />
                </div>
            </Paper>
        </>
    )
}


export default Canvas;