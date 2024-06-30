import React, { useState, useEffect } from "react";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  Box,
  Paper,
  CircularProgress,
  ThemeProvider,
  createTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fade,
  Grow,
} from "@mui/material";
import { styled } from "@mui/system";
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  CloudUpload as UploadIcon,
  QuestionAnswer as AskIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import axios from "axios";

const StyledContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
}));

const StyledContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  transition: "box-shadow 0.3s ease-in-out",
  "&:hover": {
    boxShadow: theme.shadows[10],
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginTop: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
function App() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("Upload a Book to start...");
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      }),
    [darkMode]
  );

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a file first.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${API_URL}/upload`, formData);
      const bookName = file.name.replace(".pdf", "");
      console.log(`Server response: ${response.data.message}`);
      setStatus(
        `${bookName} book uploaded and processed successfully. You can chat with the book now 📖😁`
      );
    } catch (error) {
      console.error("There was an error uploading the file!", error);
      setStatus(
        error.response?.data?.message ||
          "Error uploading file. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) {
      setStatus("Please enter a question.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/ask`, {
        question,
      });
      setAnswer(response.data.answer);
    } catch (error) {
      console.error("There was an error getting the answer!", error);
      setAnswer(
        "Sorry, I couldn't get an answer at this time. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role='presentation'
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem button onClick={() => setDarkMode(!darkMode)}>
          <ListItemIcon>
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </ListItemIcon>
          <ListItemText primary={darkMode ? "Light Mode" : "Dark Mode"} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StyledContainer>
        <AppBar position='static'>
          <Toolbar>
            {isMobile && (
              <IconButton
                edge='start'
                color='inherit'
                aria-label='menu'
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
              LiberLens
            </Typography>
            {!isMobile && (
              <IconButton
                color='inherit'
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            )}
          </Toolbar>
        </AppBar>
        <Drawer anchor='left' open={drawerOpen} onClose={toggleDrawer(false)}>
          {drawerContent}
        </Drawer>
        <StyledContent>
          <Typography variant='h5' gutterBottom>
            {status}
          </Typography>
          <Grow in={true} timeout={1000}>
            <StyledPaper elevation={3}>
              <Typography variant='h6' gutterBottom>
                Upload PDF
              </Typography>
              <input
                type='file'
                accept='.pdf'
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  // Reset status when a new file is chosen
                  setStatus(
                    "Book selected. Click Upload to process and Chat🤖."
                  );
                }}
                style={{ display: "none" }}
                id='upload-file'
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <label htmlFor='upload-file'>
                  <Button
                    variant='contained'
                    component='span'
                    startIcon={<UploadIcon />}
                    sx={{ mb: 2 }} // Add margin bottom for spacing
                  >
                    Choose Book📔
                  </Button>
                </label>
                {file && (
                  <>
                    <Typography variant='body2' sx={{ mb: 2 }}>
                      {file.name}
                    </Typography>
                    <StyledButton
                      variant='contained'
                      color='primary'
                      onClick={handleUpload}
                      disabled={isLoading}
                      startIcon={
                        isLoading ? (
                          <CircularProgress size={20} />
                        ) : (
                          <UploadIcon />
                        )
                      }
                    >
                      Upload
                    </StyledButton>
                  </>
                )}
              </Box>
            </StyledPaper>
          </Grow>
          <Fade in={true} timeout={1500}>
            <StyledPaper elevation={3}>
              <Typography variant='h6' gutterBottom>
                Ask a Question
              </Typography>
              <StyledTextField
                label='Question'
                variant='outlined'
                fullWidth
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <StyledButton
                variant='contained'
                color='primary'
                onClick={handleAsk}
                disabled={isLoading}
                startIcon={
                  isLoading ? <CircularProgress size={20} /> : <AskIcon />
                }
              >
                Ask
              </StyledButton>
            </StyledPaper>
          </Fade>
          {answer && (
            <Fade in={true} timeout={500}>
              <StyledPaper elevation={3}>
                <Typography variant='h6' gutterBottom>
                  Answer
                </Typography>
                <Typography
                  variant='body1'
                  component='pre'
                  sx={{ whiteSpace: "pre-wrap" }}
                >
                  {answer}
                </Typography>
              </StyledPaper>
            </Fade>
          )}
        </StyledContent>
      </StyledContainer>
    </ThemeProvider>
  );
}

export default App;
