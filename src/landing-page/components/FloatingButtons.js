import React, { useState, useEffect } from "react";
import { Box, Tooltip } from "@mui/material";
import { minWidth, styled } from "@mui/system";
import { tooltipClasses } from "@mui/material/Tooltip";
import { CustomModal, CustomModalSp } from "./modals/CustomModal";

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#1976d2",
    color: "white",
    fontSize: "12px",
    border: "1px solid #ffffff",
    borderRadius: "8px",
    maxWidth: "300px",
    minWidth: "250px",
    padding: "8px",
    fontWeight: "normal",
    wordWrap: "break-word",
    textAlign: "center",
    boxSizing: "border-box",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#1976d2",
  },
}));

const FloatingButtons = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedModal, setSelectedModal] = useState(null);
  const [moveLeft, setMoveLeft] = useState(false);

  const handleOpenModal = (modalType) => {
    setSelectedModal(modalType);
    setOpenModal(true);
    setMoveLeft(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setMoveLeft(false);
  };

  useEffect(() => {
    if (openModal) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "auto";
    }

    return () => {
      document.documentElement.style.overflow = "auto";
    };
  }, [openModal]);

  return (
    <Box
      sx={{
        minWidth: 60,
        position: "fixed",
        bottom: 70,
        right: moveLeft ? "-20px" : "-10px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        backgroundColor: "#f0f0f0",
        border: "2px solid #1976d2",
        borderRadius: "8px",
        padding: "8px",
        overflow: "hidden",
        transition: "right 0.3s ease",
      }}
    >
      <CustomTooltip
        title={
          <div style={{ textAlign: "center", minHeight: "80px" }}>
            <span
              style={{ fontWeight: "bold", display: "block", fontSize: "1rem" }}
            >
              Trợ lí khách hàng
            </span>
            <div style={{ fontSize: "14px", marginTop: "4px" }}>
              Đăng kí trợ lí chỉ với 500.000đ
            </div>
            <div style={{ fontSize: "14px", marginTop: "4px" }}>
              Hỗ trợ cài đặt Website từ a đến z
            </div>
          </div>
        }
        placement="left"
        arrow
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            overflow: "hidden",
            cursor: "pointer",
          }}
          onClick={() => handleOpenModal("customerSupport")}
        >
          <img
            src="/img/customer-support.png"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            alt="Trợ lí khách hàng"
          />
        </Box>
      </CustomTooltip>

      <CustomTooltip title="Hỗ trợ kỹ thuật" placement="left" arrow>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            overflow: "hidden",
            cursor: "pointer",
          }}
          onClick={() => handleOpenModal("support")}
        >
          <img
            src="/img/support.png"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            alt="Hỗ trợ kỹ thuật"
          />
        </Box>
      </CustomTooltip>

      {selectedModal === "customerSupport" && (
        <CustomModal open={openModal} onClose={handleCloseModal} />
      )}
      {selectedModal === "support" && (
        <CustomModalSp open={openModal} onClose={handleCloseModal} />
      )}
    </Box>
  );
};

export default FloatingButtons;
