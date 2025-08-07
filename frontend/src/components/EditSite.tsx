import {
  Container,
  Paper,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  IconButton,
  CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';

import type { WindDirection, FlyingSite } from '../types';
import { useEditSiteForm } from '../hooks/useEditSiteForm';
import { NotificationDialog } from './NotificationDialog';

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

const accessOptions = [
  { _id: 0, bg: 'hike and fly', en: 'hike and fly' },
  { _id: 1, bg: 'автомобил', en: 'automobile' },
  { _id: 2, bg: 'автобус', en: 'bus' },
  { _id: 3, bg: '4х4', en: '4x4' },
  { _id: 4, bg: 'лифт', en: 'chairlift' },
];

interface EditSiteProps {
  site?: FlyingSite; // You can replace 'any' with a more specific 'FlyingSite' type
}

function EditSite({ site }: EditSiteProps) {
  const {
    formData,
    isSubmitting,
    handleNestedChange,
    handleBilingualArrayChange,
    addBilingualArrayItem,
    removeBilingualArrayItem,
    handleLandingFieldChange,
    addLandingField,
    removeLandingField,
    handleWindDirectionChange,
    handleAccessOptionChange,
    handleCoordinateChange,
    handleInputChange,
    addTracklog,
    updateTracklog,
    removeTracklog,
    handleSubmit,
    notificationDialog,
  } = useEditSiteForm(site);

  const renderBilingualArrayFields = (
    field: 'accomodations' | 'alternatives' | 'localPilotsClubs',
    title: string
  ) => (
    <>
      <Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
        {title}
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          {(formData[field]?.bg || []).map((item, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TextField
                fullWidth
                label={`${title.slice(0, -1)} ${index + 1} (Bulgarian)`}
                value={item}
                onChange={(e) => handleBilingualArrayChange(field, 'bg', index, e.target.value)}
              />
              <IconButton onClick={() => removeBilingualArrayItem(field, 'bg', index)}>
                <DeleteIcon color='primary' />
              </IconButton>
            </Box>
          ))}
          <Button
            onClick={() => addBilingualArrayItem(field, 'bg')}
            startIcon={<AddCircleOutlineIcon />}
          >
            Add
          </Button>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {(formData[field]?.en || []).map((item, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TextField
                fullWidth
                label={`${title.slice(0, -1)} ${index + 1} (English)`}
                value={item}
                onChange={(e) => handleBilingualArrayChange(field, 'en', index, e.target.value)}
              />
              <IconButton onClick={() => removeBilingualArrayItem(field, 'en', index)}>
                <DeleteIcon color='primary' />
              </IconButton>
            </Box>
          ))}
          <Button
            onClick={() => addBilingualArrayItem(field, 'en')}
            startIcon={<AddCircleOutlineIcon />}
          >
            Add
          </Button>
        </Grid>
      </Grid>
    </>
  );

  const renderLandingFields = () => (
    <>
      <Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
        Landing Fields
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          {(formData.landingFields?.bg || []).map((item, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label={`Description ${index + 1} (Bulgarian)`}
                value={item.description || ''}
                onChange={(e) =>
                  handleLandingFieldChange('bg', index, 'description', e.target.value)
                }
                sx={{ mb: 1 }}
              />
              <TextField
                fullWidth
                label='Longitude'
                type='number'
                value={item.location?.coordinates[0] || ''}
                onChange={(e) =>
                  handleLandingFieldChange('bg', index, 'coordinates', {
                    index: 0,
                    value: e.target.value,
                  })
                }
                sx={{ mb: 1 }}
              />
              <TextField
                fullWidth
                label='Latitude'
                type='number'
                value={item.location?.coordinates[1] || ''}
                onChange={(e) =>
                  handleLandingFieldChange('bg', index, 'coordinates', {
                    index: 1,
                    value: e.target.value,
                  })
                }
              />
              <Button
                onClick={() => removeLandingField('bg', index)}
                startIcon={<DeleteIcon color='primary' />}
              >
                Remove
              </Button>
            </Paper>
          ))}
          <Button onClick={() => addLandingField('bg')} startIcon={<AddCircleOutlineIcon />}>
            Add Landing Fields
          </Button>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {(formData.landingFields?.en || []).map((item, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label={`Description ${index + 1} (English)`}
                value={item.description || ''}
                onChange={(e) =>
                  handleLandingFieldChange('en', index, 'description', e.target.value)
                }
                sx={{ mb: 1 }}
              />
              <TextField
                fullWidth
                label='Longitude'
                type='number'
                value={item.location?.coordinates[0] || ''}
                onChange={(e) =>
                  handleLandingFieldChange('en', index, 'coordinates', {
                    index: 0,
                    value: e.target.value,
                  })
                }
                sx={{ mb: 1 }}
              />
              <TextField
                fullWidth
                label='Latitude'
                type='number'
                value={item.location?.coordinates[1] || ''}
                onChange={(e) =>
                  handleLandingFieldChange('en', index, 'coordinates', {
                    index: 1,
                    value: e.target.value,
                  })
                }
              />
              <Button
                onClick={() => removeLandingField('en', index)}
                startIcon={<DeleteIcon color='primary' />}
              >
                Remove
              </Button>
            </Paper>
          ))}
          <Button onClick={() => addLandingField('en')} startIcon={<AddCircleOutlineIcon />}>
            Add Landing Fields
          </Button>
        </Grid>
      </Grid>
    </>
  );

  return (
    <Container maxWidth='md'>
      <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
          {/* <Button
            variant='outlined'
            color='info'
            onClick={() => window.history.back()}
            sx={{ mr: 1 }}
            size='large'
          >
            <ArrowBackIosNewIcon />
          </Button>
          <GpsFixedIcon sx={{ mr: 1 }} /> */}
          <Typography variant='h4' component='h1' gutterBottom>
            {site ? 'Редакция на място за летене' : 'Добавяне на място за летене'}
          </Typography>
        </Box>
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

          {/* Access Options Section */}
          <Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
            Access Options
          </Typography>
          <Grid container spacing={1}>
            {accessOptions.map((option) => (
              <Grid size={{ xs: 12, sm: 6 }} key={option._id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.accessOptions.some(
                        (selected) => selected._id === option._id
                      )}
                      onChange={() =>
                        handleAccessOptionChange(option._id, option.bg, option.en)
                      }
                    />
                  }
                  label={`${option.bg} / ${option.en}`}
                />
              </Grid>
            ))}
          </Grid>

          {/* Location Section */}
          <Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
            Location
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label='Longitude'
                type='number'
                InputProps={{ inputProps: { step: 'any' } }}
                value={formData.location.coordinates[0] ?? ''}
                onChange={(e) => handleCoordinateChange(0, e.target.value)}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label='Latitude'
                type='number'
                InputProps={{ inputProps: { step: 'any' } }}
                value={formData.location.coordinates[1] ?? ''}
                onChange={(e) => handleCoordinateChange(1, e.target.value)}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label='Altitude (meters)'
                type='number'
                value={formData.altitude ?? ''}
                onChange={(e) =>
                  handleInputChange(
                    'altitude',
                    e.target.value === '' ? null : Number(e.target.value)
                  )
                }
              />
            </Grid>
          </Grid>
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
          {renderBilingualArrayFields('accomodations', 'Accomodations')}
          {renderBilingualArrayFields('alternatives', 'Alternatives')}
          {renderLandingFields()}
          {renderBilingualArrayFields('localPilotsClubs', 'Local Pilots Clubs')}
          {/* Tracklogs */}
          <Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
            Tracklogs
          </Typography>
          {(formData.tracklogs || []).map((tracklog, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TextField
                fullWidth
                label={`Tracklog URL ${index + 1}`}
                value={tracklog}
                onChange={(e) => updateTracklog(index, e.target.value)}
              />
              <IconButton onClick={() => removeTracklog(index)}>
                <DeleteIcon color='primary' />
              </IconButton>
            </Box>
          ))}
          <Button
            variant='outlined'
            onClick={addTracklog}
            startIcon={<AddCircleOutlineIcon />}
            sx={{ mt: 1 }}
          >
            Add Tracklogs
          </Button>
          {/* Submit Button */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              type='submit'
              variant='contained'
              size='large'
              sx={{
                px: 4,
                '& .MuiCircularProgress-root': {
                  color: 'white',
                },
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <CircularProgress size={24} />
              ) : site ? (
                'Update Site'
              ) : (
                'Add Site'
              )}
            </Button>
          </Box>
        </form>
      </Paper>
      <NotificationDialog
        notification={notificationDialog.notification}
        onClose={notificationDialog.hideNotification}
      />
    </Container>
  );
}

export default EditSite;
