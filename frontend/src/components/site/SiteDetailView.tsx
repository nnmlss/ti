import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { WindDirectionCompass } from './WindDirectionCompass';
import { AccessOptionsView } from './AccessOptionsView';
import type { SiteDetailViewProps } from '@app-types';

export function SiteDetailView({
  site,
  onOpenLocation,
  onOpenTracklog,
  onClose,
}: SiteDetailViewProps) {
  const renderLocalizedText = (
    text: { bg?: string; en?: string } | undefined,
    label: string
  ) => {
    if (!text?.bg && !text?.en) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant='h6' gutterBottom color='primary.main'>
          {label}
        </Typography>
        {text.bg && (
          <Typography variant='body1'>
            <strong>BG:</strong> {text.bg}
          </Typography>
        )}
        {text.en && (
          <Typography variant='body1'>
            <strong>EN:</strong> {text.en}
          </Typography>
        )}
      </Box>
    );
  };

  const renderBilingualArray = (
    data: { bg?: string[]; en?: string[] } | undefined,
    label: string
  ) => {
    const hasBg = data?.bg?.some((item) => item.trim());
    const hasEn = data?.en?.some((item) => item.trim());

    if (!hasBg && !hasEn) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant='h6' gutterBottom color='primary.main'>
          {label}
        </Typography>
        <Grid container spacing={2}>
          {hasBg && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant='subtitle2' gutterBottom>
                Bulgarian:
              </Typography>
              {data!
                .bg!.filter((item) => item.trim())
                .map((item, index) => (
                  <Typography key={index} variant='body2' sx={{ mb: 1 }}>
                    • {item}
                  </Typography>
                ))}
            </Grid>
          )}
          {hasEn && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant='subtitle2' gutterBottom>
                English:
              </Typography>
              {data!
                .en!.filter((item) => item.trim())
                .map((item, index) => (
                  <Typography key={index} variant='body2' sx={{ mb: 1 }}>
                    • {item}
                  </Typography>
                ))}
            </Grid>
          )}
        </Grid>
      </Box>
    );
  };

  const renderLandingFields = () => {
    if (!site.landingFields || !Array.isArray(site.landingFields)) return null;

    const hasLandingFields = site.landingFields.some(
      (field) =>
        field.description?.bg ||
        field.description?.en ||
        (field.location?.coordinates &&
          field.location.coordinates.some((coord) => coord !== null))
    );

    if (!hasLandingFields) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant='h6' gutterBottom color='primary.main'>
          Кацалки / Landing Fields
        </Typography>
        {site.landingFields.map((field, index) => {
          const hasContent =
            field.description?.bg ||
            field.description?.en ||
            (field.location?.coordinates &&
              field.location.coordinates.some((coord) => coord !== null));

          if (!hasContent) return null;

          return (
            <Paper key={index} sx={{ p: 2, mb: 2 }}>
              {(field.description?.bg || field.description?.en) && (
                <Box sx={{ mb: 2 }}>
                  {field.description?.bg && (
                    <Typography variant='body2'>
                      <strong>BG:</strong> {field.description.bg}
                    </Typography>
                  )}
                  {field.description?.en && (
                    <Typography variant='body2'>
                      <strong>EN:</strong> {field.description.en}
                    </Typography>
                  )}
                </Box>
              )}

              {field.location?.coordinates &&
                field.location.coordinates.some((coord) => coord !== null) && (
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Typography variant='body2'>
                      Coordinates: {field.location.coordinates[1]},{' '}
                      {field.location.coordinates[0]}
                    </Typography>
                    <Button
                      size='small'
                      startIcon={<LocationOnIcon />}
                      onClick={() => onOpenLocation(field.location!.coordinates)}
                    >
                      Отвори в Google Maps
                    </Button>
                  </Box>
                )}
            </Paper>
          );
        })}
      </Box>
    );
  };

  const renderTracklogs = () => {
    const validTracklogs = site.tracklogs?.filter((log) => log.trim());
    if (!validTracklogs?.length) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant='h6' gutterBottom color='primary.main'>
          Tracklogs
        </Typography>
        {validTracklogs.map((tracklog, index) => (
          <Typography key={index} variant='body2' sx={{ mb: 1 }}>
            <Button
              variant='outlined'
              size='small'
              onClick={() => onOpenTracklog(tracklog)}
              sx={{ mb: 0.5 }}
            >
              Tracklog {index + 1}
            </Button>
          </Typography>
        ))}
      </Box>
    );
  };

  return (
    <Card sx={{ maxWidth: '98vw', mx: 'auto' }}>
      <CardContent sx={{ p: 4 }}>
        {/* Back Button and Title Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'space-arround', gap: 2, mb: 2 }}>
            <Button onClick={onClose} sx={{ mt: 0.5 }} aria-label='Go back' variant='outlined'>
              <ArrowBackIcon />
            </Button>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant='h4'
                component='h1'
                gutterBottom
                color='primary.main'
                sx={{ mb: 1 }}
              >
                {site.title.bg}
              </Typography>
              {site.title.en && (
                <Typography variant='h5' component='h2' color='text.secondary'>
                  {site.title.en}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* Basic Information */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Wind Directions & Altitude */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ textAlign: 'center' }}>
              <WindDirectionCompass windDirections={site.windDirection} size={120} />
              {site.altitude && (
                <Typography variant='h6' sx={{ mt: 2 }}>
                  {site.altitude}m
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Access Options & Location */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant='h6' gutterBottom color='primary.main'>
                Методи на достъп
              </Typography>
              <AccessOptionsView
                accessOptions={site.accessOptions}
                size={60}
                showLabels={true}
              />

              {/* Location */}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Detailed Information */}
        {renderLocalizedText(site.access, 'Достъп')}
        {renderLocalizedText(site.unique, 'Особености')}
        {renderLocalizedText(site.monuments, 'Забележителности')}
        {renderBilingualArray(site.accomodations, 'Настаняване')}
        {renderBilingualArray(site.alternatives, 'Други занимания')}
        {renderBilingualArray(site.localPilotsClubs, 'Local Pilots Clubs')}
        {renderLandingFields()}
        {renderTracklogs()}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant='contained'
            startIcon={<LocationOnIcon />}
            onClick={() => onOpenLocation(site.location.coordinates)}
          >
            Отвори в Google Maps
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
