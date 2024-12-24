import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Button, Snackbar, Alert } from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Canvas from "../../components/invitation/Canvas";
import Toolbar from "../../components/invitation/ToolBar";
import Headerv2 from "../../components/invitation/Headerv2";
import { useParams } from "react-router-dom";
import { userAPI } from "../../../service/user";
import LayerList from "../../components/invitation/LayerList";

const CreateInvitation = () => {
    const { id } = useParams(); // Get template_userId from URL
    const [sections, setSections] = useState([]);
    const [activeItem, setActiveItem] = useState(null);
    const [activeStyles, setActiveStyles] = useState({});
    const [scale, setScale] = useState(1);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const isPanning = useRef(false);
    const startPoint = useRef({ x: 0, y: 0 });
    const [invitationData, setInvitationData] = useState({
        title: "",
        message: "",
        audience: "",
        template_userId: id,
        metadata: {}, // Empty metadata to start
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "",
    });

    // Convert metadata to sections when loading data
    const fetchInvitationData = async () => {
        try {
            const response = await userAPI.getInvitationById(id);
            const data = response.data;

            setInvitationData(data);
            const processedSections = processMetadataToSections(data.metadata);
            setSections(processedSections);
        } catch (error) {
            console.error("Error fetching invitation data:", error);
            showSnackbar("Failed to load invitation data!", "error");
        }
    };

    useEffect(() => {
        fetchInvitationData();
    }, [id]);

    // Helper to process metadata into sections
    const processMetadataToSections = (metadata) => {
        const styles = metadata?.style || [];
        const components = metadata?.components || [];

        return styles.map((styleItem, index) => ({
            id: `section-${index}`,
            style: styleItem,
            components: components[index] || [],
        }));
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSaveInvitation = async () => {
        try {
            const metadata = {
                components: sections.map((section) => section.components),
                style: sections.map((section) => section.style),
            };

            const dataToSave = { ...invitationData, metadata };

            console.log("Saving invitation data:", dataToSave);

            const savedInvitation = await userAPI.createInvitation(dataToSave);
            console.log("Invitation saved successfully:", savedInvitation);
            showSnackbar("Invitation saved successfully!", "success");
        } catch (error) {
            console.error("Error saving invitation:", error);
            showSnackbar("Failed to save invitation!", "error");
        }
    };


    const handleStyleChange = (key, value) => {
        if (!activeItem) return;
        setActiveStyles((prev) => ({ ...prev, [key]: value }));
        setSections((prev) =>
            prev.map((section) =>
                section.id === activeItem.sectionId
                    ? {
                        ...section,
                        components: section.components.map((component) =>
                            component.id === activeItem.componentId
                                ? {
                                    ...component,
                                    style: { ...component.style, [key]: value },
                                }
                                : component
                        ),
                        style: { ...section.style, [key]: value },
                    }
                    : section
            )
        );
    };

    const addSection = () => {
        const newSection = {
            id: `section-${Date.now()}`,
            position: sections.length + 1,
            components: [],
            style: {
                width: "100%",
                minWidth: "800px",
                height: "100%",
                padding: 2,
                position: "relative",
                marginBottom: 2,
                minHeight: "500px",
                backgroundColor: "#f9f9f9",
                transition: "border 0.3s ease",
            },
        };

        setSections((prev) => [...prev, newSection]);
        showSnackbar("New section added!", "success");
    };

    const handleComponentClick = (component) => {
        setActiveItem(component);
        setActiveStyles(component.style || {});
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100vh",
                    backgroundColor: "#FCFCFC",
                }}
            >
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        width: "87%",
                        zIndex: 1000,
                        backgroundColor: "#FCFCFC",
                    }}
                >
                    <Headerv2 />
                </Box>
                <Box sx={{ display: "flex", height: "100%", overflow: "hidden" }}>
                    <LayerList sections={sections} onUpdateSections={setSections} />
                    <Box
                        id="canvas"
                        sx={{
                            flex: 1,
                            position: "relative",
                            backgroundColor: "#FCFCFC",
                        }}
                    >
                        <Canvas
                            sections={sections}
                            setSections={setSections}
                            setActiveItem={handleComponentClick}
                            activeItem={activeItem}
                            setActiveStyles={setActiveStyles}
                        />
                    </Box>
                    <Toolbar
                        activeStyles={activeStyles}
                        handleStyleChange={handleStyleChange}
                        invitationData={invitationData}
                        setInvitationData={setInvitationData}
                    />
                </Box>
                <Box
                    sx={{
                        position: "fixed",
                        bottom: "20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                    }}
                >
                    <Button variant="contained" onClick={addSection}>
                        Add Section
                    </Button>
                    <Button variant="contained" onClick={handleSaveInvitation}>
                        Save Invitation
                    </Button>
                </Box>
            </Box>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </DndProvider>
    );
};

export default CreateInvitation;
