import React from "react";
import AppAppBar from "../../layout/navbar";
import AppTheme from "../../components/shared-theme/AppTheme";
import Hero from "../../landing-page/components/Hero";
import TemplateContent from "./TemplateContent";
import { Box } from "@mui/material";

const TemplatePage = () => {
    return (
        <AppTheme>
            <AppAppBar />
            <Hero />
            <Box sx={{ paddingTop: 20 }}> 
                <TemplateContent />
            </Box>
        </AppTheme>
    );
};

export default TemplatePage;
