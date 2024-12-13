import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Stack from "@mui/material/Stack";

const mainListItems = [
  {
    text: "Quản lý",
    dropdown: true,
    children: [
      { text: "Quản lý khách mời", link: "/quanlykhachmoi/" },
      { text: "Quản lý website thiệp cưới", link: "/quanlywebsite/" },
      { text: "Quản lý đám cưới", link: "/quanlydamcuoi/" },
    ],
  },
  { text: "Thông tin người dùng", link: "/nguoidung/" },
];

export default function MenuContent() {
  const location = useLocation(); // Lấy thông tin về URL hiện tại

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      {/* Danh sách chính */}
      <List dense>
        {mainListItems.map((item, index) =>
          item.dropdown ? ( // Kiểm tra nếu là dropdown
            <Accordion key={index} disableGutters>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  bgcolor: location.pathname.startsWith(item.link)
                    ? "lightgray"
                    : "inherit",
                }}
              >
                <ListItemText primary={item.text} />
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  {item.children.map((child, childIndex) => (
                    <ListItem key={childIndex} disablePadding>
                      <ListItemButton
                        component={Link}
                        to={child.link}
                        selected={location.pathname === child.link}
                      >
                        <ListItemText primary={child.text} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ) : (
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
          )
        )}
      </List>
    </Stack>
  );
}
