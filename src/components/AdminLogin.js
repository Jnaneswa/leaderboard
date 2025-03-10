import React, { useState } from 'react';
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
    InputAdornment,
    IconButton,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { Visibility, VisibilityOff, AdminPanelSettings } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const AdminLogin = ({ open, onClose }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
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
        setError('');

        if (!formData.username || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        const success = await login(formData.username, formData.password);
        if (success) {
            setFormData({ username: '', password: '' });
            onClose();
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                component: motion.div,
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                sx: {
                    borderRadius: 2,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    minWidth: isMobile ? '280px' : '350px',
                    margin: isMobile ? '16px' : '32px',
                },
            }}
        >
            <DialogTitle sx={{ 
                textAlign: 'center', 
                pt: isMobile ? 2 : 3,
                pb: isMobile ? 1 : 2 
            }}>
                <AdminPanelSettings 
                    sx={{ 
                        fontSize: isMobile ? 32 : 40, 
                        color: 'primary.main', 
                        mb: 1 
                    }} 
                />
                <Typography 
                    variant={isMobile ? "h6" : "h5"} 
                    component="div" 
                    fontWeight="bold"
                >
                    Admin Login
                </Typography>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: isMobile ? 1.5 : 2 
                    }}>
                        <TextField
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            fullWidth
                            required
                            size={isMobile ? "small" : "medium"}
                        />
                        <TextField
                            label="Password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            fullWidth
                            required
                            size={isMobile ? "small" : "medium"}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            size={isMobile ? "small" : "medium"}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ 
                    p: isMobile ? 2 : 3, 
                    justifyContent: 'center',
                    gap: 1
                }}>
                    <Button 
                        onClick={onClose} 
                        variant="outlined" 
                        size={isMobile ? "small" : "medium"}
                        sx={{ 
                            borderRadius: 2, 
                            px: isMobile ? 2 : 3 
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
                            px: isMobile ? 2 : 3 
                        }}
                    >
                        Login
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AdminLogin;
