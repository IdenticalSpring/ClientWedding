import React, { useState } from "react";
import { Box, Typography } from "@mui/material";

const RenderComponent = ({ component, sectionRef }) => {
  const [dimensions, setDimensions] = useState({
    width: component.style.width,
    height: component.style.height,
  });

  const [position, setPosition] = useState({
    left: component.style.left,
    top: component.style.top,
  });

  const handleMouseDownResize = (e) => {
    e.preventDefault();
    const initialWidth = dimensions.width;
    const initialHeight = dimensions.height;
    const initialX = e.clientX;
    const initialY = e.clientY;

    
    const handleMouseMove = (moveEvent) => {
      const newWidth = initialWidth + (moveEvent.clientX - initialX);
      const newHeight = initialHeight + (moveEvent.clientY - initialY);
      setDimensions({
        width: newWidth,
        height: newHeight,
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };


  const handleMouseDownMove = (e) => {
    // Kiểm tra xem chuột có nằm trong khu vực resize không
    const resizeElement = e.target.closest('div[style*="se-resize"]');
    if (resizeElement) return; // Nếu chuột nằm trong khu vực resize, không xử lý di chuyển
  
    e.preventDefault();
    
    const initialX = e.clientX;
    const initialY = e.clientY;
    const initialLeft = position.left;
    const initialTop = position.top;
  
    // Lấy thông tin về container (section hoặc box) bao quanh phần tử di chuyển
    const container = sectionRef.current; // Nếu bạn dùng `sectionRef` cho container
    if (!container) return;
  
    const containerRect = container.getBoundingClientRect();
  
    const handleMouseMove = (moveEvent) => {
      let newLeft = initialLeft + (moveEvent.clientX - initialX);
      let newTop = initialTop + (moveEvent.clientY - initialY);
  
      // Giới hạn vị trí bên trái (left), không cho vượt ra ngoài bên trái
      if (newLeft < 0) {
        newLeft = 0;
      }
  
      // Giới hạn vị trí bên phải (right), không cho vượt ra ngoài bên phải
      if (newLeft + dimensions.width > containerRect.width) {
        newLeft = containerRect.width - dimensions.width;
      }
  
      // Giới hạn vị trí trên (top), không cho vượt ra ngoài phía trên
      if (newTop < 0) {
        newTop = 0;
      }
  
      // Giới hạn vị trí dưới (bottom), không cho vượt ra ngoài phía dưới
      if (newTop + dimensions.height > containerRect.height) {
        newTop = containerRect.height - dimensions.height;
      }
  
      setPosition({
        left: newLeft,
        top: newTop,
      });
    };
  
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  

  switch (component.type) {
    case "text":
      return (
        <Box
          key={component.id}
          sx={{
            position: "absolute",
            left: position.left,
            top: position.top,
            width: dimensions.width,
            height: dimensions.height,
            fontSize: component.style.fontSize,
            color: component.style.color,
            fontFamily: component.style.fontFamily,
            cursor: "move",
          }}
          onMouseDown={handleMouseDownMove}
        >
          <Typography variant={component.style.fontSize}>
            {component.text || "No text provided"}
          </Typography>
          <div
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              width: "10px",
              height: "10px",
              backgroundColor: "blue",
              cursor: "se-resize",
            }}
            onMouseDown={handleMouseDownResize}
          />
        </Box>
      );
    case "circle":
      return (
        <Box
          key={component.id}
          sx={{
            position: "absolute",
            left: position.left,
            top: position.top,
            width: dimensions.width,
            height: dimensions.height,
            borderRadius: "50%",
            backgroundColor: component.style.fillColor,
            borderColor: component.style.borderColor || "",
            borderWidth: component.style.borderWidth || "0px",
            borderStyle: component.style.borderStyle || "none",
            opacity: component.style.opacity / 100 || "1",
            cursor: "move", // Thêm con trỏ di chuyển
          }}
          onMouseDown={handleMouseDownMove}
        >
          <div
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              width: "10px",
              height: "10px",
              backgroundColor: "blue",
              cursor: "se-resize",
            }}
            onMouseDown={handleMouseDownResize}
          />
        </Box>
      );
    case "rect":
      return (
        <Box
          key={component.id}
          sx={{
            position: "absolute",
            left: position.left,
            top: position.top,
            width: dimensions.width,
            height: dimensions.height,
            backgroundColor: component.style.fillColor || "#ccc",
            borderRadius: component.style.borderRadius || "0%",
            borderColor: component.style.borderColor || "",
            borderWidth: component.style.borderWidth || "0px",
            borderStyle: component.style.borderStyle || "none",
            opacity: component.style.opacity / 100 || "1",
            cursor: "move", // Thêm con trỏ di chuyển
          }}
          onMouseDown={handleMouseDownMove}
        >
          <div
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              width: "10px",
              height: "10px",
              backgroundColor: "blue",
              cursor: "se-resize",
            }}
            onMouseDown={handleMouseDownResize}
          />
        </Box>
      );
    case "image":
      return (
        <Box
          key={component.id}
          sx={{
            position: "absolute",
            left: position.left,
            top: position.top,
            width: dimensions.width,
            height: dimensions.height,
            overflow: "hidden",
            borderRadius: component.style.borderRadius || "0%",
            borderColor: component.style.borderColor || "",
            borderWidth: component.style.borderWidth || "0px",
            borderStyle: component.style.borderStyle || "none",
            opacity: component.style.opacity / 100 || "1",
            cursor: "move", // Thêm con trỏ di chuyển
          }}
          onMouseDown={handleMouseDownMove}
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
          <div
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              width: "10px",
              height: "10px",
              backgroundColor: "blue",
              cursor: "se-resize",
            }}
            onMouseDown={handleMouseDownResize}
          />
        </Box>
      );
    case "line":
      return (
        <Box
          key={component.id}
          sx={{
            position: "absolute",
            left: position.left,
            top: position.top,
            width: dimensions.width,
            height: component.style.height || 5,
            backgroundColor: component.style.lineColor,
            opacity: component.style.opacity / 100 || 1,
            cursor: "move", // Thêm con trỏ di chuyển
          }}
          onMouseDown={handleMouseDownMove}
        >
          <div
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              width: "10px",
              height: "10px",
              backgroundColor: "blue",
              cursor: "se-resize",
            }}
            onMouseDown={handleMouseDownResize}
          />
        </Box>
      );
    default:
      return null;
  }
};

export default RenderComponent;
