import { useState } from 'react';
import { Card, CardContent, TextField, Button, Box, Alert } from '@mui/material';
import { Send } from '@mui/icons-material';
import { useCreatePostMutation } from '../communityApi';

const CreatePost = () => {
    const [content, setContent] = useState('');
    const [createPost, { isLoading, error }] = useCreatePostMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        try {
            await createPost({ content }).unwrap();
            setContent('');
        } catch (err) {
            console.error('Failed to create post:', err);
        }
    };

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Box component="form" onSubmit={handleSubmit}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            Failed to create post. Please try again.
                        </Alert>
                    )}
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="What's happening on the court?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Box display="flex" justifyContent="flex-end">
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isLoading || !content.trim()}
                            startIcon={<Send />}
                        >
                            {isLoading ? 'Posting...' : 'Post'}
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default CreatePost;
