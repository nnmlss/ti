import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface GalleryImageUploadProps {
  onFilesSelected: (files: File[]) => void;
  isUploading?: boolean;
  error?: string | null;
  maxFiles?: number;
}

export function GalleryImageUpload({
  onFilesSelected,
  isUploading = false,
  error = null,
  maxFiles = 10,
}: GalleryImageUploadProps) {
  const [dragError, setDragError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (files: FileList | File[]): { valid: File[]; errors: string[] } => {
    const validFiles: File[] = [];
    const errors: string[] = [];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    Array.from(files).forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: Invalid file type (only JPG, JPEG, PNG allowed)`);
      } else if (file.size > maxSize) {
        errors.push(`${file.name}: File too large (max 5MB)`);
      } else {
        validFiles.push(file);
      }
    });

    return { valid: validFiles, errors };
  };

  const handleFiles = (files: FileList | File[]) => {
    setDragError(null);
    const { valid, errors } = validateFiles(files);

    if (errors.length > 0) {
      setDragError(errors.join(', '));
    }

    if (valid.length > 0) {
      onFilesSelected(valid.slice(0, maxFiles));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (isUploading) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isUploading) {
      setIsDragActive(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ mb: 3 }}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />
      
      <Paper
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleButtonClick}
        sx={{
          p: 3,
          textAlign: 'center',
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          bgcolor: isDragActive ? 'action.hover' : 'transparent',
          cursor: isUploading ? 'default' : 'pointer',
          opacity: isUploading ? 0.6 : 1,
          '&:hover': {
            borderColor: isUploading ? 'grey.300' : 'primary.main',
            bgcolor: isUploading ? 'transparent' : 'action.hover',
          },
        }}
      >
        
        {isUploading ? (
          <Box>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="body1">Uploading images...</Typography>
          </Box>
        ) : (
          <Box>
            <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {isDragActive ? 'Drop images here' : 'Add Gallery Images'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Drag & drop images here, or click to select files
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Supports: JPEG, JPG, PNG (max 5MB each, up to {maxFiles} files)
            </Typography>
          </Box>
        )}
      </Paper>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          onClick={handleButtonClick}
          disabled={isUploading}
        >
          Choose Files
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {dragError && (
        <Alert severity="warning" sx={{ mt: 2 }} onClose={() => setDragError(null)}>
          {dragError}
        </Alert>
      )}
    </Box>
  );
}