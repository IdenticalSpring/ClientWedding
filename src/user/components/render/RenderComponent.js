// src/components/RenderComponent.js
import React from "react";
import { Box, Typography } from "@mui/material";

const RenderComponent = ({ component }) => {
  switch (component.type) {
    case "text":
      return (
        <Box
          key={component.id}
          sx={{
            position: "absolute",
            left: component.style.left,
            top: component.style.top,
            width: component.style.width,
            height: component.style.height,
            fontSize: component.style.fontSize,
            color: component.style.color,
            fontFamily: component.style.fontFamily,
          }}
        >
          <Typography variant={component.style.fontSize}>
            {component.text || "No text provided"}
          </Typography>
        </Box>
      );
    case "circle":
      return (
        <Box
          key={component.id}
          sx={{
            position: "absolute",
            left: component.style.left,
            top: component.style.top,
            width: component.style.width,
            height: component.style.height,
            borderRadius: "50%",
            backgroundColor: component.style.fillColor,
            borderColor: component.style.borderColor || "",
            borderWidth: component.style.borderWidth || "0px",
            borderStyle: component.style.borderStyle || "none",
            opacity: component.style.opacity / 100 || "1",
          }}
        />
      );
    case "rect":
      return (
        <Box
          key={component.id}
          sx={{
            position: "absolute",
            left: component.style.left,
            top: component.style.top,
            width: component.style.width,
            height: component.style.height,
            backgroundColor: component.style.fillColor || "#ccc",
            borderRadius: component.style.borderRadius || "0%",
            borderColor: component.style.borderColor || "",
            borderWidth: component.style.borderWidth || "0px",
            borderStyle: component.style.borderStyle || "none",
            opacity: component.style.opacity / 100 || "1",
          }}
        />
      );
    case "image":
      return (
        <Box
          key={component.id}
          sx={{
            position: "absolute",
            left: component.style.left,
            top: component.style.top,
            width: component.style.width,
            height: component.style.height,
            overflow: "hidden",
            borderRadius: component.style.borderRadius || "0%",
            borderColor: component.style.borderColor || "",
            borderWidth: component.style.borderWidth || "0px",
            borderStyle: component.style.borderStyle || "none",
            opacity: component.style.opacity / 100 || "1",
          }}
        >
          <img
            src={component.src ? component.src : ""}
            alt="image component"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>
      );
    case "line":
      return (
        <Box
          key={component.id}
          sx={{
            position: "absolute",
            left: component.style.left,
            top: component.style.top,
            width: component.style.width,
            height: component.style.height || 5,
            backgroundColor: component.style.lineColor,
            opacity: component.style.opacity / 100 || 1,
          }}
        />
      );
    default:
      return null;
  }
};

export default RenderComponent;
