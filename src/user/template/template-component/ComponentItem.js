import React from "react";
import Draggable from "react-draggable";
import { Box } from "@mui/material";

const ComponentItem = ({ component, isViewMode, setActiveComponent }) => {
  return (
    <Draggable
      bounds="parent"
      defaultPosition={{
        x: component.style.left,
        y: component.style.top,
        width: component.style.width,
        height: component.style.height,
      }}
      disabled={isViewMode}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: component.style.width,
          height: component.type === "line" ? "3px" : component.style.height,
          fontSize: component.style.fontSize,
          fontFamily: component.style.fontFamily,
          color: component.style.color,
          backgroundColor:
            component.type === "line"
              ? component.style.fillColor
              : component.style.fillColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: isViewMode ? "default" : "move",
          padding: 1,
          borderRadius:
            component.type === "circle" ? "50%" : component.style.borderRadius,
          borderWidth: component.style.borderWidth,
          borderColor: component.style.borderColor,
          borderStyle: component.style.borderStyle,
          transform:
            component.type === "diamond"
              ? "rotate(45deg)"
              : component.style.transform,
          opacity: component.style.opacity / 100,
        }}
        onClick={() => setActiveComponent && setActiveComponent(component)} // Gọi hàm nếu có
      >
        {component.type === "text" && <span>{component.text || "Text"}</span>}

        {(component.type === "image" || component.type === "circle") && (
          <img
            src={component.src || ""}
            style={{
              width: component.style.width,
              height: component.style.height,
              objectFit: "cover",
              borderRadius:
                component.type === "circle"
                  ? "50%"
                  : component.style.borderRadius,
            }}
          />
        )}
      </Box>
    </Draggable>
  );
};

export default ComponentItem;
