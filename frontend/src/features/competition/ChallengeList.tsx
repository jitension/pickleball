import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Avatar,
    Stack,
    CircularProgress,
    Alert
} from '@mui/material';
import { useGetChallengesQuery } from './competitionApi';
import type { Challenge } from './types';
import { ChallengeStatus } from './types';

const ChallengeCard = ({ challenge }: { challenge: Challenge }) => {
    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                    <Box flex={1}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Challengers
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar>{challenge.challenger_1.username[0]}</Avatar>
                            <Typography>{challenge.challenger_1.username}</Typography>
                            <Typography color="text.secondary">&</Typography>
                            <Avatar>{challenge.challenger_2.username[0]}</Avatar>
                            <Typography>{challenge.challenger_2.username}</Typography>
                        </Stack>
                    </Box>

                    <Box textAlign="center">
                        <Chip
                            label={challenge.status}
                            color={challenge.status === ChallengeStatus.OPEN ? 'success' : 'default'}
                            size="small"
                        />
                    </Box>

                    <Box flex={1} display="flex" flexDirection="column" alignItems="flex-end">
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Defenders
                        </Typography>
                        {challenge.defender_1 && challenge.defender_2 ? (
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Avatar>{challenge.defender_1.username[0]}</Avatar>
                                <Typography>{challenge.defender_1.username}</Typography>
                                <Typography color="text.secondary">&</Typography>
                                <Avatar>{challenge.defender_2.username[0]}</Avatar>
                                <Typography>{challenge.defender_2.username}</Typography>
                            </Stack>
                        ) : (
                            <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                Waiting for defenders...
                            </Typography>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

const ChallengeList = () => {
    const { data, isLoading, error } = useGetChallengesQuery();

    if (isLoading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">Failed to load challenges</Alert>;
    }

    if (!data?.results.length) {
        return <Alert severity="info">No active challenges found.</Alert>;
    }

    return (
        <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Active Challenges
            </Typography>
            {data.results.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
        </Box>
    );
};

export default ChallengeList;
