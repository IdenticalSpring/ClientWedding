import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
// import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
// import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "../components/shared-theme/AppTheme";
import { GoogleIcon, FacebookIcon } from "./CustomeIcons";
import ColorModeSelect from "../components/shared-theme/ColorModeSelect";
import { registerUser } from "../service/auth";
import ActivateAccountDialog from "./ActiveAccount"; // Import the dialog

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 110dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function SignUp(props) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState("");

  const [dialogOpen, setDialogOpen] = React.useState(false); // Manage dialog state

  const validateInputs = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const name = document.getElementById("name");

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Vui lòng nhập gmail");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Mật khẩu phải ít nhất 6 ký tự");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (!name.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage("Vui lòng nhập tên của bạn");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateInputs()) {
      return;
    }

    const data = new FormData(event.currentTarget);

    const userPayload = {
      name: data.get("name"),
      email: data.get("email"),
      password: data.get("password"),
    };

    const response = await registerUser(userPayload);

    if (response.success) {
      setDialogOpen(true); // Open the dialog
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Đăng ký tài khoản
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Họ và tên</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Jon Snow"
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Gmail</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={passwordError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Mật khẩu</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? "error" : "primary"}
              />
            </FormControl>
            {/* <FormControlLabel
              control={<Checkbox value="allowExtraEmails" color="primary" />}
              label="I want to receive updates via email."
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Đăng ký
            </Button>
          </Box>
          <Divider>
            <Typography sx={{ color: "text.secondary" }}>Hoặc</Typography>
          </Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={() => alert("Sign up with Google")}
            >
              Đăng ký với Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FacebookIcon />}
              onClick={() => alert("Sign up with Facebook")}
            >
              Đăng ký với Facebook
            </Button>
            <Typography sx={{ textAlign: "center" }}>
              Bạn đã có tài khoản?{" "}
              <Link
                href="/sign-in/"
                variant="body2"
                sx={{ alignSelf: "center" }}
              >
                Đăng nhập
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
      <ActivateAccountDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </AppTheme>
  );
}
