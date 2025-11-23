import { Container, Typography, Box } from '@mui/material';
import ChallengeList from '../features/competition/ChallengeList';
import CreateChallenge from '../features/competition/CreateChallenge';

const Competition = () => {
    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Competition
            </Typography>
            <Box sx={{ mb: 4 }}>
                <CreateChallenge />
            </Box>
            <Box>
                <ChallengeList />
            </Box>
        </Container>
    );
};

export default Competition;
