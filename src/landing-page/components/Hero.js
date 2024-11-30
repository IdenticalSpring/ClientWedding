import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";

// import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";

import Typography from "@mui/material/Typography";

import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const StyledBox = styled("div")(({ theme }) => ({
  alignSelf: "center",
  width: "100%",
  height: 400,
  marginTop: theme.spacing(0),
  borderRadius: (theme.vars || theme).shape.borderRadius,
  outline: "6px solid",
  outlineColor: "hsla(220, 25%, 80%, 0.2)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.grey[200],
  boxShadow: "0 0 12px 8px hsla(220, 25%, 80%, 0.2)",
  backgroundImage: `url(${
    process.env.TEMPLATE_IMAGE_URL || "https://mui.com"
  }/static/screenshots/material-ui/getting-started/templates/dashboard.jpg)`,
  backgroundSize: "cover",
  [theme.breakpoints.up("sm")]: {
    marginTop: theme.spacing(35),
    height: 700,
  },
  ...theme.applyStyles("dark", {
    boxShadow: "0 0 24px 12px hsla(210, 100%, 25%, 0.2)",
    backgroundImage: `url(${
      process.env.TEMPLATE_IMAGE_URL || "https://mui.com"
    }/static/screenshots/material-ui/getting-started/templates/dashboard-dark.jpg)`,
    outlineColor: "hsla(220, 20%, 42%, 0.1)",
    borderColor: (theme.vars || theme).palette.grey[700],
  }),
}));

export default function Hero() {
  const navigate = useNavigate();

  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: "100%",
        backgroundRepeat: "no-repeat",
        backgroundImage:
          "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)",
        ...theme.applyStyles("dark", {
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)",
        }),
      })}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack
          spacing={2}
          useFlexGap
          sx={{ alignItems: "center", width: { xs: "100%", sm: "70%" } }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: -1,
            }}
          >
            <source
              src="https://biihappy.com/static/theme/img/iwedding/iwedding_bg.mp4"
              type="video/mp4"
            />
          </video>
          <Typography
            variant="h1"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "column", lg: "column" },
              alignItems: "center",
              textAlign: "center",
              fontSize: "clamp(3rem, 10vw, 3.5rem)",
            }}
          >
            Nền&nbsp;Tảng&nbsp;Tạo&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={(theme) => ({
                fontSize: "inherit",
                color: "primary.main",
                ...theme.applyStyles("dark", {
                  color: "primary.light",
                }),
              })}
            >
              Website đám cưới & Thiệp cưới online miễn phí
            </Typography>
          </Typography>
          <Typography
            sx={{
              textAlign: "center",
              color: "text.secondary",
              width: { sm: "100%", md: "80%" },
              fontSize: "clamp(1rem, 10vw, 2rem)",
            }}
          >
            Hãy làm cho đám cưới trở nên độc đáo hơn theo cách riêng của bạn!
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            alignItems="center"
            justifyContent="center"
            sx={{ pt: 2, width: { xs: "100%", sm: "350px" } }}
          >
            {/* <InputLabel htmlFor="email-hero" sx={visuallyHidden}>
              Email
            </InputLabel>
            <TextField
              id="email-hero"
              hiddenLabel
              size="small"
              variant="outlined"
              aria-label="Enter your email address"
              placeholder="Your email address"
              fullWidth
              slotProps={{
                htmlInput: {
                  autoComplete: "off",
                  "aria-label": "Enter your email address",
                },
              }}
            /> */}
            <Button
              size="small"
              disableElevation
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
              onClick={() => navigate("/template")}
            >
              Bắt đầu ngay
            </Button>
          </Stack>
          {/* <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textAlign: "center" }}
          >
            By clicking &quot;Start now&quot; you agree to our&nbsp;
            <Link href="#" color="primary">
              Terms & Conditions
            </Link>
            .
          </Typography> */}
        </Stack>
        <StyledBox id="image" />
      </Container>
    </Box>
  );
}
