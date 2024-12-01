import * as React from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";

const mainListItems = [
  { text: "Quản lý khách mời", link: "/quanlykhachmoi/" }, // Đường dẫn đúng
  { text: "Quản lý thiệp mời", link: "/quanlythiepmoi/" },
  { text: "Quản lý website", link: "/quanlytrangweb/" },
  {
    text: "Quản lý thiệp cưới",
    link: "/quanlythiepcuoi/",
  },
  { text: "Quản lý đám cưới", link: "/quanlydamcuoi/" },
];

export default function MenuContent() {
  const location = useLocation(); // Lấy thông tin về URL hiện tại

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      {/* Danh sách chính */}
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={Link}
              to={item.link}
              selected={location.pathname === item.link}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
