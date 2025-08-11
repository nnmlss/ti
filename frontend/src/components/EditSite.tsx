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
  Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Controller } from 'react-hook-form';

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
  site?: FlyingSite;
}

function EditSite({ site }: EditSiteProps) {
  const {
    control,
    handleSubmit,
    watch,
    isSubmitting,
    showSuccessMessage,
    landingFields,
    tracklogsFields,
    handleWindDirectionChange,
    handleAccessOptionChange,
    addBilingualArrayItem,
    removeBilingualArrayItem,
    addLandingField,
    removeLandingField,
    addTracklog,
    removeTracklog,
    notificationDialog,
  } = useEditSiteForm(site);

  const windDirectionValues = watch('windDirection') || [];
  const accessOptionValues = watch('accessOptions') || [];

  const renderBilingualArrayFields = (
    field: 'accomodations' | 'alternatives' | 'localPilotsClubs',
    title: string
  ) => {
    const bgValues = (watch(`${field}.bg`) as string[]) || [];
    const enValues = (watch(`${field}.en`) as string[]) || [];

    return (
      <>
        <Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
          {title}
        </Typography>
        <Grid container spacing={2}>
          <Grid component='div' size={{ xs: 12, md: 6 }}>
            {bgValues.map((_value, index) => (
              <Box
                key={`${field}-bg-${index}`}
                sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
              >
                <Controller
                  name={`${field}.bg.${index}`}
                  control={control}
                  render={({ field: controllerField }) => (
                    <TextField
                      {...controllerField}
                      id={`${field}-bg-${index}`}
                      fullWidth
                      label={`${title.slice(0, -1)} ${index + 1} (Bulgarian)`}
                    />
                  )}
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
          <Grid component='div' size={{ xs: 12, md: 6 }}>
            {enValues.map((_value, index) => (
              <Box
                key={`${field}-en-${index}`}
                sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
              >
                <Controller
                  name={`${field}.en.${index}`}
                  control={control}
                  render={({ field: controllerField }) => (
                    <TextField
                      {...controllerField}
                      id={`${field}-en-${index}`}
                      fullWidth
                      label={`${title.slice(0, -1)} ${index + 1} (English)`}
                    />
                  )}
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
  };

  const renderLandingFields = () => (
    <>
      <Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
        Места за кацане
      </Typography>
      {landingFields.fields.map((field, index) => (
        <Paper key={field.id} sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid component='div' size={{ xs: 12, md: 6 }}>
              <Controller
                name={`landingFields.${index}.description.bg`}
                control={control}
                render={({ field: controllerField }) => (
                  <TextField
                    {...controllerField}
                    id={`landing-field-description-bg-${index}`}
                    name={`landing-field-description-bg-${index}`}
                    fullWidth
                    label={`Description ${index + 1} (Bulgarian)`}
                    sx={{ mb: 1 }}
                  />
                )}
              />
            </Grid>
            <Grid component='div' size={{ xs: 12, md: 6 }}>
              <Controller
                name={`landingFields.${index}.description.en`}
                control={control}
                render={({ field: controllerField }) => (
                  <TextField
                    {...controllerField}
                    id={`landing-field-description-en-${index}`}
                    name={`landing-field-description-en-${index}`}
                    fullWidth
                    label={`Description ${index + 1} (English)`}
                    sx={{ mb: 1 }}
                  />
                )}
              />
            </Grid>
            <Grid component='div' size={{ xs: 12, md: 6 }}>
              <Controller
                name={`landingFields.${index}.location.coordinates.0`}
                control={control}
                render={({ field: controllerField }) => (
                  <TextField
                    {...controllerField}
                    id={`landing-field-longitude-${index}`}
                    fullWidth
                    label='Longitude'
                    type='number'
                    slotProps={{ htmlInput: { step: 'any' } }}
                    sx={{ mb: 1 }}
                  />
                )}
              />
            </Grid>
            <Grid component='div' size={{ xs: 12, md: 6 }}>
              <Controller
                name={`landingFields.${index}.location.coordinates.1`}
                control={control}
                render={({ field: controllerField }) => (
                  <TextField
                    {...controllerField}
                    id={`landing-field-latitude-${index}`}
                    fullWidth
                    label='Latitude'
                    type='number'
                    slotProps={{ htmlInput: { step: 'any' } }}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={() => removeLandingField(index)}
              startIcon={<DeleteIcon color='primary' />}
            >
              Изтрии мястото за кацане
            </Button>
          </Box>
        </Paper>
      ))}
      <Button onClick={addLandingField} startIcon={<AddCircleOutlineIcon />}>
        Добави място за кацане
      </Button>
    </>
  );

  // Show success message if submission was successful
  if (showSuccessMessage) {
    return (
      <Container maxWidth='md'>
        <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
            <Alert severity='success' sx={{ mb: 3, width: '100%' }}>
              <Typography variant='h6' gutterBottom>
                {site
                  ? 'Успешна редакция на място за летене!'
                  : 'Добавено ново място за летене!'}
              </Typography>
              <Typography variant='body2'>
                Прозорецът ще се затвори автоматично след 5 секунди...
              </Typography>
            </Alert>

            <CircularProgress />

            <Typography variant='body2' sx={{ mt: 2, color: 'text.secondary' }}>
              Запазване на промените...
            </Typography>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth='md' sx={{ pb: 5 }}>
      <Paper elevation={0} sx={{ p: 2, mt: 2 }}>
        <form onSubmit={handleSubmit}>
          {/* Title Section */}
          <Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
            Име на старта
          </Typography>
          <Grid container spacing={2}>
            <Grid component='div' size={{ xs: 12, md: 6 }}>
              <Controller
                name='title.bg'
                control={control}
                rules={{ required: 'Bulgarian title is required' }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    id='title-bg'
                    fullWidth
                    label='Title (Bulgarian)'
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid component='div' size={{ xs: 12, md: 6 }}>
              <Controller
                name='title.en'
                control={control}
                rules={{ required: 'English title is required' }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    id='title-en'
                    fullWidth
                    label='Title (English)'
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* Wind Direction Section */}
          <Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
            Wind Directions
          </Typography>
          <Grid container spacing={1}>
            {windDirections.map((direction) => (
              <Grid component='div' size={{ xs: 3, sm: 2 }} key={direction}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id={`wind-direction-${direction.toLowerCase()}`}
                      checked={windDirectionValues.includes(direction)}
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
            Варианти на достъп
          </Typography>
          <Grid container spacing={1}>
            {accessOptions.map((option) => (
              <Grid component='div' size={{ xs: 12, sm: 6 }} key={option._id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id={`access-option-${option._id}`}
                      checked={accessOptionValues.some(
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
            <Grid component='div' size={{ xs: 12, md: 4 }}>
              <Controller
                name='location.coordinates.0'
                control={control}
                rules={{ required: 'Longitude is required' }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    id='location-longitude'
                    fullWidth
                    label='Longitude'
                    type='number'
                    slotProps={{ htmlInput: { step: 'any' } }}
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid component='div' size={{ xs: 12, md: 4 }}>
              <Controller
                name='location.coordinates.1'
                control={control}
                rules={{ required: 'Latitude is required' }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    id='location-latitude'
                    fullWidth
                    label='Latitude'
                    type='number'
                    slotProps={{ htmlInput: { step: 'any' } }}
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid component='div' size={{ xs: 12, md: 4 }}>
              <Controller
                name='altitude'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id='altitude'
                    fullWidth
                    label='Altitude (meters)'
                    type='number'
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* Access Description */}
          <Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
            Достъп
          </Typography>
          <Grid container spacing={2}>
            <Grid component='div' size={{ xs: 12, md: 6 }}>
              <Controller
                name='access.bg'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id='access-bg'
                    fullWidth
                    multiline
                    rows={4}
                    label='Access (Bulgarian)'
                    slotProps={{
                      htmlInput: {
                        id: 'access-bg',
                        name: 'access-bg',
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid component='div' size={{ xs: 12, md: 6 }}>
              <Controller
                name='access.en'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id='access-en'
                    fullWidth
                    multiline
                    rows={4}
                    label='Access (English)'
                    slotProps={{
                      htmlInput: {
                        id: 'access-en',
                        name: 'access-en',
                      },
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* Bilingual Array Fields */}
          {renderBilingualArrayFields('accomodations', 'Настаняване')}
          {renderBilingualArrayFields('alternatives', 'Друго за правене')}
          {renderLandingFields()}
          {renderBilingualArrayFields('localPilotsClubs', 'Local Pilots Clubs')}

          {/* Tracklogs */}
          <Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
            Tracklogs
          </Typography>
          {tracklogsFields.fields.map((item, index) => (
            <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Controller
                name={`tracklogs.${index}`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id={`tracklog-${index}`}
                    fullWidth
                    label={`Tracklog URL ${index + 1}`}
                  />
                )}
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
                'Обнови старта'
              ) : (
                'Добави старт'
              )}
            </Button>
          </Box>
        </form>
      </Paper>
      {/* Keep NotificationDialog only for error messages */}
      {notificationDialog.notification.severity === 'error' && (
        <NotificationDialog
          notification={notificationDialog.notification}
          onClose={notificationDialog.hideNotification}
        />
      )}
    </Container>
  );
}

export default EditSite;
