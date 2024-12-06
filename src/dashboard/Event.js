import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  List,
  ListItem,
  ListItemText,
  Divider,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { userAPI } from "../service/user";
import AddEventModal from "./modal-event/CreateEvent"; // Import AddEventModal

const EventListModal = () => {
  const [events, setEvents] = useState([]); // Danh sách sự kiện
  const [weddingList, setWeddingList] = useState([]); // Danh sách đám cưới
  const [selectedWedding, setSelectedWedding] = useState(""); // Đám cưới đã chọn
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Trạng thái mở modal thêm sự kiện

  useEffect(() => {
    fetchWeddings(); // Lấy danh sách đám cưới khi mở modal
  }, []);

  useEffect(() => {
    if (selectedWedding) {
      fetchEventsByWedding(selectedWedding); 
    }
  }, [selectedWedding]);

  // Lấy danh sách đám cưới
  const fetchWeddings = async () => {
    try {
      const response = await userAPI.getAllWedding(); 
      setWeddingList(response.data);
    } catch (error) {
      console.error("Error fetching weddings:", error);
    }
  };

  // Lấy danh sách sự kiện theo weddingId
  const fetchEventsByWedding = async (weddingId) => {
    try {
      const response = await userAPI.getEventsByWeddingId(weddingId);
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events by weddingId:", error);
    }
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    if (selectedWedding) {
      fetchEventsByWedding(selectedWedding); // Làm mới danh sách sự kiện sau khi thêm mới
    }
  };

  return (
    <>
      {/* Modal hiển thị danh sách event */}
      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 400,
          bgcolor: "#FFF1F3", // Nền màu hồng nhạt
          boxShadow: 3,
          borderRadius: 2,
          p: 2,
          zIndex: 1300,
          border: "2px solid #F06292", // Viền màu hồng đậm
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            color: "#C2185B", // Màu tiêu đề hồng đậm
          }}
        >
          Danh sách sự kiện
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel
            id="wedding-select-label"
            sx={{
              color: "#AD1457", // Màu chữ đỏ hồng
            }}
          >
            Chọn đám cưới
          </InputLabel>
          <Select
            labelId="wedding-select-label"
            value={selectedWedding}
            onChange={(e) => setSelectedWedding(e.target.value)}
            label="Chọn đám cưới"
            sx={{
              "& .MuiSelect-root": {
                color: "#C2185B", // Màu chữ dropdown
              },
            }}
          >
            {weddingList.map((wedding) => (
              <MenuItem
                key={wedding.id}
                value={wedding.id}
                sx={{
                  "&:hover": {
                    backgroundColor: "#F8BBD0", // Màu nền khi hover
                  },
                }}
              >
                {wedding.brideName} & {wedding.groomName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <List>
          {events.length > 0 ? (
            events.map((event) => (
              <React.Fragment key={event.id}>
                <ListItem
                  sx={{
                    "&:hover": {
                      backgroundColor: "#FCE4EC", // Màu nền khi hover
                    },
                  }}
                >
                  <ListItemText
                    primary={event.eventName}
                    secondary={`Ngày: ${new Date(
                      event.eventDate
                    ).toLocaleDateString()} - Địa điểm: ${event.location}`}
                    sx={{
                      "& .MuiListItemText-primary": {
                        color: "#AD1457", // Màu chữ sự kiện
                      },
                      "& .MuiListItemText-secondary": {
                        color: "#F06292", // Màu chữ phụ
                      },
                    }}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          ) : (
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{
                color: "#E91E63", // Màu chữ khi không có sự kiện
              }}
            >
              Chưa có sự kiện nào.
            </Typography>
          )}
        </List>

        <Button
          variant="text-container"
          fullWidth
          sx={{
            minWidth: "fit-content",
            backgroundColor: "hsl(345, 75%, 42%)",
            color: "hsl(5, 90%, 95%)",
            "&:hover": {
              backgroundColor: "hsl(340, 80%, 38%)",
              opacity: 0.8,
            },
            alignSelf: "center",
          }}
          onClick={handleOpenAddModal}
        >
          Tạo sự kiện mới
        </Button>
      </Box>

      {/* Modal thêm sự kiện */}
      {isAddModalOpen && (
        <Dialog open={isAddModalOpen} onClose={handleCloseAddModal}>
          <AddEventModal onAddEvent={handleCloseAddModal} />
        </Dialog>
      )}
    </>
  );
};

export default EventListModal;
