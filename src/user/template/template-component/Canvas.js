import React from "react";
import { Box } from "@mui/material";
import Section from "./Section";

const Canvas = ({ sections, isViewMode, setActiveComponent }) => {
  return (
    <Box
      sx={{
        minHeight: "80vh",
        backgroundColor: "#fff",
      }}
    >
      {sections.map((section) => (
        <Section
          key={section.id}
          section={section}
          isViewMode={isViewMode}
          setActiveComponent={setActiveComponent} // Truyền hàm xuống Section
        />
      ))}
    </Box>
  );
};

export default Canvas;
