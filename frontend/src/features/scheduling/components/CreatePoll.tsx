import { useState } from 'react';
import { Card, CardContent, Button, Box, Alert, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Add } from '@mui/icons-material';
import type { Dayjs } from 'dayjs';
import { useCreatePollMutation, useGetLocationsQuery } from '../schedulingApi';

const CreatePoll = () => {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Dayjs | null>(null);
    const [timeStart, setTimeStart] = useState<Dayjs | null>(null);
    const [timeEnd, setTimeEnd] = useState<Dayjs | null>(null);
    const [locationId, setLocationId] = useState<number | ''>('');

    const { data: locationsData } = useGetLocationsQuery();
    const [createPoll, { isLoading, error }] = useCreatePollMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !timeStart || !timeEnd || !locationId) return;

        try {
            await createPoll({
                date: date.format('YYYY-MM-DD'),
                time_start: timeStart.format('HH:mm:ss'),
                time_end: timeEnd.format('HH:mm:ss'),
                location: locationId as number,
            }).unwrap();
            setDate(null);
            setTimeStart(null);
            setTimeEnd(null);
            setLocationId('');
            setOpen(false);
        } catch (err) {
            console.error('Failed to create poll:', err);
        }
    };

    if (!open) {
        return (
            <Box mb={3}>
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => setOpen(true)}
                >
                    Create New Session
                </Button>
            </Box>
        );
    }

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Create New Session
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box component="form" onSubmit={handleSubmit}>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                Failed to create session. Please try again.
                            </Alert>
                        )}
                        <DatePicker
                            label="Date"
                            value={date}
                            onChange={(newValue) => setDate(newValue)}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    required: true,
                                    sx: { mb: 2 }
                                }
                            }}
                        />
                        <Box display="flex" gap={2} mb={2}>
                            <TimePicker
                                label="Start Time"
                                value={timeStart}
                                onChange={(newValue) => setTimeStart(newValue)}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        required: true
                                    }
                                }}
                            />
                            <TimePicker
                                label="End Time"
                                value={timeEnd}
                                onChange={(newValue) => setTimeEnd(newValue)}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        required: true
                                    }
                                }}
                            />
                        </Box>
                        <FormControl fullWidth sx={{ mb: 2 }} required>
                            <InputLabel>Location</InputLabel>
                            <Select
                                value={locationId}
                                label="Location"
                                onChange={(e) => setLocationId(e.target.value as number)}
                            >
                                {locationsData?.results.map((location) => (
                                    <MenuItem key={location.id} value={location.id}>
                                        {location.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Box display="flex" gap={2}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isLoading}
                                fullWidth
                            >
                                {isLoading ? 'Creating...' : 'Create Session'}
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => setOpen(false)}
                                fullWidth
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </LocalizationProvider>
            </CardContent>
        </Card>
    );
};

export default CreatePoll;
