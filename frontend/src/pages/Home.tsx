import { Box, Container, Typography, Card, CardContent, Button } from '@mui/material';
import { useAppSelector } from '../store/hooks';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useAppSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <Container maxWidth="md" sx={{ mt: 8 }}>
            <Card>
                <CardContent>
                    <Typography variant="h3" gutterBottom>
                        Welcome to Community Pickleball!
                    </Typography>
                    <Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>
                        Hello, {user?.first_name} {user?.last_name}!
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body1"><strong>Email:</strong> {user?.email}</Typography>
                        <Typography variant="body1"><strong>Username:</strong> {user?.username}</Typography>
                        <Typography variant="body1"><strong>Skill Level:</strong> {user?.profile.skill_level}</Typography>
                        <Typography variant="body1"><strong>Status:</strong> {user?.profile.status}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Button variant="contained" onClick={() => navigate('/feed')}>
                            Go to Feed
                        </Button>
                        <Button variant="contained" onClick={() => navigate('/polls')}>
                            Go to Polls
                        </Button>
                        <Button variant="contained" onClick={() => navigate('/competition')}>
                            Go to Competition
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Home;
