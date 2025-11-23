import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useCreateChallengeMutation } from './competitionApi';
import { useGetUsersQuery } from '../users/usersApi';
import type { User } from '../auth/types';

const CreateChallenge = () => {
    const [partnerId, setPartnerId] = useState<string>('');
    const [createChallenge, { isLoading, error }] = useCreateChallengeMutation();
    const { data: users, isLoading: usersLoading, error: usersError } = useGetUsersQuery();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!partnerId) return;

        try {
            await createChallenge({ challenger_2: parseInt(partnerId) }).unwrap();
            setPartnerId('');
        } catch (err) {
            console.error('Failed to create challenge:', err);
        }
    };

    const handleChange = (event: SelectChangeEvent) => {
        setPartnerId(event.target.value as string);
    };

    return (
        <Card sx={{ mb: 4 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Issue a Challenge
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Select a partner to start a challenge. You will be placed in the pool for higher-ranked teams to accept.
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        Failed to create challenge.
                    </Alert>
                )}

                {usersError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        Failed to load users. Please refresh the page.
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="partner-select-label">Select Partner</InputLabel>
                        <Select
                            labelId="partner-select-label"
                            id="partner-select"
                            value={partnerId}
                            label="Select Partner"
                            onChange={handleChange}
                            disabled={usersLoading || !!usersError || !users || users.length === 0}
                        >
                            {usersLoading ? (
                                <MenuItem disabled>Loading users...</MenuItem>
                            ) : !users || users.length === 0 ? (
                                <MenuItem disabled>No users available</MenuItem>
                            ) : (
                                users.map((user: User) => (
                                    <MenuItem key={user.id} value={user.id}>
                                        {user.username}
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!partnerId || isLoading || usersLoading}
                    >
                        Challenge
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default CreateChallenge;
