import * as React from "react";
import AppAppBar from "../../layout/navbar"; // Ensure the path is correct
import AppTheme from "../../components/shared-theme/AppTheme"; // Ensure the path is correct
import TemplateContent from "./TemplateContent"; // Relative import
import { Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import NavbarTemplate from "./components/Navbar_Template";

const TemplatePage = () => {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />

      <NavbarTemplate />
      <div>
        <Box sx={{ paddingTop: 20 }}>
          <TemplateContent />
        </Box>

        {/* <Footer /> */}
      </div>
    </AppTheme>
  );
};

export default TemplatePage;
