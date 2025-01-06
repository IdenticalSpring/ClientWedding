import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { userAPI } from "../../service/user";
import {
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Canvas from "../template/template-component/Canvas";
import "../../css/font.css";

const TemplateDetail = (props) => {
  const { id } = useParams();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const startPoint = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await userAPI.getTemplateById(id);
        const sortedSections = response.data.sections.sort((a, b) => {
          return a.position - b.position;
        });
        setTemplate({ ...response.data, sections: sortedSections });
      } catch (error) {
        console.error("Error fetching template:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id]);

  const handleWheel = (event) => {
    event.preventDefault();
    setScale((prevScale) => {
      const delta = event.deltaY > 0 ? -0.1 : 0.1;
      return Math.min(Math.max(prevScale + delta, 0.5), 3);
    });
  };

  const handleMouseDown = (event) => {
    if (!event.shiftKey) return;
    isPanning.current = true;
    startPoint.current = { x: event.clientX, y: event.clientY };
  };

  const handleMouseMove = (event) => {
    if (!isPanning.current) return;
    const dx = event.clientX - startPoint.current.x;
    const dy = event.clientY - startPoint.current.y;
    setTranslate((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    startPoint.current = { x: event.clientX, y: event.clientY };
  };

  const handleMouseUp = () => {
    isPanning.current = false;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!template) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6">Template not found.</Typography>
      </Box>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          backgroundColor: "#FCFCFC",
          "@media (max-width: 700px)": {
            marginTop: "60px",
            height: "auto",
            flexDirection: "column",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            height: "100%",
            overflow: "hidden",
            flexDirection: "row",
            "@media (max-width: 700px)": {
              flexDirection: "column",
              overflow: "auto",
            },
          }}
        >
          <Box
            id="canvas"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            sx={{
              flex: 1,
              position: "relative",
              cursor: isPanning.current ? "grabbing" : "grab",
              backgroundColor: "#FCFCFC",
              "@media (max-width: 700px)": {
                overflow: "auto",
              },
            }}
          >
            <Box
              sx={{
                transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                transformOrigin: "center",
                transition: isPanning.current
                  ? "none"
                  : "transform 0.2s ease-out",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  width: "var(--canvas-width, 800px)",
                  height: "600px",
                  position: "relative",
                  "@media (max-width: 700px)": {
                    width: "100%",
                    height: "auto",
                  },
                }}
              >
                <Canvas sections={template.sections} isViewMode={true} />
              </Box>
            </Box>
          </Box>
        </Box>
        <Snackbar open={false} autoHideDuration={3000} onClose={() => {}}>
          <Alert severity="error">Error loading template!</Alert>
        </Snackbar>
      </Box>
    </DndProvider>
  );
};

export default TemplateDetail;
