import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700, letterSpacing: "-0.5px" },
    h4: { fontWeight: 700, letterSpacing: "-0.5px" },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600, fontSize: "1rem" },
    body1: { fontSize: "1.05rem", color: "#4a5568" },
    body2: { fontSize: "0.95rem", color: "#718096" }
  },
  palette: {
    primary: {
      main: "#2563eb",
      light: "#60a5fa",
      dark: "#1e40af",
      contrastText: "#fff",
    },
    secondary: {
      main: "#f43f5e",
    },
    background: {
      default: "transparent",
      paper: "rgba(255, 255, 255, 0.8)",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "50px",
          padding: "10px 24px",
          boxShadow: "0 4px 14px 0 rgba(37, 99, 235, 0.15)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 20px 0 rgba(37, 99, 235, 0.3)",
          },
        },
        contained: {
          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
        },
        outlined: {
          borderWidth: "2px",
          "&:hover": { borderWidth: "2px" }
        }
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.6)",
          boxShadow: "0 10px 40px -10px rgba(0,0,0,0.05)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        },
        elevation3: {
          boxShadow: "0 20px 40px -5px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
            borderColor: "rgba(255,255,255, 1)",
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "16px",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            transition: "all 0.3s",
            "& fieldset": { borderColor: "rgba(0,0,0,0.1)" },
            "&:hover fieldset": { borderColor: "#2563eb" },
            "&.Mui-focused": {
              backgroundColor: "#fff",
              boxShadow: "0 4px 20px rgba(37, 99, 235, 0.1)",
            },
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.6)",
          marginBottom: "16px !important",
          borderRadius: "16px !important",
          "&:before": { display: "none" },
          boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
        }
      }
    }
  },
});

export default theme;