import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store';
import {
  Card,
  CardMedia,
  CardActions,
  IconButton,
  TextField,
  Box,
  Typography,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { GalleryImage } from '../types';
import { generateThumbnailUrl, getGalleryUrl, extractFilename } from '../utils/imageUtils';
import { generateThumbnailsThunk } from '../store/thunks/thumbnailThunks';

interface GalleryImageItemProps {
  image: GalleryImage;
  onDelete: (imagePath: string) => void;
  onUpdate: (imagePath: string, updates: Partial<GalleryImage>) => void;
  isMarkedForDeletion: boolean;
}

export function GalleryImageItem({
  image,
  onDelete,
  onUpdate,
  isMarkedForDeletion,
}: GalleryImageItemProps) {
  const [author, setAuthor] = useState(image.author || '');
  const [imageError, setImageError] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showNotFound, setShowNotFound] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleAuthorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAuthor = event.target.value;
    setAuthor(newAuthor);
    onUpdate(image.path, { author: newAuthor });
  };

  const handleDeleteClick = () => {
    onDelete(image.path);
  };

  // Generate thumbnail URL from original path
  const thumbnailUrl = getGalleryUrl(generateThumbnailUrl(image.path));
  const originalUrl = getGalleryUrl(image.path);

  const handleImageError = async () => {
    if (imageError) {
      // Already tried thumbnail, try original
      setShowNotFound(true);
      return;
    }

    setImageError(true);
    setIsGenerating(true);

    try {
      // Try to generate thumbnails from original
      const filename = extractFilename(image.path);
      await dispatch(generateThumbnailsThunk(filename)).unwrap();

      // Force image reload by adding timestamp
      const img = new Image();
      img.onload = () => {
        setImageError(false);
        setIsGenerating(false);
      };
      img.onerror = () => {
        setShowNotFound(true);
        setIsGenerating(false);
      };
      img.src = `${thumbnailUrl}?t=${Date.now()}`;
    } catch (error) {
      console.warn('Failed to generate thumbnails:', error);
      setShowNotFound(true);
      setIsGenerating(false);
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 300,
        m: 1,
        backgroundColor: isMarkedForDeletion ? '#d32f2f80' : 'background.paper',
        opacity: isMarkedForDeletion ? 0.7 : 1,
        transition: 'all 0.3s ease',
        position: 'relative',
      }}
    >
      {showNotFound ? (
        <Box
          sx={{
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'error.main',
            color: 'text.secondary',
          }}
        >
          <Typography variant='body2' align='center'>
            Image not found
          </Typography>
        </Box>
      ) : (
        <CardMedia
          component='img'
          height='200'
          image={imageError ? originalUrl : thumbnailUrl}
          alt={image.author || 'Gallery image'}
          sx={{
            objectFit: 'cover',
            opacity: isGenerating ? 0.5 : 1,
            transition: 'opacity 0.3s ease',
          }}
          onError={handleImageError}
        />
      )}
      {isGenerating && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
          }}
        >
          <Typography variant='caption' color='text.secondary'>
            Generating...
          </Typography>
        </Box>
      )}
      <Box sx={{ p: 2 }}>
        <Typography
          variant='caption'
          color='text.secondary'
          sx={{ mb: 1, display: 'block', fontFamily: 'monospace' }}
        >
          {image.path}
        </Typography>
        <TextField
          fullWidth
          size='small'
          label='Author'
          value={author}
          onChange={handleAuthorChange}
          placeholder='Enter author name'
          variant='outlined'
        />
        {image.width && image.height && (
          <Typography variant='caption' color='text.secondary' sx={{ mt: 1, display: 'block' }}>
            {image.width} × {image.height}px
          </Typography>
        )}
      </Box>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Tooltip title='Delete image'>
          <span>
            <IconButton color='error' onClick={handleDeleteClick} size='small'>
              <DeleteIcon />
            </IconButton>
          </span>
        </Tooltip>
      </CardActions>
    </Card>
  );
}
