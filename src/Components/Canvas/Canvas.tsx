import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import "./Canvas.scss";
import { Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { ToolBarItem } from '../../Types/ToolbarItems';
import MouseIcon from '@mui/icons-material/Mouse';
import BrushIcon from '@mui/icons-material/Brush';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import CircleIcon from '@mui/icons-material/Circle';

function Canvas() {
    const [canvas, setCanvas] = useState<fabric.Canvas | undefined>(undefined);
    const [colour, setColour] = useState("#000000");
    const [currentTool, setCurrentTool] = useState<ToolBarItem>("move");
    const ToggleTool = (e: React.MouseEvent<HTMLElement>, newTool: string) => {
        setCurrentTool(newTool as ToolBarItem);
    }

    function initCanvas(): fabric.Canvas {
        return (
            new fabric.Canvas('canv', {
                height: 700,
                width: 700,
                backgroundColor: 'white',
            })
        );
    }

    useEffect(() => {
        setCanvas(initCanvas());
    }, []);

    const addObject = (e: any) => {
        let object: fabric.Object;
        let pointer = canvas?.getPointer(e);
        let mouseX = pointer!.x;
        let mouseY = pointer!.y;

        let defaultSize = 100;
        let defaultRadius = 50

        if (currentTool === "square") {
            object = new fabric.Rect({
                height: defaultSize,
                width: defaultSize,
                fill: colour,
                left: mouseX - (defaultSize/2),
                top: mouseY - (defaultSize/2)
            });
        }

        else if (currentTool === "triangle") {
            object = new fabric.Triangle({
                width: defaultSize,
                height: defaultSize,
                fill: colour,
                left: mouseX - (defaultSize/2),
                top: mouseY - (defaultSize/2)
            })
        }
        else if (currentTool === "ellipse") {
            object = new fabric.Circle({
                radius: defaultRadius,
                fill: colour,
                left: mouseX - (defaultSize/2),
                top: mouseY - (defaultSize/2)
            })
        }

        if (currentTool != "move") {
            canvas!.add(object!)
            canvas!.renderAll()
        }

        setCurrentTool("move");
    };

    return (
        <Paper className='squareContainer'>
            <div>
                <div>
                    <input type="color" value={colour} onChange={(e) => setColour(e.target.value)} />
                    <button type='button' name='clear' onClick={() => canvas?.clear()}>
                        Clear
                    </button>
                    <ToggleButtonGroup
                        exclusive
                        value={currentTool}
                        onChange={ToggleTool}
                    >
                        <ToggleButton value="move"><MouseIcon /></ToggleButton>
                        <ToggleButton value="paint"><BrushIcon /></ToggleButton>
                        <ToggleButton value="square"><CropSquareIcon /></ToggleButton>
                        <ToggleButton value="triangle"><ChangeHistoryIcon /></ToggleButton>
                        <ToggleButton value="ellipse"><CircleIcon /></ToggleButton>
                    </ToggleButtonGroup>
                </div>

                <div onClick={addObject} >
                    <canvas id='canv'/>
                </div>

            </div>
        </Paper>
    )
}


export default Canvas;