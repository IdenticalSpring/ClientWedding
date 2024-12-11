import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import RenderComponent from "../render/RenderComponent";
const SidebarContent = ({ template, onSectionClick }) => {
  return (
    <div style={{ marginTop: "50px" }}>
      <Box>
        <Grid>
          <Grid>
            <Typography variant="h6">Sections</Typography>
            {template.sections && template.sections.length > 0 ? (
              template.sections.map((section) => (
                <Box
                  key={section.id}
                  sx={{
                    position: "relative",
                    border: "1px dashed #ccc",
                    minHeight: "200px",
                    width: "766px",
                    backgroundColor: "#f9f9f9",
                    transform: "scale(0.3)",
                    transformOrigin: "top left",
                    cursor: "pointer",
                    marginBottom: "-120px",
                  }}
                  onClick={() => onSectionClick(section)}
                >
                  {section.metadata?.components?.map((component) => (
                    <RenderComponent key={component.id} component={component} />
                  ))}
                </Box>
              ))
            ) : (
              <Typography>No sections available.</Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default SidebarContent;
