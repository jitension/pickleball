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
    InputAdornment,
    IconButton,
    Divider,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Google as GoogleIcon,
    SportsTennis as TennisIcon
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useLoginMutation } from './authApi';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [login, { isLoading, error }] = useLoginMutation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await login({ email, password }).unwrap();
            dispatch(setCredentials({
                user: result.user,
                access: result.access,
                refresh: result.refresh
            }));
            navigate('/');
        } catch (err) {
            console.error('Failed to login:', err);
        }
    };

    const handleGoogleLogin = () => {
        // Redirect to backend OAuth endpoint
        window.location.href = '/api/auth/google/login/';
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    animation: 'fadeIn 0.8s ease-out',
                    '@keyframes fadeIn': {
                        '0%': { opacity: 0, transform: 'translateY(20px)' },
                        '100%': { opacity: 1, transform: 'translateY(0)' },
                    },
                }}
            >
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TennisIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 800, background: 'linear-gradient(45deg, #00E676 30%, #2979FF 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Pickleball
                    </Typography>
                </Box>

                <Card sx={{ width: '100%', p: 2 }}>
                    <CardContent>
                        <Typography component="h2" variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                            Welcome back
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Please enter your details to sign in.
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                                Login failed. Please check your credentials.
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
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                InputProps={{
                                    sx: { borderRadius: 3 }
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                    sx: { borderRadius: 3 },
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" />}
                                    label={<Typography variant="body2">Remember me</Typography>}
                                />
                                <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                                    <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                                        Forgot password?
                                    </Typography>
                                </Link>
                            </Box>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                sx={{ mt: 3, mb: 2, height: 48, fontSize: '1rem' }}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </Button>

                            <Divider sx={{ my: 3 }}>
                                <Typography variant="caption" color="text.secondary">
                                    OR CONTINUE WITH
                                </Typography>
                            </Divider>

                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<GoogleIcon />}
                                onClick={handleGoogleLogin}
                                sx={{
                                    borderColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'text.primary',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        backgroundColor: 'rgba(0, 230, 118, 0.05)',
                                    }
                                }}
                            >
                                Continue with Google
                            </Button>

                            <Box sx={{ mt: 4, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Don't have an account?{' '}
                                    <Link to="/register" style={{ textDecoration: 'none' }}>
                                        <Typography component="span" variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                                            Sign up
                                        </Typography>
                                    </Link>
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default Login;
