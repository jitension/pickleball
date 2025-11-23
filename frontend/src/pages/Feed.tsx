import { Container, Typography, Box, CircularProgress, Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Logout } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useGetFeedQuery } from '../features/community/communityApi';
import CreatePost from '../features/community/components/CreatePost';
import PostCard from '../features/community/components/PostCard';
import { logout } from '../features/auth/authSlice';

const Feed = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { data, isLoading, error } = useGetFeedQuery();

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
                <Alert severity="error">Failed to load feed. Please try again later.</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Community Feed
                </Typography>
                <Box display="flex" gap={1}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/polls')}
                    >
                        Polls
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

            <CreatePost />

            {data && data.results.length === 0 ? (
                <Alert severity="info">No posts yet. Be the first to post!</Alert>
            ) : (
                data?.results.map((post) => <PostCard key={post.id} post={post} />)
            )}
        </Container>
    );
};

export default Feed;
