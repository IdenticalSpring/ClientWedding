import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import FullCalendar from "@fullcalendar/react"; // Import FullCalendar
import dayGridPlugin from "@fullcalendar/daygrid"; // Plugin ngày
import interactionPlugin from "@fullcalendar/interaction"; // Plugin để tương tác (click, drag)
import Header from "../../dashboard/components/Header";
import { userAPI } from "../../service/user";

const Calendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await userAPI.getAllEvents(); // API giả sử là getAllEvents
      // Biến đổi dữ liệu từ API để FullCalendar có thể sử dụng
      const calendarEvents = response.data.map((event) => ({
        title: event.eventName,
        date: event.eventDate, // Đảm bảo rằng eventDate là kiểu string (YYYY-MM-DD)
        description: event.location,
        backgroundColor: "#FFCDD2", // Màu nền hồng nhạt
        borderColor: "#D32F2F", // Màu viền đỏ
        textColor: "#880E4F", // Màu chữ tím đậm
      }));
      setEvents(calendarEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  return (
    <>
      <Header />
      <Box sx={{ alignItems: "center" }}>
        <Typography variant="h4" gutterBottom>
          Quản lý đám cưới
        </Typography>
      </Box>
      <Box sx={{ height: "80vh", width: "100%" }}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek,dayGridDay",
          }}
          eventContent={(eventInfo) => (
            <div
              style={{
                backgroundColor: "#FFEBEE", // Nền nhẹ
                borderRadius: "4px", // Viền bo tròn
                padding: "4px", // Thêm khoảng cách
              }}
            >
              <b style={{ color: "#D32F2F" }}>{eventInfo.event.title}</b> <br />
              <span style={{ color: "#880E4F" }}>
                {eventInfo.event.extendedProps.description}
              </span>
            </div>
          )}
          eventClick={(info) => {
            alert(
              `Event: ${info.event.title}\nLocation: ${info.event.extendedProps.description}`
            );
          }}
        />
      </Box>
    </>
  );
};

export default Calendar;
