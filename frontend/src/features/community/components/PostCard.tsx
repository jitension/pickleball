import { useState } from 'react';
import {
    Card, CardHeader, CardContent, CardActions, Avatar, IconButton,
    Typography, Box, Chip, Collapse, List, ListItem, ListItemAvatar,
    ListItemText, Divider, AvatarGroup, Tooltip, TextField, Button,
    CircularProgress
} from '@mui/material';
import { Comment as CommentIcon, Send } from '@mui/icons-material';
import { format } from 'date-fns';
import type { Post } from '../types';
import { useLikePostMutation, useGetCommentsQuery, useCreateCommentMutation } from '../communityApi';
import PickleballIcon from '../../../components/PickleballIcon';

interface PostCardProps {
    post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
    const [likePost] = useLikePostMutation();
    const [createComment, { isLoading: isCommenting }] = useCreateCommentMutation();
    const { data: comments, isLoading: loadingComments } = useGetCommentsQuery(post.id, {
        skip: post.comment_count === 0
    });

    const [showComments, setShowComments] = useState(false);
    const [showLikes, setShowLikes] = useState(false);
    const [commentText, setCommentText] = useState('');

    const handleLike = async () => {
        try {
            await likePost(post.id);
        } catch (error) {
            console.error('Failed to like post:', error);
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            await createComment({ postId: post.id, text: commentText }).unwrap();
            setCommentText('');
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    const getSkillLevelColor = (level: string) => {
        switch (level) {
            case 'EMERGING': return 'success';
            case 'INTERMEDIATE': return 'warning';
            case 'ADVANCED': return 'error';
            default: return 'default';
        }
    };

    // For likes, we'll use mock data for now since backend doesn't return who liked
    const likedBy = post.like_count > 0 ? [
        { first_name: 'Alice', last_name: 'J' },
        { first_name: 'Bob', last_name: 'S' },
        { first_name: 'Carol', last_name: 'W' },
    ].slice(0, Math.min(post.like_count, 3)) : [];

    return (
        <Card sx={{ mb: 2 }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {post.author.first_name[0]}{post.author.last_name[0]}
                    </Avatar>
                }
                title={
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="subtitle1">
                            {post.author.first_name} {post.author.last_name}
                        </Typography>
                        <Chip
                            label={post.author.profile.skill_level}
                            size="small"
                            color={getSkillLevelColor(post.author.profile.skill_level)}
                        />
                    </Box>
                }
                subheader={format(new Date(post.created), 'PPp')}
            />
            <CardContent>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {post.content}
                </Typography>
                {post.image && (
                    <Box mt={2}>
                        <img
                            src={post.image}
                            alt="Post"
                            style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 8 }}
                        />
                    </Box>
                )}
            </CardContent>
            <CardActions disableSpacing sx={{ px: 2, pb: 2 }}>
                <Box display="flex" alignItems="center" gap={1}>
                    <IconButton onClick={handleLike} color={post.is_liked ? 'warning' : 'default'}>
                        <PickleballIcon />
                    </IconButton>
                    {post.like_count > 0 && (
                        <Tooltip
                            title={
                                <Box>
                                    {likedBy.map((user, i) => (
                                        <Typography key={i} variant="caption" display="block">
                                            {user.first_name} {user.last_name}
                                        </Typography>
                                    ))}
                                    {post.like_count > 3 && (
                                        <Typography variant="caption" display="block">
                                            and {post.like_count - 3} more...
                                        </Typography>
                                    )}
                                </Box>
                            }
                        >
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                                onClick={() => setShowLikes(!showLikes)}
                            >
                                {post.like_count} {post.like_count === 1 ? 'like' : 'likes'}
                            </Typography>
                        </Tooltip>
                    )}
                </Box>

                <Box display="flex" alignItems="center" gap={1} ml={2}>
                    <IconButton
                        onClick={() => setShowComments(!showComments)}
                        sx={{
                            transform: showComments ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s',
                        }}
                    >
                        <CommentIcon />
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                        {post.comment_count} {post.comment_count === 1 ? 'comment' : 'comments'}
                    </Typography>
                </Box>
            </CardActions>

            {/* Likes List */}
            <Collapse in={showLikes} timeout="auto" unmountOnExit>
                <Divider />
                <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Liked by:</Typography>
                    <AvatarGroup max={10}>
                        {likedBy.map((user, index) => (
                            <Tooltip key={index} title={`${user.first_name} ${user.last_name}`}>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                                    {user.first_name[0]}{user.last_name[0]}
                                </Avatar>
                            </Tooltip>
                        ))}
                    </AvatarGroup>
                    {post.like_count > likedBy.length && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            and {post.like_count - likedBy.length} more
                        </Typography>
                    )}
                </Box>
            </Collapse>

            {/* Comments Section */}
            <Collapse in={showComments} timeout="auto" unmountOnExit>
                <Divider />

                {/* Add Comment Form */}
                <Box component="form" onSubmit={handleAddComment} sx={{ p: 2, pb: 1 }}>
                    <Box display="flex" gap={1}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Add a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            disabled={isCommenting}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            size="small"
                            disabled={isCommenting || !commentText.trim()}
                            sx={{ minWidth: 'auto', px: 2 }}
                        >
                            {isCommenting ? <CircularProgress size={20} /> : <Send fontSize="small" />}
                        </Button>
                    </Box>
                </Box>

                {/* Comments List */}
                {loadingComments ? (
                    <Box display="flex" justifyContent="center" p={2}>
                        <CircularProgress size={24} />
                    </Box>
                ) : comments && comments.length > 0 ? (
                    <List sx={{ pt: 0 }}>
                        {comments.map((comment) => (
                            <ListItem key={comment.id} alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
                                        {comment.author.first_name[0]}{comment.author.last_name[0]}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography variant="subtitle2">
                                            {comment.author.first_name} {comment.author.last_name}
                                        </Typography>
                                    }
                                    secondary={
                                        <>
                                            <Typography variant="body2" color="text.primary" component="span" display="block">
                                                {comment.text}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {format(new Date(comment.created), 'PPp')}
                                            </Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Box p={2} pt={0}>
                        <Typography variant="body2" color="text.secondary" align="center">
                            No comments yet. Be the first to comment!
                        </Typography>
                    </Box>
                )}
            </Collapse>
        </Card>
    );
};

export default PostCard;
