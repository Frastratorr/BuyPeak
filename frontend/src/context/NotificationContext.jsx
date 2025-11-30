import { createContext, useContext, useState } from "react";

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [messages, setMessages] = useState([]);

  const showNotification = (text, duration = 3000) => {
    const id = Date.now();
    setMessages(prev => [...prev, { id, text }]);
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== id));
    }, duration);
  };

  return (
    <NotificationContext.Provider value={{ messages, showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

// хук для удобного доступа к контексту
export function useNotification() {
  return useContext(NotificationContext);
}

// компонент для отображения уведомлений
export function NotificationContainer() {
  const { messages } = useNotification();
  return (
    <div style={{ position: "fixed", top: 10, right: 10, zIndex: 1000 }}>
      {messages.map(m => (
        <div key={m.id} style={{ background: "#1976d2", color: "white", padding: "10px 20px", borderRadius: 4, marginBottom: 8 }}>
          {m.text}
        </div>
      ))}
    </div>
  );
}
