import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    Container,
    MenuItem
} from '@mui/material';
import { useRegisterMutation } from './authApi';
import type { RegisterRequest } from './types';

const Register = () => {
    const navigate = useNavigate();
    const [register, { isLoading, error }] = useRegisterMutation();

    const [formData, setFormData] = useState<RegisterRequest>({
        email: '',
        username: '',
        password: '',
        first_name: '',
        last_name: '',
        skill_level: 'EMERGING'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register(formData).unwrap();
            navigate('/login');
        } catch (err) {
            console.error('Failed to register:', err);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Card sx={{ minWidth: 275, p: 2 }}>
                <CardContent>
                    <Typography variant="h4" component="div" gutterBottom align="center">
                        Sign Up
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                        Join the Pickleball Community
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            Registration failed. Please try again.
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="first_name"
                                label="First Name"
                                value={formData.first_name}
                                onChange={handleChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="last_name"
                                label="Last Name"
                                value={formData.last_name}
                                onChange={handleChange}
                            />
                        </Box>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            select
                            name="skill_level"
                            label="Skill Level"
                            value={formData.skill_level}
                            onChange={handleChange}
                        >
                            <MenuItem value="EMERGING">Emerging</MenuItem>
                            <MenuItem value="INTERMEDIATE">Intermediate</MenuItem>
                            <MenuItem value="ADVANCED">Advanced</MenuItem>
                        </TextField>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Registering...' : 'Sign Up'}
                        </Button>
                        <Box display="flex" justifyContent="center">
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                <Typography variant="body2" color="primary">
                                    Already have an account? Sign In
                                </Typography>
                            </Link>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Register;
