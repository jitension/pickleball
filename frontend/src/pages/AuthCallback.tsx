import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import { useGetUserQuery } from '../features/auth/authApi';
import { Box, CircularProgress, Typography } from '@mui/material';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isTokenStored, setIsTokenStored] = useState(false);

    // Get tokens from URL
    const access = searchParams.get('access');
    const refresh = searchParams.get('refresh');

    // Trigger user fetch only when we have tokens AND they are stored
    const { data: user, isSuccess, isError } = useGetUserQuery(undefined, {
        skip: !access || !isTokenStored,
    });

    useEffect(() => {
        if (access && refresh) {
            // First, store tokens so the API client can use them
            // We pass user: null for now, but we'll update it once fetched
            dispatch(setCredentials({
                user: null,
                access,
                refresh
            }));
            setIsTokenStored(true);
        } else {
            // OAuth failed, redirect to login
            navigate('/login');
        }
    }, [access, refresh, dispatch, navigate]);

    useEffect(() => {
        if (isSuccess && user && access && refresh) {
            // Once user is fetched, update credentials with full user data
            dispatch(setCredentials({
                user,
                access,
                refresh
            }));
            // Redirect to home
            navigate('/');
        } else if (isError) {
            navigate('/login');
        }
    }, [isSuccess, user, access, refresh, dispatch, navigate, isError]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            gap={2}
        >
            <CircularProgress size={60} />
            <Typography variant="h6" color="text.secondary">
                Completing sign in...
            </Typography>
        </Box>
    );
};

export default AuthCallback;
