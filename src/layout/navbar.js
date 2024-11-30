import React, { useEffect, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ColorModeIconDropdown from "../components/shared-theme/ColorModeIconDropdown";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ListAltIcon from "@mui/icons-material/ListAlt";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "8px 12px",
}));

// Styled components for dropdown menu
const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: "8px",
    boxShadow: theme.shadows[3],
    minWidth: "150px",
    backgroundColor: theme.palette.background.paper,
    padding: "4px 0",
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: "10px 16px",
  fontSize: "14px",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
  "& .MuiListItemIcon-root": {
    minWidth: "32px",
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  cursor: "pointer",
  "&:hover": {
    opacity: 0.8,
  },
}));

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(""); // State to hold avatar image
  const [anchorEl, setAnchorEl] = useState(null); // State for menu anchor
  const [userName, setUserName] = useState(""); // State để lưu tên người dùng

  useEffect(() => {
    const token = Cookies.get("token");
    const defaultAvatar =
      "https://th.bing.com/th/id/OIP.kQyrx9VbuWXWxCVxoreXOgHaHN?w=179&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7";
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setAvatar(decoded.avatar || defaultAvatar); // Đặt avatar
        setUserName(decoded.name || "User"); // Đặt tên (nếu không có, hiển thị mặc định là "User")
      } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
        setAvatar(defaultAvatar);
        setUserName("User"); // Tên mặc định nếu giải mã token thất bại
      }
    } else {
      setAvatar(defaultAvatar);
      setUserName("User"); // Tên mặc định khi không đăng nhập
    }
  }, []);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleScrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget); // Set the anchor for the menu
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Close the menu
  };

  const handleLogout = () => {
    Cookies.remove("token"); // Remove token on logout
    navigate("/sign-in"); // Navigate to login page
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "calc(var(--template-frame-height, 0px) + 20px)",
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
          >
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() => handleScrollToSection("features")}
              >
                Xem hướng dẫn
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() => handleScrollToSection("logo-collection")}
              >
                Công cụ lập kế hoạch
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() => handleScrollToSection("testimonials")}
              >
                Cặp đôi đã tạo
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() => handleScrollToSection("highlights")}
              >
                Điểm nổi bật
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                sx={{ minWidth: 0 }}
                onClick={() => navigate("/template")}
              >
                Kho giao diện
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                sx={{ minWidth: 0 }}
                onClick={() => handleScrollToSection("faq")}
              >
                Bảng giá
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() => navigate("/blog")}
                sx={{ minWidth: 0 }}
              >
                Blog
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            {/* Conditionally render either avatar or login/signup buttons */}
            {avatar ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <StyledAvatar src={avatar} onClick={handleMenuOpen} />
                <StyledMenu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuList>
                    <StyledMenuItem onClick={() => navigate("/profile")}>
                      <ListItemIcon>
                        <AccountCircleIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={`Xin chào, ${userName}`} />
                    </StyledMenuItem>
                    <Divider />
                    <StyledMenuItem onClick={() => navigate("/manager/")}>
                      <ListItemIcon>
                        <ListAltIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Quản lý khách mời" />
                    </StyledMenuItem>
                    <StyledMenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <ExitToAppIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Logout" />
                    </StyledMenuItem>
                  </MenuList>
                </StyledMenu>
              </Box>
            ) : (
              <>
                <Button
                  color="primary"
                  variant="text"
                  size="small"
                  onClick={() => navigate("/sign-in")}
                >
                  Đăng nhập
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  onClick={() => navigate("/sign-up")}
                >
                  Đăng ký
                </Button>
              </>
            )}
            <ColorModeIconDropdown />
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: "var(--template-frame-height, 0px)",
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                <MenuItem onClick={() => handleScrollToSection("features")}>
                  Features
                </MenuItem>
                <MenuItem onClick={() => handleScrollToSection("features")}>
                  Features
                </MenuItem>
                <MenuItem onClick={() => handleScrollToSection("testimonials")}>
                  Testimonials
                </MenuItem>
                <MenuItem onClick={() => handleScrollToSection("highlights")}>
                  Highlights
                </MenuItem>
                <MenuItem onClick={() => handleScrollToSection("pricing")}>
                  Pricing
                </MenuItem>
                <MenuItem onClick={() => handleScrollToSection("faq")}>
                  FAQ
                </MenuItem>
                <MenuItem onClick={() => navigate("/blog")}>Blog</MenuItem>

                <Divider sx={{ my: 3 }} />
                <MenuItem>
                  <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    onClick={() => navigate("/sign-up")}
                  >
                    Sign up
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button
                    color="primary"
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate("/sign-in")}
                  >
                    Sign in
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
