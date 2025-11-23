import { useState } from 'react';
import {
    Card, CardContent, Typography, Box, Chip, Button, ButtonGroup,
    List, ListItem, ListItemAvatar, ListItemText, Avatar,
    Tabs, Tab, Stack
} from '@mui/material';
import { LocationOn, Schedule, People } from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import type { Poll, RSVP } from '../types';
import { useCreateRSVPMutation } from '../schedulingApi';

interface PollCardProps {
    poll: Poll;
}

const PollCard = ({ poll }: PollCardProps) => {
    const [createRSVP, { isLoading }] = useCreateRSVPMutation();
    const [activeTab, setActiveTab] = useState(0);

    const handleRSVP = async (status: 'IN' | 'OUT' | 'MAYBE' | 'LATE') => {
        try {
            await createRSVP({ pollId: poll.id, data: { status } }).unwrap();
        } catch (error) {
            console.error('Failed to RSVP:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'IN': return 'success';
            case 'OUT': return 'error';
            case 'MAYBE': return 'warning';
            case 'LATE': return 'info';
            default: return 'default';
        }
    };

    const getSkillColor = (level: string) => {
        switch (level) {
            case 'EMERGING': return 'success';
            case 'INTERMEDIATE': return 'warning';
            case 'ADVANCED': return 'error';
            default: return 'default';
        }
    };

    const filterRSVPs = (status: 'IN' | 'OUT' | 'MAYBE' | 'LATE'): RSVP[] => {
        return poll.rsvps.filter(r => r.status === status);
    };

    const totalPlaying = poll.rsvp_counts.IN + poll.rsvp_counts.MAYBE + poll.rsvp_counts.LATE;

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            {format(parseISO(poll.date), 'EEEE, MMMM d, yyyy')}
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                            <Box display="flex" alignItems="center" gap={0.5}>
                                <Schedule fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    {poll.time_start} - {poll.time_end}
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={0.5}>
                                <LocationOn fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    {poll.location}
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                    {poll.user_rsvp && (
                        <Chip
                            label={poll.user_rsvp.status}
                            color={getStatusColor(poll.user_rsvp.status)}
                            size="small"
                        />
                    )}
                </Box>

                <ButtonGroup fullWidth disabled={isLoading} sx={{ mb: 2 }}>
                    <Button
                        variant={poll.user_rsvp?.status === 'IN' ? 'contained' : 'outlined'}
                        color="success"
                        onClick={() => handleRSVP('IN')}
                    >
                        In ({poll.rsvp_counts.IN})
                    </Button>
                    <Button
                        variant={poll.user_rsvp?.status === 'MAYBE' ? 'contained' : 'outlined'}
                        color="warning"
                        onClick={() => handleRSVP('MAYBE')}
                    >
                        Maybe ({poll.rsvp_counts.MAYBE})
                    </Button>
                    <Button
                        variant={poll.user_rsvp?.status === 'LATE' ? 'contained' : 'outlined'}
                        color="info"
                        onClick={() => handleRSVP('LATE')}
                    >
                        Late ({poll.rsvp_counts.LATE})
                    </Button>
                    <Button
                        variant={poll.user_rsvp?.status === 'OUT' ? 'contained' : 'outlined'}
                        color="error"
                        onClick={() => handleRSVP('OUT')}
                    >
                        Out ({poll.rsvp_counts.OUT})
                    </Button>
                </ButtonGroup>

                <Box display="flex" gap={1} alignItems="center" mb={2}>
                    <People fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                        {totalPlaying} playing
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.5}>
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                            {poll.location_name}
                        </Typography>
                    </Box>
                    <Chip label={`${poll.skill_counts.EMERGING} E`} size="small" color="success" />
                    <Chip label={`${poll.skill_counts.INTERMEDIATE} I`} size="small" color="warning" />
                    <Chip label={`${poll.skill_counts.ADVANCED} A`} size="small" color="error" />
                </Box>

                <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tab label={`In (${poll.rsvp_counts.IN})`} />
                    <Tab label={`Maybe (${poll.rsvp_counts.MAYBE})`} />
                    <Tab label={`Late (${poll.rsvp_counts.LATE})`} />
                    <Tab label={`Out (${poll.rsvp_counts.OUT})`} />
                </Tabs>

                <Box sx={{ pt: 2 }}>
                    {activeTab === 0 && (
                        <List dense>
                            {filterRSVPs('IN').length === 0 ? (
                                <Typography variant="body2" color="text.secondary" align="center">No one yet</Typography>
                            ) : (
                                filterRSVPs('IN').map((rsvp) => (
                                    <ListItem key={rsvp.id}>
                                        <ListItemAvatar>
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                                {rsvp.user.first_name[0]}{rsvp.user.last_name[0]}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${rsvp.user.first_name} ${rsvp.user.last_name}`}
                                            secondary={
                                                <Chip
                                                    label={rsvp.user.profile.skill_level}
                                                    size="small"
                                                    color={getSkillColor(rsvp.user.profile.skill_level)}
                                                />
                                            }
                                        />
                                    </ListItem>
                                ))
                            )}
                        </List>
                    )}
                    {activeTab === 1 && (
                        <List dense>
                            {filterRSVPs('MAYBE').length === 0 ? (
                                <Typography variant="body2" color="text.secondary" align="center">No one yet</Typography>
                            ) : (
                                filterRSVPs('MAYBE').map((rsvp) => (
                                    <ListItem key={rsvp.id}>
                                        <ListItemAvatar>
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'warning.main' }}>
                                                {rsvp.user.first_name[0]}{rsvp.user.last_name[0]}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${rsvp.user.first_name} ${rsvp.user.last_name}`}
                                            secondary={
                                                <Chip
                                                    label={rsvp.user.profile.skill_level}
                                                    size="small"
                                                    color={getSkillColor(rsvp.user.profile.skill_level)}
                                                />
                                            }
                                        />
                                    </ListItem>
                                ))
                            )}
                        </List>
                    )}
                    {activeTab === 2 && (
                        <List dense>
                            {filterRSVPs('LATE').length === 0 ? (
                                <Typography variant="body2" color="text.secondary" align="center">No one yet</Typography>
                            ) : (
                                filterRSVPs('LATE').map((rsvp) => (
                                    <ListItem key={rsvp.id}>
                                        <ListItemAvatar>
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'info.main' }}>
                                                {rsvp.user.first_name[0]}{rsvp.user.last_name[0]}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${rsvp.user.first_name} ${rsvp.user.last_name}`}
                                            secondary={
                                                <Chip
                                                    label={rsvp.user.profile.skill_level}
                                                    size="small"
                                                    color={getSkillColor(rsvp.user.profile.skill_level)}
                                                />
                                            }
                                        />
                                    </ListItem>
                                ))
                            )}
                        </List>
                    )}
                    {activeTab === 3 && (
                        <List dense>
                            {filterRSVPs('OUT').length === 0 ? (
                                <Typography variant="body2" color="text.secondary" align="center">No one yet</Typography>
                            ) : (
                                filterRSVPs('OUT').map((rsvp) => (
                                    <ListItem key={rsvp.id}>
                                        <ListItemAvatar>
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'error.main' }}>
                                                {rsvp.user.first_name[0]}{rsvp.user.last_name[0]}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${rsvp.user.first_name} ${rsvp.user.last_name}`}
                                            secondary={
                                                <Chip
                                                    label={rsvp.user.profile.skill_level}
                                                    size="small"
                                                    color={getSkillColor(rsvp.user.profile.skill_level)}
                                                />
                                            }
                                        />
                                    </ListItem>
                                ))
                            )}
                        </List>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default PollCard;
