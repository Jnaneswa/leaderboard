import React, { useState } from "react";
import { ThemeProvider, createTheme, CssBaseline, Container, AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { AdminPanelSettings } from "@mui/icons-material";
import Leaderboard from "./components/leaderboard";
import AdminLogin from "./components/AdminLogin";
import { useAuth } from "./context/AuthContext";

const theme = createTheme({
    palette: {
        primary: {
            main: "#FF4B91",
        },
        secondary: {
            main: "#FFB000",
        },
    },
    typography: {
        h1: {
            fontSize: "2.5rem",
            fontWeight: 600,
            background: "linear-gradient(45deg, #FF4B91, #FFB000)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textFillColor: "transparent",
        },
    },
});

function App() {
    const [loginOpen, setLoginOpen] = useState(false);
    const { isAdmin, logout } = useAuth();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
                <AppBar position="static" sx={{ bgcolor: 'white', color: 'black' }}>
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h1" sx={{ flex: 1, textAlign: 'center' }}>
                            Subway Surfers Leaderboard
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AdminPanelSettings />}
                            onClick={() => isAdmin ? logout() : setLoginOpen(true)}
                            sx={{ 
                                minWidth: '120px',
                                height: '40px',
                                marginLeft: '20px'
                            }}
                        >
                            {isAdmin ? "Logout" : "Admin Login"}
                        </Button>
                    </Toolbar>
                </AppBar>
                <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
                    <Leaderboard />
                </Container>
                <AdminLogin open={loginOpen} onClose={() => setLoginOpen(false)} />
            </Box>
        </ThemeProvider>
    );
}

export default App;
