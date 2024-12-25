import React from "react";
import { Box, TextField, Slider, Select, MenuItem } from "@mui/material";
import ButtonUpload from "../upload/ButtonUpload";
const SidebarRight = ({
  selectedComponent,
  handleTextChange,
  handleStyleChange,
  handleFileUpload,
}) => {
  if (!selectedComponent) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "300px",
        height: "450px",
        background: "#fff",
        padding: " 65px 12px 12px 12px",
        border: "1px solid #ccc",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h3>Edit Component</h3>

      {/* Text Component Settings */}
      {selectedComponent?.type === "text" && (
        <>
          <TextField
            label="Text"
            value={selectedComponent.text || ""}
            onChange={(e) => {
              handleTextChange(e.target.value);
            }}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            type="color"
            label="Font Color"
            value={selectedComponent.style?.color || "#000000"}
            onChange={(e) => handleStyleChange("color", e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Slider
            value={selectedComponent.style?.fontSize || 16}
            onChange={(e, value) => {
              handleStyleChange("fontSize", value);
            }}
            min={10}
            max={72}
            step={1}
            sx={{ mb: 2 }}
          />
          <Select
            value={selectedComponent.style?.fontFamily || "Arial"}
            onChange={(e) => handleStyleChange("fontFamily", e.target.value)}
            fullWidth
            sx={{
              mb: 2,
              disableScrollLock: true,
            }}
          >
            <MenuItem value="Arial">Arial</MenuItem>
            <MenuItem value="Courier New">Courier New</MenuItem>
            <MenuItem value="Georgia">Georgia</MenuItem>
            <MenuItem value="Times New Roman">Times New Roman</MenuItem>
            <MenuItem value="Verdana">Verdana</MenuItem>
          </Select>
        </>
      )}

      {/* Image Component Settings */}
      {selectedComponent.type === "image" && (
        <ButtonUpload handleFileUpload={handleFileUpload} />
      )}
    </Box>
  );
};

export default SidebarRight;
