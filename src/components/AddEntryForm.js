import React, { useState } from "react";
import axios from "axios";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Alert,
    Typography,
    IconButton,
    InputAdornment,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { Close as CloseIcon, EmojiEvents, Person, Score, Phone, Badge } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const MotionDialog = motion(Dialog);

const AddEntryForm = ({ open, onClose, onSubmitSuccess }) => {
    const [formData, setFormData] = useState({
        name: "",
        studentId: "",
        score: "",
        phoneNumber: "",
    });
    const [error, setError] = useState("");
    const { token } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
    
        if (!formData.name.trim() || !formData.studentId.trim() || !formData.score.trim()) {
            setError("All required fields must be filled.");
            return;
        }
    
    
        if (isNaN(Number(formData.score)) || Number(formData.score) <= 0) {
            setError("Score must be a positive number.");
            return;
        }
    
        if (formData.phoneNumber && !/^\d+$/.test(formData.phoneNumber)) {
            setError("Phone number must contain only digits.");
            return;
        }
    
        try {
            console.log("Submitting data:", formData);
            await axios.post(
                "https://surfers-bakend.onrender.com/api/leaderboard",
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setFormData({ name: "", studentId: "", score: "", phoneNumber: "" });
            onSubmitSuccess();
            onClose();
        } catch (error) {
            console.error("Error adding entry:", error);
            if (error.response) {
                console.error("Server Response:", error.response.data);
                setError(error.response.data.message || "Error adding entry. Please try again.");
            } else {
                setError("Error adding entry. Please check your network and try again.");
            }
        }
    };
    
    return (
        <AnimatePresence>
            {open && (
                <MotionDialog
                    open={open}
                    onClose={onClose}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                            background: "rgba(255, 255, 255, 0.95)",
                            backdropFilter: "blur(10px)",
                            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.2)",
                            border: "1px solid rgba(255, 255, 255, 0.18)",
                            minWidth: isMobile ? "250px" : "350px",
                        },
                    }}
                >
                    <Box sx={{ position: "relative" }}>
                        <IconButton
                            onClick={onClose}
                            sx={{
                                position: "absolute",
                                right: 8,
                                top: 8,
                                color: "grey.500",
                            }}
                        >
                            <CloseIcon />
                        </IconButton>

                        <DialogTitle sx={{ 
                            textAlign: "center", 
                            pt: isMobile ? 2 : 3, 
                            pb: isMobile ? 1 : 2 
                        }}>
                            <EmojiEvents
                                sx={{
                                    fontSize: isMobile ? 32 : 40,
                                    color: "primary.main",
                                    mb: 1,
                                }}
                            />
                            <Typography 
                                variant={isMobile ? "h6" : "h5"} 
                                component="div" 
                                fontWeight="bold"
                            >
                                Add New High Score
                            </Typography>
                        </DialogTitle>

                        <form onSubmit={handleSubmit}>
                            <DialogContent sx={{ pt: 2 }}>
                                <AnimatePresence mode="wait">
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                        >
                                            <Alert severity="error" sx={{ mb: 2 }}>
                                                {error}
                                            </Alert>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <Box
                                    component={motion.div}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    sx={{ 
                                        display: "flex", 
                                        flexDirection: "column", 
                                        gap: isMobile ? 2 : 3 
                                    }}
                                >
                                    <TextField
                                        label="Player Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        variant="outlined"
                                        size={isMobile ? "small" : "medium"}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Person color="primary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <TextField
                                        label="Student ID"
                                        name="studentId"
                                        value={formData.studentId}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        variant="outlined"
                                        size={isMobile ? "small" : "medium"}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Badge color="primary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <TextField
                                        label="Score"
                                        name="score"
                                        type="number"
                                        value={formData.score}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        variant="outlined"
                                        size={isMobile ? "small" : "medium"}
                                        inputProps={{ min: 1 }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Score color="primary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <TextField
                                        label="Phone Number (Optional)"
                                        name="phoneNumber"
                                        type="text"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="outlined"
                                        size={isMobile ? "small" : "medium"}
                                        inputProps={{ maxLength: 15 }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Phone color="primary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Box>
                            </DialogContent>

                            <DialogActions
                                sx={{
                                    p: isMobile ? 2 : 3,
                                    pt: isMobile ? 1 : 2,
                                    gap: 1,
                                    justifyContent: "center",
                                }}
                            >
                                <Button
                                    onClick={onClose}
                                    variant="outlined"
                                    size={isMobile ? "small" : "medium"}
                                    sx={{
                                        borderRadius: 2,
                                        px: isMobile ? 2 : 3,
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size={isMobile ? "small" : "medium"}
                                    sx={{
                                        borderRadius: 2,
                                        px: isMobile ? 2 : 3,
                                    }}
                                >
                                    Add Score
                                </Button>
                            </DialogActions>
                        </form>
                    </Box>
                </MotionDialog>
            )}
        </AnimatePresence>
    );
};

export default AddEntryForm;
