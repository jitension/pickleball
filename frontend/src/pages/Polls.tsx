import { Container, Typography, Box, CircularProgress, Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Logout, Forum } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useGetPollsQuery } from '../features/scheduling/schedulingApi';
import PollCard from '../features/scheduling/components/PollCard';
import CreatePoll from '../features/scheduling/components/CreatePoll';
import { logout } from '../features/auth/authSlice';

const Polls = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { data, isLoading, error } = useGetPollsQuery();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error">Failed to load polls. Please try again later.</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Upcoming Sessions
                </Typography>
                <Box display="flex" gap={1}>
                    <Button
                        variant="outlined"
                        startIcon={<Forum />}
                        onClick={() => navigate('/feed')}
                    >
                        Feed
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<Logout />}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Box>
            </Box>

            <CreatePoll />

            {data && data.results.length === 0 ? (
                <Alert severity="info">No upcoming sessions scheduled. Create one above!</Alert>
            ) : (
                data?.results.map((poll) => <PollCard key={poll.id} poll={poll} />)
            )}
        </Container>
    );
};

export default Polls;
