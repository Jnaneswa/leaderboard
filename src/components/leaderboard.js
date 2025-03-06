import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Avatar,
    Chip,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { EmojiEvents, MilitaryTech, WorkspacePremium } from "@mui/icons-material";
import AddEntryForm from "./AddEntryForm";
import { useAuth } from "../context/AuthContext";

function Leaderboard() {
    const [data, setData] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, entry: null });
    const { isAdmin, token } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const fetchLeaderboard = async () => {
        try {
            const response = await axios.get("https://surfers-bakend.onrender.com/api/leaderboard");
            setData(response.data);
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const handleDelete = async (entry) => {
        try {
            await axios.delete(`https://surfers-bakend.onrender.com/api/leaderboard/${entry._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchLeaderboard();
            setDeleteConfirm({ open: false, entry: null });
        } catch (error) {
            console.error("Error deleting entry:", error);
        }
    };

    const getWinnerStyle = (index) => {
        switch (index) {
            case 0:
                return { color: "#FFD700", background: "rgba(255, 215, 0, 0.1)" };
            case 1:
                return { color: "#C0C0C0", background: "rgba(192, 192, 192, 0.1)" };
            case 2:
                return { color: "#CD7F32", background: "rgba(205, 127, 50, 0.1)" };
            default:
                return {};
        }
    };

    const getWinnerIcon = (index) => {
        switch (index) {
            case 0:
                return <EmojiEvents sx={{ fontSize: isMobile ? "1.2rem" : "1.5rem", color: "#FFD700" }} />;
            case 1:
                return <MilitaryTech sx={{ fontSize: isMobile ? "1.2rem" : "1.5rem", color: "#C0C0C0" }} />;
            case 2:
                return <WorkspacePremium sx={{ fontSize: isMobile ? "1.2rem" : "1.5rem", color: "#CD7F32" }} />;
            default:
                return null;
        }
    };

    return (
        <Box sx={{ p: isMobile ? 1 : 3 }}>
            <Typography 
                variant={isMobile ? "h5" : "h4"} 
                sx={{ 
                    mb: isMobile ? 2 : 3, 
                    fontWeight: "bold", 
                    color: "primary.main",
                    textAlign: isMobile ? "center" : "left"
                }}
            >
                Leaderboard
            </Typography>

            <TableContainer
                component={Paper}
                sx={{
                    borderRadius: isMobile ? 2 : 4,
                    overflow: "hidden",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                }}
            >
                <Table size={isMobile ? "small" : "medium"}>
                    <TableHead>
                        <TableRow
                            sx={{
                                background:
                                    "linear-gradient(90deg, rgba(100, 100, 255, 0.1) 0%, rgba(150, 150, 255, 0.05) 100%)",
                            }}
                        >
                            <TableCell sx={{ 
                                fontWeight: "bold", 
                                color: "text.primary",
                                padding: isMobile ? 1 : 2
                            }}>Rank</TableCell>
                            <TableCell sx={{ 
                                fontWeight: "bold", 
                                color: "text.primary",
                                padding: isMobile ? 1 : 2
                            }}>Name</TableCell>
                            <TableCell sx={{ 
                                fontWeight: "bold", 
                                color: "text.primary",
                                padding: isMobile ? 1 : 2
                            }}>Score</TableCell>
                            {isAdmin && (
                                <TableCell 
                                    align="right" 
                                    sx={{ 
                                        fontWeight: "bold", 
                                        color: "text.primary",
                                        padding: isMobile ? 1 : 2
                                    }}
                                >
                                    Actions
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((entry, index) => (
                            <TableRow
                                key={entry._id}
                                sx={{
                                    "&:nth-of-type(odd)": {
                                        backgroundColor: "rgba(0, 0, 0, 0.02)",
                                    },
                                    "&:hover": {
                                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                                    },
                                }}
                            >
                                <TableCell sx={{ padding: isMobile ? 1 : 2 }}>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        {index < 3 ? (
                                            <>
                                                {getWinnerIcon(index)}
                                                <Typography
                                                    sx={{
                                                        ml: 1,
                                                        fontWeight: "bold",
                                                        color: getWinnerStyle(index).color,
                                                        fontSize: isMobile ? "0.875rem" : "1rem"
                                                    }}
                                                >
                                                    {index + 1}
                                                </Typography>
                                            </>
                                        ) : (
                                            <Typography sx={{ fontSize: isMobile ? "0.875rem" : "1rem" }}>
                                                {index + 1}
                                            </Typography>
                                        )}
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ padding: isMobile ? 1 : 2 }}>
                                    <Typography
                                        sx={{
                                            fontWeight: "medium",
                                            color: index < 3 ? getWinnerStyle(index).color : "inherit",
                                            fontSize: isMobile ? "0.875rem" : "1rem"
                                        }}
                                    >
                                        {entry.name}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ padding: isMobile ? 1 : 2 }}>
                                    <Chip
                                        label={entry.score}
                                        size={isMobile ? "small" : "medium"}
                                        sx={{
                                            backgroundColor: index < 3 ? getWinnerStyle(index).background : "transparent",
                                            color: index < 3 ? getWinnerStyle(index).color : "text.primary",
                                            fontWeight: "bold",
                                            border: index >= 3 ? "1px solid" : "none",
                                            borderColor: index >= 3 ? "primary.main" : "transparent"
                                        }}
                                    />
                                </TableCell>
                                {isAdmin && (
                                    <TableCell align="right" sx={{ padding: isMobile ? 1 : 2 }}>
                                        <IconButton
                                            onClick={() => setDeleteConfirm({ open: true, entry })}
                                            color="error"
                                            size={isMobile ? "small" : "medium"}
                                        >
                                            <DeleteIcon sx={{ fontSize: isMobile ? "1.2rem" : "1.5rem" }} />
                                        </IconButton>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {isAdmin && (
                <Fab
                    color="primary"
                    aria-label="add"
                    onClick={() => setOpenForm(true)}
                    sx={{
                        position: 'fixed',
                        bottom: isMobile ? 16 : 32,
                        right: isMobile ? 16 : 32,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                >
                    <AddIcon />
                </Fab>
            )}

            <AddEntryForm 
                open={openForm} 
                onClose={() => setOpenForm(false)} 
                onSubmitSuccess={fetchLeaderboard}
            />

            <Dialog
                open={deleteConfirm.open}
                onClose={() => setDeleteConfirm({ open: false, entry: null })}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete {deleteConfirm.entry?.name}'s entry?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirm({ open: false, entry: null })}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => handleDelete(deleteConfirm.entry)}
                        color="error"
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Leaderboard;