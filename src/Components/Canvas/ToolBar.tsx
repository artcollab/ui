import React, { useState } from "react";

enum tool {
    Paint,
    Fill,
    Erase
}

const [currentTool, setCurrentTool] = useState<tool>(tool.Paint);

function ToolBar() {
    return (
        <></>
    )
}

export default ToolBar;