import { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material"

export const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export function NotificationProvider({ children }) {
  const [messages, setMessages] = useState("");
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("success");


  const showNotification = (msg, type="success") => {
    setMessages(msg);
    setSeverity(type);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  }

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Snackbar 
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }} variant="filled">
          {messages}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}

