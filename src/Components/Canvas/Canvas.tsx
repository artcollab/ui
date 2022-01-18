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

function Canvas() {
    const [canvas, setCanvas] = useState<fabric.Canvas | undefined>(undefined);
    const [colour, setColour] = useState("#000000");
    const [brushSize, setBrushSize] = useState(1);
    const [currentTool, setCurrentTool] = useState<ToolBarItem>("move");
    const ToggleTool = (e: React.MouseEvent<HTMLElement>, newTool: string) => {
        if (canvas) {
            if (currentTool === "paint") canvas.isDrawingMode = false;
            if (newTool === "paint" && !canvas.isDrawingMode) canvas.isDrawingMode = true;
            setCurrentTool(newTool as ToolBarItem);
        }
    }

    function initCanvas(): fabric.Canvas {
        return (
            new fabric.Canvas("canvas", {
                height: 400,
                width: 700,
                backgroundColor: 'white',
            })
        );
    }

    useEffect(() => {
        if (canvas) {
            canvas.freeDrawingBrush.color = colour;
            canvas.freeDrawingBrush.width = brushSize;
        }

    }, [colour, brushSize]);

    useEffect(() => {
        setCanvas(initCanvas());
    }, []);

    const addObject = (e: any) => {
        let object: fabric.Object;
        let pointer = canvas?.getPointer(e);
        let mouseX = pointer!.x;
        let mouseY = pointer!.y;

        let defaultSize = 100;

        if (currentTool === "square") {
            object = new fabric.Rect({
                height: defaultSize,
                width: defaultSize,
                fill: colour,
                left: mouseX - (defaultSize / 2),
                top: mouseY - (defaultSize / 2)
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

        if (currentTool !== "move") {
            canvas?.add(object!)
            canvas?.renderAll()
        }

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
                                onChange={(e: any) => { setBrushSize(e.target.value) }}
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
                    </ButtonGroup>
            </Paper>
            <Paper className='squareContainer'>
                <div>
                    <div onClick={currentTool !== "paint" ? addObject : () => { }} >
                        <canvas id="canvas" />
                    </div>

                </div>
            </Paper>
        </>
    )
}


export default Canvas;