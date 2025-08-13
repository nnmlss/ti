import { Box, Typography, Grid, Alert } from '@mui/material';
import { GalleryImageItem } from './GalleryImageItem';
import type { GalleryImage } from '../types';

interface GalleryImageListProps {
  images: GalleryImage[];
  onImageDelete: (imagePath: string) => void;
  onImageUpdate: (imagePath: string, updates: Partial<GalleryImage>) => void;
  imagesToDelete: Set<string>;
  error?: string | null;
}

export function GalleryImageList({
  images,
  onImageDelete,
  onImageUpdate,
  imagesToDelete,
  error,
}: GalleryImageListProps) {
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (images.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No gallery images yet. Upload some images to get started.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Gallery Images ({images.length})
      </Typography>
      
      <Grid container spacing={2}>
        {images.map((image, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={image.path || index}>
            <GalleryImageItem
              image={image}
              onDelete={onImageDelete}
              onUpdate={onImageUpdate}
              isMarkedForDeletion={imagesToDelete.has(image.path)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}