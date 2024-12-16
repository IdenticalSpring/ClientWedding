import React from "react";
import { Button, Input } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const ButtonUpload = ({ handleFileUpload }) => {
  return (
    <div>
      <Input
        type="file"
        id="file-upload"
        onChange={handleFileUpload}
        inputProps={{ accept: ".jpg,.jpeg,.png,.gif,.pdf" }}
        sx={{ display: "none" }}
      />
      <label htmlFor="file-upload">
        <Button
          variant="contained"
          color="primary"
          component="span"
          startIcon={<CloudUploadIcon />}
        >
          Upload File
        </Button>
      </label>
    </div>
  );
};

export default ButtonUpload;
