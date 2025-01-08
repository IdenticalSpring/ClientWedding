import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import Canvas from "../../template/template-component/Canvas";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const SidebarContent = ({
  template,
  onSectionClick,
  setSections,
  sections,
}) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Box>
        <Grid>
          <Grid>
            <Typography
              sx={{
                textAlign: "center",
                color: "red",
                fontWeight: "bold",
                fontStyle: "italic",
              }}
              variant="h6"
            >
              Template
            </Typography>
            {template.sections && template.sections.length > 0 ? (
              [...template.sections]
                .sort((a, b) => parseInt(a.position) - parseInt(b.position))
                .map((section, index) => (
                  <Box
                    key={section.id}
                    sx={{
                      position: "relative",
                      border: "1px dashed #ccc",
                      height: "800px",
                      width: "500px",
                      backgroundColor: "#f9f9f9",
                      transform: "scale(0.3)",
                      transformOrigin: "top left",
                      cursor: "pointer",
                      // marginBottom: "-120px",
                    }}
                    onClick={() => onSectionClick(section)}
                  >
                    {/* Render Canvas for each section */}
                    <Canvas sections={[section]} isViewMode={true} />
                  </Box>
                ))
            ) : (
              <Typography>No sections available.</Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </DndProvider>
  );
};

export default SidebarContent;
