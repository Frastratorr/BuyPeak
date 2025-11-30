import React, { useEffect } from 'react';

export default function Notification({ message, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 1500);
        return () => clearTimeout(timer)
    }, [onClose]);

    return (
        <div style={{
            position: "fixed",
            bottom: 40,
            right: 20,
            background: "#4caf50",
            color: "white",
            padding: "12px 20px",
            borderRadius: 8,
            boxShadow: "0 0 12px rgba(0,0,0,0.25)",
            zIndex: 2000,
            transition: "all 0.7s ease"
        }}>
            {message}
        </div>
    );
}