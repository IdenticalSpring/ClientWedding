import React from "react";
import { Box } from "@mui/material";
import ComponentItem from "./ComponentItem";

const Section = ({ section, isViewMode, setActiveComponent }) => {
  return (
    <Box
      sx={{
        position: section.metadata.style.position,
        padding: section.metadata.style.padding,
        marginBottom: section.metadata.style.marginBottom,
        minWidth: section.metadata.style.minWidth,
        minHeight: section.metadata.style.minHeight,
        backgroundColor: section.metadata.style.backgroundColor,
        transition: section.metadata.style.transition,
      }}
    >
      {(section.metadata?.components || []).map((component) => (
        <ComponentItem
          key={component.id}
          component={component}
          isViewMode={isViewMode}
          setActiveComponent={setActiveComponent} // Truyền hàm xuống ComponentItem
        />
      ))}
    </Box>
  );
};

export default Section;
