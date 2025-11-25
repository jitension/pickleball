import { createTheme, alpha } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#00E676', // Vibrant Green
            light: '#66FFA6',
            dark: '#00B248',
            contrastText: '#000000',
        },
        secondary: {
            main: '#2979FF', // Bright Blue
            light: '#75A7FF',
            dark: '#004ECB',
            contrastText: '#FFFFFF',
        },
        background: {
            default: '#0F172A', // Deep Slate
            paper: '#1E293B', // Lighter Slate
        },
        text: {
            primary: '#F8FAFC',
            secondary: '#94A3B8',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '3.5rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
        },
        h2: {
            fontSize: '2.5rem',
            fontWeight: 700,
            letterSpacing: '-0.01em',
        },
        h4: {
            fontWeight: 700,
            letterSpacing: '-0.01em',
        },
        button: {
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '1rem',
        },
    },
    shape: {
        borderRadius: 16,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarColor: "#6b6b6b #2b2b2b",
                    "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                        backgroundColor: "#2b2b2b",
                    },
                    "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                        borderRadius: 8,
                        backgroundColor: "#6b6b6b",
                        minHeight: 24,
                        border: "3px solid #2b2b2b",
                    },
                    "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
                        backgroundColor: "#959595",
                    },
                    "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
                        backgroundColor: "#959595",
                    },
                    "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
                        backgroundColor: "#959595",
                    },
                    "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
                        backgroundColor: "#2b2b2b",
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    padding: '10px 24px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 230, 118, 0.2)',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(45deg, #00E676 30%, #66FFA6 90%)',
                    color: '#000000',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 24,
                    backgroundImage: 'none',
                    backgroundColor: alpha('#1E293B', 0.6),
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                        backgroundColor: alpha('#000000', 0.2),
                        '& fieldset': {
                            borderColor: alpha('#ffffff', 0.1),
                        },
                        '&:hover fieldset': {
                            borderColor: alpha('#ffffff', 0.3),
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#00E676',
                        },
                    },
                },
            },
        },
    },
});

export default theme;
