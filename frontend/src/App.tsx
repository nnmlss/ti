import React from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
} from '@mui/material';
import Grid from '@mui/material/Grid'; // v2 grid
import type { FlyingSite, WindDirection } from './types';

const windDirections: WindDirection[] = [
  'N',
  'NNE',
  'NE',
  'ENE',
  'E',
  'ESE',
  'SE',
  'SSE',
  'S',
  'SSW',
  'SW',
  'WSW',
  'W',
  'WNW',
  'NW',
  'NNW',
];

const initialSiteState: Omit<FlyingSite, '_id'> = {
  title: { bg: '', en: '' },
  windDirection: [],
  location: { type: 'Point', coordinates: [0, 0] },
  altitude: 0,
  accessOptions: [],
  galleryImages: [],
  accomodations: { bg: [], en: [] },
  alternatives: { bg: '', en: '' },
  access: { bg: '', en: '' },
  landingFields: '',
  tracklogs: [],
  localPilotsClubs: '',
};

function SiteForm() {
  const [formData, setFormData] = React.useState<Omit<FlyingSite, '_id'>>(initialSiteState);

  const handleInputChange = (field: keyof Omit<FlyingSite, '_id'>, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (
    field: 'title' | 'alternatives' | 'access',
    subField: 'bg' | 'en',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [subField]: value,
      },
    }));
  };

  const handleWindDirectionChange = (direction: WindDirection) => {
    setFormData((prev) => ({
      ...prev,
      windDirection: prev.windDirection.includes(direction)
        ? prev.windDirection.filter((d) => d !== direction)
        : [...prev.windDirection, direction],
    }));
  };

  const handleCoordinateChange = (index: 0 | 1, value: string) => {
    const newCoordinates = [...formData.location.coordinates] as [number, number];
    newCoordinates[index] = parseFloat(value) || 0;
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates: newCoordinates,
      },
    }));
  };

  const addTracklog = () => {
    setFormData((prev) => ({
      ...prev,
      tracklogs: [...(prev.tracklogs || []), ''],
    }));
  };

  const updateTracklog = (index: number, value: string) => {
    const newTracklogs = [...(formData.tracklogs || [])];
    newTracklogs[index] = value;
    setFormData((prev) => ({
      ...prev,
      tracklogs: newTracklogs,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/add-site', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Site added successfully!');
      } else {
        alert('Error adding site');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding site');
    }
  };

  return (
    <Container maxWidth='md'>
      <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
        <Typography variant='h4' component='h1' gutterBottom>
          Add Flying Site
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Title Section */}
          <Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
            Site Title
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label='Title (Bulgarian)'
                value={formData.title.bg}
                onChange={(e) => handleNestedChange('title', 'bg', e.target.value)}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label='Title (English)'
                value={formData.title.en}
                onChange={(e) => handleNestedChange('title', 'en', e.target.value)}
                required
              />
            </Grid>
          </Grid>

          {/* Wind Direction Section */}
          <Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
            Wind Directions
          </Typography>
          <Grid container spacing={1}>
            {windDirections.map((direction) => (
              <Grid size={{ xs: 3, sm: 2 }} key={direction}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.windDirection.includes(direction)}
                      onChange={() => handleWindDirectionChange(direction)}
                    />
                  }
                  label={direction}
                />
              </Grid>
            ))}
          </Grid>

          {/* Location Section */}
          <Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
            Location
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label='Longitude'
                type='number'
                inputProps={{ step: 'any' }}
                value={formData.location.coordinates[0]}
                onChange={(e) => handleCoordinateChange(0, e.target.value)}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label='Latitude'
                type='number'
                inputProps={{ step: 'any' }}
                value={formData.location.coordinates[1]}
                onChange={(e) => handleCoordinateChange(1, e.target.value)}
                required
              />
            </Grid>
          </Grid>

          {/* Altitude */}
          <TextField
            fullWidth
            label='Altitude (meters)'
            type='number'
            value={formData.altitude}
            onChange={(e) => handleInputChange('altitude', Number(e.target.value))}
            sx={{ mt: 2 }}
          />

          {/* Access Description */}
          <Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
            Access Description
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label='Access (Bulgarian)'
                value={formData.access?.bg}
                onChange={(e) => handleNestedChange('access', 'bg', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label='Access (English)'
                value={formData.access?.en}
                onChange={(e) => handleNestedChange('access', 'en', e.target.value)}
              />
            </Grid>
          </Grid>

          {/* Alternatives */}
          <Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
            Alternatives
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label='Alternatives (Bulgarian)'
                value={formData.alternatives?.bg}
                onChange={(e) => handleNestedChange('alternatives', 'bg', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label='Alternatives (English)'
                value={formData.alternatives?.en}
                onChange={(e) => handleNestedChange('alternatives', 'en', e.target.value)}
              />
            </Grid>
          </Grid>

          {/* Landing Fields */}
          <TextField
            fullWidth
            multiline
            rows={3}
            label='Landing Fields'
            value={formData.landingFields}
            onChange={(e) => handleInputChange('landingFields', e.target.value)}
            sx={{ mt: 2 }}
          />

          {/* Local Pilots Clubs */}
          <TextField
            fullWidth
            label='Local Pilots Clubs'
            value={formData.localPilotsClubs}
            onChange={(e) => handleInputChange('localPilotsClubs', e.target.value)}
            sx={{ mt: 2 }}
          />

          {/* Tracklogs */}
          <Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
            Tracklogs
          </Typography>
          {(formData.tracklogs || []).map((tracklog, index) => (
            <TextField
              key={index}
              fullWidth
              label={`Tracklog URL ${index + 1}`}
              value={tracklog}
              onChange={(e) => updateTracklog(index, e.target.value)}
              sx={{ mt: 1 }}
            />
          ))}
          <Button variant='outlined' onClick={addTracklog} sx={{ mt: 1 }}>
            Add Tracklog
          </Button>

          {/* Submit Button */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button type='submit' variant='contained' size='large' sx={{ px: 4 }}>
              Add Site
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default SiteForm;
